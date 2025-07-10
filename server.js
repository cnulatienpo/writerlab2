const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./auth/authRoutes');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const fs = require('fs');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Global rate limit: 100 requests per minute per IP
app.use(rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 100,                 // max requests per minute
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use(express.static(path.join(__dirname, 'views')));

// Serve writer type profiles
app.get('/profile/:type', (req, res) => {
  const slug = req.params.type.toLowerCase();
  const fileName = `${slug.charAt(0).toUpperCase() + slug.slice(1)} type`;
  const filePath = path.join(__dirname, fileName);
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(404).send('Type not found');
    res.send(
      `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${fileName}</title>` +
      `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap">` +
      `<style>body{background:#111;color:#f4f4f4;font-family:'Space Grotesk',sans-serif;` +
      `padding:2rem;line-height:1.5;}button{margin-top:2rem;padding:0.75rem 1.5rem;` +
      `font-size:1rem;font-weight:bold;border:none;border-radius:8px;cursor:pointer;` +
      `background:#f4f4f4;color:#111;}#content{white-space:pre-wrap;}</style></head>` +
      `<body><div id="content">${data.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>` +
      `<button id="start">Start Game</button>` +
      `<script>document.getElementById('start').onclick=()=>{location.href='/game';}</script>` +
      `</body></html>`
    );
  });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Atlas connected');
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}).catch(err => console.log(err));
const rateLimit = require('express-rate-limit');

// Apply to all requests
app.use(rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 100,                 // limit each IP to 100 requests/min
  standardHeaders: true,
  legacyHeaders: false,
}));
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5,                   // only 5 login attempts
  message: 'Too many login attempts. Please try again later.'
});

router.post('/login', loginLimiter, login);
const rateLimit = require('express-rate-limit');
// Global rate limit: 100 requests per minute per IP
app.use(rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 100,                 // max requests per minute
  standardHeaders: true,
  legacyHeaders: false,
}));
