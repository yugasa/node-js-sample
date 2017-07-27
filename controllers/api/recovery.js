var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var moment = require('moment');
var validator = require('validator');

//bcrypt for password
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

//require for generating auth tokens
var jwt = require('jwt-simple');

// require for validating phone number
var phone = require('phone');

//initialize object for models
var db = require('../../models');

// add helper files
var helper = require('./helper');
var notification = require('./notifications');

// add query functions

module.exports = {
  getRecoveryQuestion: getRecoveryQuestion,
  setRecoveryOption : setRecoveryOption,
  listRecoveryQuestion : listRecoveryQuestion,
};

/** Api for get recovery question 
 *
 * @route /country/api/get/recovery-question
 * @method get
 * @response JSON response
 */
function getRecoveryQuestion(req, res, next) {
	//get all recovery question list
	db['postgres'].recovery_question.findAll({
	    attributes : ['question']
	}).then(function(question) {
		if (question.length) {
      return res.status(200)
        .json({
          status: 'success',
          data: question,
          message: 'Recovery question found successfully'
      	});
    } else {
    	return res.status(400)
        .json({
          status : 'error',
          message: 'Recovery question not found'
        });
    }
	}).catch(function(err) {
	      return next(err);
	});
}

/** Api for save recovery option
 *
 * @route /country/api/
 * @method post
 * @param int userId, string appType, string $question, string $recoveryEmail, string $answer
 * @response JSON response
 */
function setRecoveryOption(req, res, next) {
	//validate input
 	req.checkBody('userId', 'userId is required').notEmpty();
 	req.checkBody('recoveryEmail', 'recoveryEmail is required').notEmpty();
 	req.checkBody('answer', 'answer is required').notEmpty();
 	req.checkBody('question', 'question is required').notEmpty();
 	req.checkBody('appType', 'appType is required').notEmpty();

 	req.getValidationResult().then(function(result) {

 		if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
	      .json({
	        status: 'exception',
	        data: result.array(),
	        message: 'Validation Failed'
        });
  	} else {
		  db['postgres'].account_user.findOne({
		    where: {
		      id : req.body.userId
		    }
		  }).then(function(user) {
		    if (user) {
		      db['postgres'].recovery_option.findOne({
		        where : {
		          user_id: req.body.userId,
		          app_type: req.body.appType,
		          question: req.body.question,
		        }
		      }).then(function(question) {
		        if (question) {
			//Update recovery option
		          db['postgres'].recovery_option.update({
		            recovery_email: req.body.recoveryEmail,
		            question: req.body.question,
		            answer: req.body.answer
		          },{
		            where: {
		              id: question.id
		            },
		            returninig: true 
		          }).then(function(status) {
		            if (status) {
		              return res.status(200)
		                .json({
		                  status : 'success',
		                  message : 'Recovery option updated successfully'
		                });
		            } else {
		              return res.status(400)
		                .json({
		                  status : 'error',
		                  message : 'Recovery option not updated'
		                });
		            }
		          }).catch(function(err) {
		          	return next(err);
		          });
		        } else {
			// create recovery option
		          db['postgres'].recovery_option.create({
		            user_id: req.body.userId,
		            recovery_email: req.body.recoveryEmail,
		            question: req.body.question,
		            answer: req.body.answer,
		            app_type: req.body.appType
		          }).then(function(recoveryQuestion) {
		            if (recoveryQuestion) {
		              return res.status(200)
		                .json({
		                  status: 'success',
		                  message : 'Recovery option saved successfully'
		                });
		            } else {
		              return res.status(400)
		                .json({
		                  status: 'error',
		                  message : 'Recovery option not saved'
		                });
		            }
		          }).catch(function(err) {
		              return next(err);
		          });
		        }
		      }).catch(function(err) {
		        return next(err);
		      });
		    } else {
		      return res.status(400)
		        .json({
		          status : 'error',
		          message : 'user not found'
		        });
		    }
		  }).catch(function(err) {
		      return next(err);
		  });
		}
	});
}

/** Api for list recovery question
 *
 * @route /country/api/list-recovery-question
 * @method post
 * @param int userId, string $question, string $recoveryEmail
 * @response JSON response
 */
function listRecoveryQuestion(req, res, next) {
	//validate input
 	//req.checkBody('userId', 'userId is required').notEmpty();
 	req.checkBody('recoveryEmail', 'recoveryEmail is required').notEmpty();
 	req.checkBody('appType', 'appType is required').notEmpty();
 	req.getValidationResult().then(function(result) {
 		if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
	      .json({
	        status: 'exception',
	        data: result.array(),
	        message: 'Validation Failed'
        });
  	} else {
	    //get recovery questions  
	    db['postgres'].recovery_option.findAll({
	      where : {
	        recovery_email: req.body.recoveryEmail,
	        app_type: req.body.appType
	      },attributes: ['question']
	    }).then(function(questions) {
	    	if (questions.length) {
	    		return res.status(200)
	        .json({
	          status : 'success',
	          data: questions,
	          message : 'Recovery question finding successfully.'
	        });
	      } else {
	        return res.status(400)
	          .json({
	            status : 'error',
	            message : 'Recovery question not found.'
	          });
	      }
	    }).catch(function(err) {
	    	return next(err);
	    });
	  } 
  }).catch(function(err) {
  	return next(err);
  });
}
