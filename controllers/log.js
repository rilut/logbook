const Log = require('../models/Log');
const Visitor = require('../models/Visitor');

/**
 * GET /logs
 * Get all visitors logs data
 */
exports.getLogs = (req, res, next) => {
  // const query = {
  //   page: Number(req.query.page) || 1,
  //   limit: Number(req.query.limit) || 20,
  //   sort: { createdAt: -1 },
  //   populate: 'visitor'
  // };
  // Log.paginate({}, query, (err, logs) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.render('dashboard/guest-logs', {
  //     title: 'Guest Logs',
  //     logs,
  //   });
  // });
  res.render('dashboard/guest-logs', {
    title: 'Guest Logs',
  });
};

/**
 * GET /logs/:id
 * Get log data with specified id
 */
exports.getLog = (req, res, next) => {
  const id = req.params.id;
  Log.findById(id).populate('visitor').exec((err, log) => {
    if (err) {
      return next(err);
    }
    res.json({ log });
    // todo: render log detail page
  });
};

/**
 * POST /logs
 * Create a new log data 
 */
exports.postLog = (req, res, next) => {
  req.assert('nric', 'NRIC cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    res.redirect('/');
  } else {
    Visitor.findOne({ nric: req.body.nric }, { populate: 'visitor' }, (err, visitor) => {
      if (err) {
        return next(err);
      }
      if (visitor) {
        const log = new Log({
          visitor: visitor.id,
          timeOut: new Date().setHours(23, 0, 0, 0), // set initially to 11 PM
          loginSuccessful: true
        });

        log.save((err) => {
          if (err) {
            return next(err);
          }
          req.flash('success', { msg: 'New visitor login has been logged.' });
          res.redirect('/logs');
        });
      } else {
        req.flash('errors', { msg: 'Visitor information doesn\'t exist yet.' });
      }
    });
  }
};

/**
 * PUT /logs/:id
 * Update log data with specified id
 */
exports.putLog = (req, res, next) => {
  const id = req.params.id;
  const body = {
    timeIn: req.body.timeIn,
    timeOut: req.body.timeOut,
    loginSuccessful: req.body.loginSuccessful
  };
  Log.findByIdAndUpdate(id, body, { populate: 'visitor', new: true }, (err, log) => {
    if (err) {
      return next(err);
    }
    // res.json({ log });
    req.flash('success', { msg: 'Visitor information has been updated.' });
    res.redirect('/logs');
    // todo: render all visitors page
  });
};

/**
 * DEL /logs/:id
 * Update log data with specified id
 */
exports.deleteLog = (req, res, next) => {
  const id = req.params.id;
  Log.findByIdAndRemove(id, (err, log) => {
    if (err) {
      return next(err);
    }
    // res.json({ log });
    req.flash('success', { msg: 'Log has been deleted.' });
    res.redirect('/logs');
    // todo: render all visitors page
  });
};


/**
 * GET /logs/datatable
 */
exports.getLogsDatatable = (req, res) => {
  req.query.populate = 'visitor';
  Log.dataTable(req.query, (err, data) => {
    data.data = data.data.map((log) => {
      log.actionEdit = `<a href="logs/${log._id}/edit">Edit</a>`;
      return log;
    });
    res.send(data);
  });
};
