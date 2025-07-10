// ------------------ IMPORTS ------------------
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { default: OpenAI } = require('openai');
const User = require('../models/userModel');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ dest: 'uploads/' });

// ------------------ AUTH ------------------
const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send('User already exists');

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();

    req.session.userId = user._id;
    res.redirect('/welcome.html');
  } catch {
    res.status(500).send('Signup failed');
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Incorrect password');

    req.session.userId = user._id;
    res.redirect('/welcome.html');
  } catch {
    res.status(500).send('Login failed');
  }
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login.html'));
};

const resetPassword = async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send('Password reset. <a href="/login.html">Log in</a>');
  } catch {
    res.status(500).send('Password reset failed');
  }
};

const updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/login.html');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send('Password updated. <a href="/profile.html">Back to profile</a>');
  } catch {
    res.status(500).send('Error updating password');
  }
};

// ------------------ PROFILE ------------------
const getProfile = async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect('/login.html');

  res.sendFile(path.join(__dirname, '../views', 'profile.html'));
};

// ------------------ WRITING & DRAFTS ------------------
const saveWriting = (req, res) => {
  const { content } = req.body;
  const userId = req.session.userId;
  const filename = `writing-${userId}.txt`;

  fs.writeFile(`./sessions/${filename}`, content, err => {
    if (err) return res.status(500).send('Failed to save');
    res.send('Saved successfully. <a href="/write.html">Back</a>');
  });
};

const saveDraft = (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.userId;

  const safeTitle = title.replace(/[^a-zA-Z0-9-_]/g, '_');
  const timestamp = Date.now();
  const filename = `sessions/${userId}-${safeTitle}-${timestamp}.txt`;

  fs.writeFile(filename, content, err => {
    if (err) return res.status(500).send('Failed to save draft');
    res.send('Draft saved! <a href="/write.html">Back</a>');
  });
};

const viewDrafts = (req, res) => {
  const userId = req.session.userId;
  const dir = './sessions';

  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).send('Could not load drafts');

    const userFiles = files.filter(f => f.startsWith(userId));
    const links = userFiles.map(f => `<li><a href="/auth/drafts/${encodeURIComponent(f)}">${f}</a></li>`);

    res.send(`
      <html><body>
        <h1>Your Drafts</h1>
        <ul>${links.join('')}</ul>
        <a href="/write.html">Back to Writing</a>
      </body></html>
    `);
  });
};

const readDraft = (req, res) => {
  const { filename } = req.params;
  const userId = req.session.userId;

  if (!filename.startsWith(userId)) return res.status(403).send('Forbidden');

  fs.readFile(`./sessions/${filename}`, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Could not read draft');

    res.send(`
      <html><body>
        <h1>${filename}</h1>
        <pre>${data.replace(/</g, '&lt;')}</pre>
        <a href="/auth/drafts">Back to Drafts</a>
      </body></html>
    `);
  });
};

// ------------------ ANALYSIS ------------------
const analyzeDraft = async (req, res) => {
  const { content } = req.body;

  const prompt = `
You are an expert story analyst using the Periodic Table of Narrative Elements.
Please analyze the following text and respond in JSON format with:
- Desire
- Conflict
- Theme
- Voice
- Change
- Stakes

Text:
"""${content}"""
`;

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const feedback = result.choices[0].message.content;
    res.send(`<pre>${feedback}</pre><a href="/write.html">Back</a>`);
  } catch {
    res.status(500).send('Analysis failed');
  }
};

// ------------------ TOKENS ------------------
const showTokens = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).send('User not found');

    res.send(`
      <h1>Your Token Balance</h1>
      <p><strong>${user.tokens}</strong> tokens remaining.</p>
      <a href="/welcome.html">Back</a>
    `);
  } catch {
    res.status(500).send('Failed to load token balance');
  }
};

const viewTokenUsage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).send('User not found');

    const rows = user.usageLog.map(log => `
      <tr>
        <td>${log.date.toLocaleString()}</td>
        <td>${log.action}</td>
        <td>${log.tokensUsed}</td>
      </tr>
    `);

    res.send(`
      <h1>Your Token Usage</h1>
      <table border="1">
        <tr><th>Date</th><th>Action</th><th>Tokens Used</th></tr>
        ${rows.join('')}
      </table>
      <a href="/welcome.html">Back</a>
    `);
  } catch {
    res.status(500).send('Failed to load usage history');
  }
};

// ------------------ DESIRE CHALLENGE FEEDBACK ------------------
const desireFeedback = async (req, res) => {
  const { writing, reflection } = req.body;

  const prompt = `You are a helpful writing coach. A student completed a writing challenge about desire. Here is their writing:\n\n"""${writing}"""\n\nReflection:\n"""${reflection}"""\n\nGive a short paragraph of feedback on how clearly the desire is expressed and one suggestion to sharpen it.`;

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ feedback: result.choices[0].message.content });
  } catch {
    res.status(500).json({ error: 'AI feedback failed' });
  }
};

// ------------------ EXPORT ------------------
module.exports = {
  signup,
  login,
  logout,
  resetPassword,
  updatePassword,
  getProfile,
  saveWriting,
  saveDraft,
  viewDrafts,
  readDraft,
  analyzeDraft,
  showTokens,
  viewTokenUsage,
  upload,
  desireFeedback
};
