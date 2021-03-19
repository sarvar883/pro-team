module.exports = (req, res, next) => {
  if (req.user.occupation === 'subadmin' || req.user.occupation === 'admin') {
    next();
  } else {
    return res.status(401).send({ error: 'You are not Subadmin or Admin' });
  }
};