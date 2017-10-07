const expressValidator = require('express-validator');

module.exports = expressValidator({
  customValidators: {
    isRolesName: (value) => {
      return (value === 'Operator' || value === 'Supervisor');
    },
  },
});
