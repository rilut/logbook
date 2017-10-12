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


exports.verifyMembership = (req, res) => {
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
          message: 'OK',
          data: member,
        });
      } else if (member && member.s_no) {
        let isValid = true;
        let message = 'Membership is not allowed';

        if (member.membership_status !== MEMBER_ACTIVE) {
          isValid = false;
        }

        const memberDob = moment(member.date_of_birth);
        if (memberDob.isValid()) {
          const age = moment().diff(memberDob, 'years');
          if (age < 21) {
            isValid = false;
          }
        } else {
          isValid = false;
        }

        const memberExpiry = moment(member.expiry_date);
        if (memberExpiry.isValid()) {
          const expiryDays = memberExpiry.diff(moment(), 'days');
          if (expiryDays < 30) {
            message = 'Warning, Membership expiry date is less than 30 days';
          }
        } else {
          isValid = false;
        }

        const memberId = member.member_id;
        if (memberId.match(/^(ST).+/) || memberId.match(/.+(S|J1|J2)$/)) {
          isValid = false;
        }
        if (isValid) message = 'OK';

        return res.json({
          status: isValid,
          message,
          data: member,
        });
      }
      return res.json({
        status: false,
        message: 'Member not found',
        data: null
      });
    });
};
