'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('./config/express');

var _express2 = _interopRequireDefault(_express);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('anchoring-api:index');
/* eslint-enable no-unused-vars */

// make bluebird default Promise

/* eslint-disable no-unused-vars */
// import db from './config/sequelize';
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// module.parent check is required to support mocha watch
if (!module.parent) {
    // listen on port config.port
    _express2.default.listen(_config2.default.port, function () {
        console.log('server started on port ' + _config2.default.port + ' (' + _config2.default.env + ')');
    });
}

exports.default = _express2.default;
module.exports = exports['default'];
//# sourceMappingURL=app.js.map
