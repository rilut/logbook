/**
 * GET /
 * Dashboard.
 */
exports.index = (req, res) => {
  res.render('dashboard/non-members', {
    name: req.route.name,
    title: 'Manage Non-Members'
  });
};

exports.visitorLogs = (req, res) => {
  res.render('dashboard/visitor-logs', {
    name: req.route.name,
    title: 'Visitor Logs'
  });
};

exports.realtimeLogs = (req, res) => {
  res.render('dashboard/realtime-logs', {
    name: req.route.name,
    title: 'Realtime Logs'
  });
};

exports.changePassword = (req, res) => {
  res.render('dashboard/change-password', {
    name: req.route.name,
    title: 'Change Password'
  });
};

exports.editForm = (req, res) => {
  res.render('dashboard/edit-form', {
    name: req.route.name,
    title: 'Edit Form'
  });
};

exports.users = (req, res) => {
  res.render('dashboard/users', {
    name: req.route.name,
    title: 'Manage Users'
  });
};
