'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _index = require('../routes/index.route');

var _index2 = _interopRequireDefault(_index);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

if (_config2.default.env === 'development') {
  app.use((0, _morgan2.default)('dev'));
}

// parse body params and attache them to req.body
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.use((0, _cookieParser2.default)());
app.use((0, _methodOverride2.default)());
app.use((0, _cors2.default)());
// mount all routes on /api path
app.use('/', _index2.default);

app.use(function (req, res, next) {
  var err = new Error('API resource not found');
  err.status = 404;
  return next(err);
});

app.use(function (err, req, res, next) {
  // eslint-disable-line no-unused-vars
  var respMessage = {
    message: err.message || err.toString()
  };

  if (_config2.default.env === 'development') {
    respMessage.stack = err.stack;
  }
  res.status(err.status || 500).json(respMessage);
});

exports.default = app;
module.exports = exports['default'];
//# sourceMappingURL=express.js.map
