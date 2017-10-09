/**
 * GET /
 * Dashboard.
 */
exports.index = (req, res) => {
  res.render('dashboard/non-members', {
    title: 'Manage Non-Members'
  });
};

exports.visitorLogs = (req, res) => {
  res.render('dashboard/visitor-logs', {
    title: 'Visitor Logs'
  });
};

exports.realtimeLogs = (req, res) => {
  res.render('dashboard/realtime-logs', {
    title: 'Realtime Logs'
  });
};

exports.changePassword = (req, res) => {
  res.render('dashboard/change-password', {
    title: 'Change Password'
  });
};

exports.editForm = (req, res) => {
  res.render('dashboard/edit-form', {
    title: 'Edit Form'
  });
};
