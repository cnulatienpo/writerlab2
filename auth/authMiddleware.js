const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login.html');
  next();
};

module.exports = { requireAuth };
