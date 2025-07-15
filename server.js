const express = require('express');
// const mongoose = require('mongoose'); // Removed for no MongoDB
const session = require('express-session');
const path = require('path');
const authRoutes = require('./auth/authRoutes');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const https = require('https');

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
app.use('/games', express.static(path.join(__dirname, 'games')));

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
      `<script src="/quiz-embed.js"></script>` +
      `<script>document.getElementById('start').onclick=()=>{location.href='/elements.html';}</script>` +
      `</body></html>`
    );
  });
});

// DeepSeek API endpoint for Ray Ray
app.post('/api/deepseek/chat', async (req, res) => {
  const { messages, model = 'deepseek-chat', temperature = 0.7, max_tokens = 500 } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'DeepSeek API key not configured' });
  }

  const requestData = JSON.stringify({
    model,
    messages,
    temperature,
    max_tokens
  });

  const options = {
    hostname: 'api.deepseek.com',
    port: 443,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(requestData)
    }
  };

  const apiReq = https.request(options, (apiRes) => {
    let data = '';
    
    apiRes.on('data', (chunk) => {
      data += chunk;
    });
    
    apiRes.on('end', () => {
      try {
        const response = JSON.parse(data);
        res.json(response);
      } catch (error) {
        console.error('Error parsing DeepSeek response:', error);
        res.status(500).json({ error: 'Failed to parse API response' });
      }
    });
  });

  apiReq.on('error', (error) => {
    console.error('DeepSeek API request error:', error);
    res.status(500).json({ error: 'Failed to connect to DeepSeek API' });
  });

  apiReq.write(requestData);
  apiReq.end();
});

// Start server without MongoDB
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

