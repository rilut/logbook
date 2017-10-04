/**
 * GET /
 * Dashboard.
 */
exports.index = (req, res) => {
  res.render('dashboard/approve', {
    title: 'Approve Non-Members'
  });
};
