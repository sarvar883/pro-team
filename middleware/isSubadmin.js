module.exports = (req, res, next) => {
  if (req.user.occupation !== 'subadmin') {
    return res.status(401).send({ error: 'You are not a Subadmin' });
  }
  next();
};