const moment = require('moment');
const Promise = require('bluebird');
const db = require('../models/sequelize');
const Visitor = require('../models/Visitor');

const MEMBER_ACTIVE = 1;

/**
 * GET /membership
 * Return all membership information.
 */
exports.index = (req, res) => {
  db.Member.findAll({})
    .then((members) => {
      res.json({ members });
    });
};


exports.postMembershipVerify = (req, res) => {
  const { nric } = req.body;
  db.Member
    .findOne({ where: {
      nric
    } })
    .then((member) => {
      if (!member) {
        return Visitor.findOne({ nric });
      }
      return Promise.resolve(member);
    })
    .then((member) => {
      // if contain _id it must from mongodb
      if (member && member._id) {
        return res.json({
          status: true,
          warning: false,
          message: 'Membership is allowed',
          data: member,
        });
      } else if (member && member.s_no) {
        let isValid = true;
        let warning = false;
        let message = 'Membership is allowed';

        if (member.membership_status !== MEMBER_ACTIVE) {
          isValid = false;
          message = 'Membership status is not active';
        }

        const memberDob = moment(member.date_of_birth);
        if (memberDob.isValid()) {
          const age = moment().diff(memberDob, 'years');
          if (age < 21) {
            isValid = false;
            message = 'Member age is less than 21 years old';
          }
        } else {
          isValid = false;
          message = 'Member birth date is not valid';
        }

        const memberExpiry = moment(member.expiry_date);
        if (memberExpiry.isValid()) {
          const expiryDays = memberExpiry.diff(moment(), 'days');
          if (expiryDays < 30) {
            warning = true;
          }
          if (expiryDays < 0) {
            isValid = false;
            message = 'Membership was expired';
          }
        } else {
          isValid = false;
          message = 'Membership expiry date is not valid';
        }

        const memberId = member.member_id;
        if (memberId.match(/^(ST).+/) || memberId.match(/.+(S|J1|J2)$/)) {
          isValid = false;
          message = 'Membership is part of subsidiary card';
        }

        return res.json({
          status: isValid,
          message,
          warning,
          data: member,
        });
      }
      return res.json({
        status: false,
        message: 'Membership not found',
        warning: false,
        data: null
      });
    });
};
