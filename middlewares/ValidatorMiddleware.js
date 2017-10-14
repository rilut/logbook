const expressValidator = require('express-validator');

module.exports = expressValidator({
  customValidators: {
    isRolesName: (value) => {
      if (value === undefined) {
        return true;
      }
      return (value === 'Operator' || value === 'Supervisor' || value === 'Administrator');
    },
  },
});
