/**
 * GET /
 * Dashboard.
 */
exports.index = (req, res) => {
  res.render('dashboard/approve', {
    title: 'Approve Non-Members'
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
