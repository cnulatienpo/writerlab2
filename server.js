const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./auth/authRoutes');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

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
