// ------------------ IMPORTS ------------------
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const rateLimit = require('express-rate-limit');

const {
  signup,
  login,
  logout,
  resetPassword,
  getProfile,
  updatePassword,
  saveWriting,
  saveDraft,
  viewDrafts,
  readDraft,
  analyzeDraft,
  showTokens,
  upload,
  desireFeedback
} = require('./authController');

// ------------------ MIDDLEWARE ------------------
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login.html');
  next();
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Try again in 15 minutes.'
});

// ------------------ ROUTES: AUTH ------------------
router.post('/signup', signup);
router.post('/login', loginLimiter, login);
router.get('/logout', logout);
router.post('/reset-password', resetPassword);

// ------------------ ROUTES: PROFILE ------------------
router.get('/profile', requireAuth, getProfile);
router.post('/update-password', requireAuth, updatePassword);

// ------------------ ROUTES: WRITING & DRAFTS ------------------
router.post('/save-writing', requireAuth, saveWriting);
router.post('/save-draft', requireAuth, saveDraft);
router.get('/drafts', requireAuth, viewDrafts);
router.get('/drafts/:filename', requireAuth, readDraft);
router.post('/analyze-draft', requireAuth, analyzeDraft);
router.post('/desire-feedback', requireAuth, desireFeedback);

// ------------------ ROUTE: UPLOAD & ANALYZE ------------------
const uploadDraft = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded');

  const filePath = path.join(__dirname, '../uploads', file.filename);
  const ext = path.extname(file.originalname).toLowerCase();

  let text = '';

  try {
    if (ext === '.txt') {
      text = fs.readFileSync(filePath, 'utf-8');
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const result = await pdfParse(dataBuffer);
      text = result.text;
    } else {
      return res.status(400).send('Unsupported file type');
    }

    req.body.content = text;
    return analyzeDraft(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to process file');
  } finally {
    fs.unlinkSync(filePath); // Clean up uploaded file
  }
};

router.post('/upload-draft', requireAuth, upload.single('file'), uploadDraft);

// ------------------ ROUTES: TOKENS ------------------
router.get('/tokens', requireAuth, showTokens);

// ------------------ EXPORT ------------------
module.exports = router;
