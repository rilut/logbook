/**
 * GET /
 * Dashboard.
 */
exports.index = (req, res) => {
  res.render('dashboard/approve', {
    title: 'Manage Non-Members'
  });
};

exports.guestLogs = (req, res) => {
  res.render('dashboard/guest-logs', {
    title: 'Guest Logs'
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
