'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _document = require('./document.route');

var _document2 = _interopRequireDefault(_document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var swaggerJson = require('../swagger.json');

var router = _express2.default.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', function (req, res) {
  return res.send('OK');
});

router.get('/', function (req, res) {
  return res.send('Anchoring Api is working!');
});

router.get('/api-docs', function (req, res) {
  return res.send(swaggerJson);
});

// mount account routes at /account
router.use('/document', _document2.default);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=index.route.js.map
