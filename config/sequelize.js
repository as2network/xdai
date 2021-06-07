import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import config from './config';

const env = process.env.NODE_ENV || "development";

const sequelize = new Sequelize(config.mysql.db,
                                config.mysql.user,
                                config.mysql.passwd,
    {
        dialect: 'mysql',
        port: config.mysql.port,
        host: config.mysql.host,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 20000,
            acquire: 20000,
        },
    });

const db = {};

const modelsDir = path.normalize(`${__dirname}/../models`);

fs
  .readdirSync(modelsDir)
  .filter(function(file) {
      return (file.indexOf(".") !== 0) && (file !== "index.js") && (file.indexOf('.map') === -1);
  })
  .forEach(function(file) {
      var model = sequelize.import(path.join(modelsDir, file));
      db[model.name] = model;
  });
 
Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
      db[modelName].associate(db);
  }
});
 
// Synchronizing any model changes with database.
sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.log(err);
    console.log('An error occured %j', err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;