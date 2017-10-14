/**
 * GET /
 * Dashboard.
 */
const index = (req, res) => {
  res.render('dashboard/non-members', {
    name: req.route.name,
    title: 'Manage Non-Members'
  });
};

const visitorLogs = (req, res) => {
  res.render('dashboard/visitor-logs', {
    name: req.route.name,
    title: 'Visitor Logs'
  });
};

const realtimeLogs = (req, res) => {
  res.render('dashboard/realtime-logs', {
    name: req.route.name,
    title: 'Realtime Logs'
  });
};

const changePassword = (req, res) => {
  res.render('dashboard/change-password', {
    name: req.route.name,
    title: 'Change Password'
  });
};

const editForm = (req, res) => {
  res.render('dashboard/edit-form', {
    name: req.route.name,
    title: 'Edit Form'
  });
};

const users = (req, res) => {
  res.render('dashboard/users', {
    name: req.route.name,
    title: 'Manage Users'
  });
};

module.exports = { changePassword, editForm, index, realtimeLogs, users, visitorLogs };
