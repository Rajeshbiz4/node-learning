'use strict';

// logger


var Sequelize = require('sequelize');
var jwt = require('jsonwebtoken');

var models = require('../../models');
var bcrypt = require('bcryptjs');
var async = require('async');
// response formatter
var responseFormatter = require('../../utils/responseformatter.js');


var privateKey =
  '_1.2v^:69F61n151EodW+!925;-Cx-;m.*Z2=^y463B+9Z.49^%7I%3b62%z%;+I';


module.exports = {};
/**
 * Checks if the given user id exists in database or not
 *
 * @param {String}
 *            id User Id
 * @param {Function}
 *            callback Callbacl function
 * @return {void}
 */

module.exports.createUser = function(payload, callback) {
  var url = {
    Username: payload.Username,
    FirstName: payload.FirstName,
    LastName: payload.LastName
  };


  var user = models.User.build(url);
  user.save()
    .then(function(anotherTask) {
      if (anotherTask) {
        responseFormatter.formatServiceResponse({}, callback,
          "User created successfully.");
      }
    })
};


module.exports.getAllUser = function(payload, callback) {
  models.User.findAll({
    order: [
      ['FirstName', 'ASC']
    ]
  }).then(function(users) {
    responseFormatter.formatServiceResponse(users, callback,
      "userList fetched successfully.");
  });
};


module.exports.UpdateUser = function(payload, callback) {
  console.log("payload.UserId", payload.UserId);
  if (payload.UserId) {
    models.User.findOne({
      where: {
        id: payload.UserId
      }
    }).then(function(user) {
      if (user) {
        var url = {
          Username: payload.Username,
          FirstName: payload.FirstName,
          LastName: payload.LastName
        };

        user.update(url).then(function(user) {
          responseFormatter.formatServiceResponse(user, callback,
            "User updated successfully.");
        }).catch(function(error) {
          responseFormatter.formatServiceResponse({}, callback, error
            .message, "error");
        });

      } else {
        responseFormatter.formatServiceResponse({}, callback,
          "No such user found.", "error");
      }
    });
  } else {
    responseFormatter.formatServiceResponse({}, callback,
      "No such user found.", "error");
  }
};

/**
 * Delete user from database
 */

module.exports.deleteUser = function(UserId, callback) {
  console.log("Service call", UserId);
  models.User.destroy({
      where: {
        id: UserId.UserId
      }
    })
    .then(function() {
      responseFormatter.formatServiceResponse({}, callback,
        "User delete Sucessfully");
    })
};
