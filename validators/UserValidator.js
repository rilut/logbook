const UserValidator = () => {
  const create = (req, res, next) => {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email')
      .notEmpty()
      .withMessage('Email cannot be blank')
      .isEmail()
      .withMessage('Email not valid');
    req.assert('role', 'Role cannot be blank')
      .notEmpty()
      .isRolesName()
      .withMessage('Role only accept Operator, Supervisor, or Administrator');

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      res.redirect('/users');
    } else {
      return next();
    }
  };

  const update = (req, res, next) => {
    req.assert('email').optional().isEmail().withMessage('Email not valid');
    req.assert('role')
      .isRolesName()
      .withMessage('Role only accept Operator, Supervisor, or Administrator');

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      res.redirect('/users');
    } else {
      return next();
    }
  };

  const updateRole = (req, res, next) => {
    req.assert('role')
      .isRolesName()
      .withMessage('Role only accept Operator, Supervisor, or Administrator');

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      res.json({ status: 'error' });
    } else {
      return next();
    }
  };

  return {
    create,
    update,
    updateRole,
  };
};

module.exports = UserValidator();
