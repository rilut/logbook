const UserValidator = () => {
  const create = (req, res, next) => {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email')
      .notEmpty().withMessage('Email cannot be blank')
      .isEmail().withMessage('Email not valid');
    req.assert('role', 'Role cannot be blank').notEmpty()
      .isRolesName()
      .withMessage('Only accept Operator, Supervisor, or Administrator');

    req.asyncValidationErrors(true).then(() => {
      return next();
    }).catch((errors) => {
      console.log(errors);
      req.flash('errors', { msg: 'Create user failed' });
      return res.redirect('/dashboard/users');
    });
  };

  return {
    create,
  };
};

module.exports = UserValidator();
