'use strict';
module.exports = function(sequelize, DataTypes) {
  var recovery_option = sequelize.define('recovery_option', {
    user_id: DataTypes.INTEGER,
    recovery_email: DataTypes.STRING,
    question: DataTypes.STRING,
    answer: DataTypes.STRING,
    app_type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return recovery_option;
};