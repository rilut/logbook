const expressValidator = require('express-validator');

module.exports = expressValidator({
  customValidators: {
    isRolesName: (value) => {
      return value !== undefined ? (value === 'Operator' || value === 'Supervisor') : true;
    },
  },
});