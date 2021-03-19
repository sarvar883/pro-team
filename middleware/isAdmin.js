module.exports = (req, res, next) => {
  if (req.user.occupation !== 'admin') {
    return res.status(401).send({ error: 'You are not an Admin' });
  }
  next();
};