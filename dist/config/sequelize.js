'use strict';

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV || "development";

var sequelize = new _sequelize2.default(_config2.default.mysql.db, _config2.default.mysql.user, _config2.default.mysql.passwd, {
    dialect: 'mysql',
    port: _config2.default.mysql.port,
    host: _config2.default.mysql.host,
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 20000,
        acquire: 20000
    }
});

var db = {};

var modelsDir = _path2.default.normalize(__dirname + '/../models');

_fs2.default.readdirSync(modelsDir).filter(function (file) {
    return file.indexOf(".") !== 0 && file !== "index.js" && file.indexOf('.map') === -1;
}).forEach(function (file) {
    var model = sequelize.import(_path2.default.join(modelsDir, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

// Synchronizing any model changes with database.
sequelize.sync({ force: true }).then(function () {
    console.log('Database synchronized');
}).catch(function (err) {
    console.log(err);
    console.log('An error occured %j', err);
});

db.sequelize = sequelize;
db.Sequelize = _sequelize2.default;

module.exports = db;
//# sourceMappingURL=sequelize.js.map
