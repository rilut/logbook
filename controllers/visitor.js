const Visitor = require('../models/Visitor');

/**
 * GET /visitor
 * Get all visitor data
 */
exports.getVisitors = (req, res) => {
  const query = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20
  };
  Visitor.paginate({}, query, (err, visitors) => {
    if (err) {
      req.flash('errors', err);
    } else {
      res.json(visitors);
      // todo: render all visitors page
    }
  });
};

/**
 * GET /visitor/:id
 * Get visitor data with specified id
 */
exports.getVisitor = (req, res) => {
  const id = req.params.id;
  Visitor.findById(id, (err, visitor) => {
    if (err) {
      req.flash('errors', err);
    } else {
      res.json({ visitor });
      // todo: render visitor detail page
    }
  });
};

/**
 * POST /visitor
 * Create a new visitor data 
 */
exports.postVisitor = (req, res) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('dob', 'Date of birth cannot be blank').notEmpty();
  req.assert('nric', 'NRIC cannot be blank').notEmpty();
  req.assert('membershipId', 'Membership ID cannot be blank').notEmpty();
  req.assert('membershipExpiry', 'Membership Expiration Date cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    res.redirect('/');
  } else {
    const visitor = new Visitor({
      name: req.body.name,
      dob: req.body.dob,
      nric: req.body.nric,
      membershipId: req.body.membershipId,
      membershipExpiry: req.body.membershipExpiry,
      otherId: req.body.otherId,
      remarks: req.body.remarks || '',
      otherFields: req.body.otherFields
    });

    visitor.save((err) => {
      if (err) {
        req.flash('errors', { msg: 'Error on creating visitor information.' });
      } else {
        req.flash('success', { msg: 'New visitor information has been created.' });
        res.redirect('/visitor');
      }
    });
  }
};

/**
 * PUT /visitor/:id
 * Update visitor data with specified id
 */
exports.putVisitor = (req, res) => {
  const id = req.params.id;
  const body = {
    otherFields: req.body.otherFields
  };
  Visitor.findByIdAndUpdate(id, body, (err, visitor) => {
    if (err) {
      req.flash('errors', err);
      res.redirect('/visitor');
    } else {
      visitor.otherFields = body.otherFields;
      res.json({ visitor });
      req.flash('success', { msg: 'Visitor information has been updated.' });
      // todo: render all visitors page
    }
  });
};
