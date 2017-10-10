const async = require('async');
const Field = require('../models/Field');
const Visitor = require('../models/Visitor');

/**
 * GET /fields
 * Get all fields data
 */
exports.getFields = (req, res, next) => {
  Field.find().exec((err, fields) => {
    if (err) {
      return next(err);
    }
    res.render('dashboard/edit-form', {
      title: 'Edit Form',
      fields
    });
  });
};

/**
 * POST /field
 * Create a new field data 
 */
exports.postField = (req, res, next) => {
  req.assert('fields', 'No field to add').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    res.redirect('/registration-form');
  } else {
    const fields = req.body.fields;
    const queries = [];
    fields.forEach((label) => {
      const field = new Field({ label });
      queries.push(field.save());
    });

    Promise.all(queries)
      .then(() => {
        req.flash('success', { msg: 'New Field(s) has been added.' });
        res.redirect('/registration-form');
      })
      .catch((err) => {
        next(err);
      });
  }
};

/**
 * DEL /field/:id
 * Delete field by id
 */
exports.deleteField = (req, res, next) => {
  const id = req.params.id;
  Field.findById(id, (err, field) => {
    if (err) {
      return next(err);
    }

    Visitor.update(
      { otherFields: { $elemMatch: { label: field.label } } },
      { $pull: { otherFields: { label: field.label } } },
      { multi: true }, (err) => {
        if (err) {
          return next(err);
        }

        Field.findByIdAndRemove(id, (err) => {
          if (err) {
            return next(err);
          }

          req.flash('success', { msg: 'Field has been deleted.' });
          res.redirect('/registration-form');
        });
      });
  });
};
