const UserValidator = () => {
  const create = (req, res, next) => {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email')
      .notEmpty().withMessage('Email cannot be blank')
      .isEmail().withMessage('Email not valid');
    req.assert('role', 'Role cannot be blank').notEmpty()
      .isRolesName()
      .withMessage('Role only accept Operator, Supervisor, or Administrator');

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      res.redirect('/dashboard/users');
    } else {
      return next();
    }
  };

  return {
    create,
  };
};

module.exports = UserValidator();
