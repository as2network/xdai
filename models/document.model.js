module.exports = function(sequelize, Sequelize) {
  var Document = sequelize.define('document', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

    transaction_id: {
        type: Sequelize.STRING,
        notEmpty: true
    },

    hash: {
        type: Sequelize.STRING,
        notEmpty: true
    },

    description: {
        type: Sequelize.TEXT
    },

    token_id: {
        type: Sequelize.TEXT
    }
  });
  
  return Document;
}