const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokens: { type: Number, default: 10 } // default balance
});


module.exports = mongoose.model('User', userSchema);
usageLog: [{
  action: String,
  tokensUsed: Number,
  date: { type: Date, default: Date.now }
}]
