const mongoose = require('mongoose');

exports.isParamValid = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  }
  req.flash('errors', { msg: 'Id is not valid.' });
  res.redirect('/');
};
