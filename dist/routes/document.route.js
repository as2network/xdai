'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _document = require('../controller/document.controller');

var _document2 = _interopRequireDefault(_document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

router.route('/').post(_document2.default.save);

router.route('/:referenceId').put(_document2.default.update).get(_document2.default.getOneByReferenceId);

router.route('/getByReferenceId/:referenceId').get(_document2.default.getAllByReferenceId);

router.route('/getbyHash/:hash').get(_document2.default.getByHash);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=document.route.js.map
