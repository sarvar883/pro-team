module.exports = (req, res, next) => {
  if (req.user.occupation !== 'accountant') {
    return res.status(401).send({ error: 'You are not an Accountant' });
  }
  next();
};