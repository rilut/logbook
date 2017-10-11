/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');
const methodOverride = require('method-override');
const Router = require('named-routes');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const contactController = require('./controllers/contact');
const logController = require('./controllers/log');
const visitorController = require('./controllers/visitor');
const dashboardController = require('./controllers/dashboard');
const fieldController = require('./controllers/field');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Middlewares.
 */
const objectId = require('./middlewares/objectId');
const role = require('./middlewares/role');
const validatorMiddleware = require('./middlewares/ValidatorMiddleware');

/**
 * Validators.
 */
const userValidator = require('./validators/UserValidator');

/**
 * Create Express server.
 */
const app = express();

/**
 * App routes
 */
const router = new Router();
router.extendExpress(app);
router.registerAppHelpers(app);

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

let maxAge = 0;
if (process.env.ENV === 'prod') {
  maxAge = 31557600000;
}
app.use(express.static(path.join(__dirname, 'public'), { maxAge }));
app.use(methodOverride('_method'));
app.use(validatorMiddleware);

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

app.get('/logs', 'dashboard.visitor-logs', passportConfig.isAuthenticated, logController.getLogs);
app.get('/logs/datatable', passportConfig.isAuthenticated, logController.getLogsDatatable);
app.get('/logs/csv', passportConfig.isAuthenticated, logController.exportCSV);
app.get('/logs/:id', passportConfig.isAuthenticated, objectId.isParamValid, logController.getLog);
app.post('/logs', passportConfig.isAuthenticated, logController.postLog);
app.put('/logs/:id', passportConfig.isAuthenticated, objectId.isParamValid, logController.putLog);
app.delete('/logs/:id', passportConfig.isAuthenticated, objectId.isParamValid, logController.deleteLog);

app.get('/non-members', 'dashboard.non-members', passportConfig.isAuthenticated, visitorController.getVisitors);
app.get('/non-members/datatable', passportConfig.isAuthenticated, visitorController.getVisitorsDatatable);
app.get('/non-members/csv', passportConfig.isAuthenticated, visitorController.exportCSV);
app.get('/non-members/:id', passportConfig.isAuthenticated, objectId.isParamValid, visitorController.getVisitor);
app.put('/non-members/:id', passportConfig.isAuthenticated, objectId.isParamValid, visitorController.putVisitor);
app.put('/non-members/:id/field', passportConfig.isAuthenticated, objectId.isParamValid, visitorController.addFieldVisitor);
app.post('/non-members', passportConfig.isAuthenticated, visitorController.postVisitor);
app.delete('/non-members/:id', passportConfig.isAuthenticated, visitorController.removeVisitor);
app.delete('/non-members/:id/field', passportConfig.isAuthenticated, objectId.isParamValid, visitorController.removeFieldVisitor);

app.get('/users', 'dashboard.users', dashboardController.users);
app.get('/users/datatable', passportConfig.isAuthenticated, userController.getUsersDatatable);
app.post('/users', passportConfig.isAuthenticated, userValidator.create, userController.postUser);
app.get('/users/:id', passportConfig.isAuthenticated, userController.getUser);
app.put('/users/:id', passportConfig.isAuthenticated, userValidator.update, userController.putUser);
app.delete('/users/:id', passportConfig.isAuthenticated, userController.deleteUser);

/**
 * Dashboard app routes
 */
app.get('/visitor-logs', 'dashboard.visitor-logs', dashboardController.visitorLogs);
app.get('/realtime-logs', 'dashboard.realtime-logs', dashboardController.realtimeLogs);
app.get('/non-members-form', 'dashboard.non-members-form', dashboardController.editForm);
// app.get('/dashboard/change-password', dashboardController.changePassword);
app.get('/registration-form', 'dashboard.registration-form', fieldController.getFields);
app.post('/registration-form', fieldController.postField);
app.delete('/registration-form/:id', fieldController.deleteField);
/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
