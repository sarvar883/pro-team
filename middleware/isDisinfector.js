module.exports = (req, res, next) => {
  if (req.user.occupation !== 'disinfector') {
    return res.status(401).send({ error: 'You are not a Disinfector' });
  }
  next();
};