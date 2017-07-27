'use strict';
module.exports = function(sequelize, DataTypes) {
  var recovery_question = sequelize.define('recovery_question', {
    question: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return recovery_question;
};