/**
 * Here comes the almighty one, the ruler of everything...
 * Let me introduce to you, ADMINISTRATOR!
 * **Undertaker theme song**
 */
exports.isAdministrator = (req, res, next) => {
  if (req.user.role === 'Administrator') {
    return next();
  }
  req.flash('errors', { msg: 'Only administrators allowed to open this module.' });
  res.redirect('/');
};

/**
 * "You're much stronger than you think you are, trust me." -̶S̶u̶p̶e̶r̶m̶a̶n̶  Supervisor
 */
exports.isSupervisor = (req, res, next) => {
  if (req.user.role === 'Supervisor' || req.user.role === 'Administrator') {
    return next();
  }
  req.flash('errors', { msg: 'Only supervisor and administrator allowed to open this module.' });
  res.redirect('/');
};
