
const db = require('../models/sequelize');

/**
 * GET /membership
 * Return all membership information.
 */
const index = (req, res) => {
  db.Member.findAll({})
    .then((members) => {
      res.json({ members });
    });
};

module.exports = { index };
