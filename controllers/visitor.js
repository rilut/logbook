const csv = require('json2csv');
const Visitor = require('../models/Visitor');

/**
 * GET /non-members
 * Get all visitor data
 */
exports.getVisitors = (req, res, next) => {
  // const query = {
  //   page: Number(req.query.page) || 1,
  //   limit: Number(req.query.limit) || 20,
  //   sort: { createdAt: -1 }
  // };
  // Visitor.paginate({ deleted: false }, query, (err, visitors) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.render('dashboard/non-members', {
  //     title: 'Manage Non-Members',
  //     nonMembers: visitors,
  //   });
  // });
  res.render('dashboard/non-members', {
    name: req.route.name,
    title: 'Manage Non-Members',
  });
};

/**
 * GET /non-members/:id
 * Get visitor data with specified id
 */
exports.getVisitor = (req, res, next) => {
  const id = req.params.id;
  Visitor.findById(id, (err, visitor) => {
    if (err) {
      return next(err);
    }
    res.json({ visitor });
    // todo: render visitor detail page
  });
};

/**
 * POST /non-members
 * Create a new visitor data 
 */
exports.postVisitor = (req, res, next) => {
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
        return next(err);
      }
      req.flash('success', { msg: 'New visitor information has been created.' });
      res.redirect('/non-members');
    });
  }
};

/**
 * PUT /non-members/:id
 * Update visitor data with specified id
 */
exports.putVisitor = (req, res, next) => {
  const id = req.params.id;
  const body = {
    otherFields: req.body.otherFields
  };
  Visitor.findByIdAndUpdate(id, body, { new: true }, (err, visitor) => {
    if (err) {
      return next(err);
    }
    res.json({ visitor });
    req.flash('success', { msg: 'Visitor information has been updated.' });
    // todo: render all visitors page
  });
};

/**
 * PUT /non-members/:id/field
 * Add a new field with it's value to a visitor with specified id
 */
exports.addFieldVisitor = (req, res, next) => {
  const id = req.params.id;
  const newField = {
    label: req.body.label,
    value: req.body.value
  };
  Visitor.findByIdAndUpdate(id, {
    $addToSet: { otherFields: newField }
  }, { new: true }, (err, visitor) => {
    if (err) {
      return next(err);
    }
    res.json({ visitor });
    req.flash('success', { msg: 'Visitor information has been updated.' });
    // todo: render all visitors page
  });
};

/**
 * DEL /non-members/:id/field
 * Remove an existing field with it's value from a visitor with specified id
 */
exports.removeFieldVisitor = (req, res, next) => {
  const id = req.params.id;
  const label = req.body.label;
  Visitor.findByIdAndUpdate(id, {
    $pull: { otherFields: { label } }
  }, { new: true }, (err, visitor) => {
    if (err) {
      return next(err);
    }
    res.json({ visitor });
    req.flash('success', { msg: 'Visitor information has been updated.' });
    // todo: render all visitors page
  });
};

/**
 * DEL /non-members/:id
 * Remove visitor data with specified id
 */
exports.removeVisitor = (req, res, next) => {
  const id = req.params.id;
  Visitor.findById(id, (err, visitor) => {
    if (err) {
      return next(err);
    }
    visitor.delete(req.user._id, () => {
      res.json({ visitor });
      // todo: render visitor detail page
    });
  });
};

/**
 * GET /visitors/datatable
 */
exports.getVisitorsDatatable = (req, res) => {
  Visitor.dataTable(req.query, (err, data) => {
    res.send(data);
  });
};

/**
 * GET /non-members/csv
 * Download CSV of all visitor.
 */
exports.exportCSV = (req, res, next) => {
  Visitor.find({ deleted: false }, (err, visitors) => {
    if (err) {
      return next(err);
    }
    const fields = ['name', 'dob', 'nric', 'membershipId', 'membershipExpiry', 'otherId', 'remarks'];
    const fieldNames = ['Name', 'Date of Birth', 'NRIC', 'Membership ID', 'Membership Expiration Date', 'Other ID', 'Remarks'];
    const data = csv({
      data: visitors,
      fields,
      fieldNames
    });
    res.attachment('visitors.csv');
    res.send(data);
  });
};
