// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        31 Ago 2016
// * Description: Users DB implementor file
//
var mysql = require('mysql');
//var async = require('async');

module.exports = function(app) {

    // Store module procedures on local variable
    var procedures = app.procedures.user;
    var commonFunctions = require('../common/commonFunctions.js');

    /**
     * Completes the user login getting the user permitted actions
     * @param  {Object} pResponse [The current response object]
     * @param  {Object} pUser     [The user returnedFromLogin]
     * @return {void}
     */
    var getUserWithActions = function(pConnection, pResponse, pUser){

         // Declare initial information
        var result = {};
        var query = procedures.getActionsByUserId.callStr;

        // Add query params
        query = query.replace(procedures.getActionsByUserId.params.userId, pUser.userId);

        pConnection.query(query,function(err,rows) {

            if(err){
                result.status = app.constants.httpCodes.error;
                result.value = err;
                console.log(err);
            } else {
                pUser.actions = rows[0];
                result.status = app.constants.httpCodes.success;
                result.value = pUser;
            }
            commonFunctions.endConnection(pConnection);

            return commonFunctions.giveResponse(pResponse,result);
        });
    };

    // Declare public functions Here
    return {

        /**
         * Handles the login functionality
         * @param  {Object} pResponse [The response object in use]
         * @param  {Object} pBody    [The request body obtained]
         */
        login : function (pResponse, pBody) {

            var result = {};
            // Add query params
            var query = procedures.login.callStr;
            query = query.replace(procedures.login.params.email, pBody.email);
            query = query.replace(procedures.login.params.password, pBody.password);
            var connection = commonFunctions.createConnection(app);

            connection.connect(function(err) {
                if (!err) {
                    console.log("Conn init success");
                    connection.query(query,function(err,rows) {

                        if(err){
                            return commonFunctions.handleDBError(pResponse,err, connection);
                        } else {

                            // Verify if user is valid
                            if(rows[0].length > 0) {
                                return getUserWithActions(connection,pResponse,rows[0][0]);
                            } else {

                                // No error ocurred but user is invalid
                                result.status = app.constants.httpCodes.success;
                                result.value = {};
                                commonFunctions.endConnection(connection);
                                return commonFunctions.giveResponse(pResponse,result);
                            }
                        }
                    });
                } else {
                    console.log("Conn init error");
                    return commonFunctions.handleDBError(pResponse,err, connection);
                }
            });
        },

        /**
         * Executes DB call to get users of a company by ID
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getUsersByCompanyId : function (pResponse, pBody) {

            var result = {};

            var query = procedures.getUsersByCompanyId.callStr;
            query = query.replace(procedures.getUsersByCompanyId.params.companyId, pBody.companyId);

            // Admin Validation
            if (pBody.email == 'bpadmin@gmail.com' || pBody.email == 'bpAdmin@gmail.com') {
              query = procedures.getAllUsers.callStr;
            }

            var connection = commonFunctions.createConnection(app);
            connection.connect(function(err) {

                if (!err) {
                    console.log("Conn init success");
                    connection.query(query,function(err,rows) {

                        if(err){
                            commonFunctions.handleDBError(pResponse, err,connection);
                        } else {

                            // Verify if valid
                            if(rows[0].length > 0) {
                                result.value = rows[0];
                            }

                            result.status = app.constants.httpCodes.success;
                            commonFunctions.endConnection(connection);
                            return commonFunctions.giveResponse(pResponse,result);
                        }
                    });
                }
                else {
                    console.log("Conn init error");
                    return commonFunctions.handleDBError(pResponse,err, connection);
                }
            });
        },

        /**
         * Adds or edits an user in DB
         * @param  {Object} pResponse [The response object in use]
         * @param  {Object} pBody    [The request body obtained]
         */
        modifyUser : function (pResponse, pBody) {

          var result = {};

          var userId = (pBody.userId) ? pBody.userId : -1;
          var query = procedures.modifyUser.callStr;

          // Replace query params
          query = query.replace(procedures.modifyUser.params.email, pBody.email);
          query = query.replace(procedures.modifyUser.params.password, pBody.password);
          query = query.replace(procedures.modifyUser.params.name, pBody.name);
          query = query.replace(procedures.modifyUser.params.lastName, pBody.lastName);
          query = query.replace(procedures.modifyUser.params.companyId, pBody.companyId);
          query = query.replace(procedures.modifyUser.params.rolesIds, pBody.rolesIds);
          query = query.replace(procedures.modifyUser.params.isNew, pBody.isNew);
          query = query.replace(procedures.modifyUser.params.userId, userId);

          var connection = commonFunctions.createConnection(app);
          connection.connect(function(err) {

              if (!err) {
                  console.log("Conn init success");
                  connection.query(query,function(err,rows) {

                      if(err){

                          console.log(err);
                          commonFunctions.handleDBError(pResponse, err,connection);
                      } else {

                          // Verify if valid
                          if(rows[0].length > 0) {
                              result.value = rows[0][0];
                          } else {
                              result.value = {
                                  userId : -1
                              };
                          }
                          result.status = app.constants.httpCodes.success;
                          commonFunctions.endConnection(connection);
                          return commonFunctions.giveResponse(pResponse,result);
                      }
                  });
              }
              else {
                  console.log("Conn init error");
                  return commonFunctions.handleDBError(pResponse,err, connection);
              }
          });
        },

         /**
         * Removes an existing user in DB
         * @param  {Object} pResponse [The response object in use]
         * @param  {Object} pBody    [The request body obtained]
         */
        removeUser : function (pResponse, pBody) {

          var result = {};
          var query = procedures.removeUser.callStr;

          // Replace query params
          query = query.replace(procedures.removeUser.params.userId, pBody.userId);

          var connection = commonFunctions.createConnection(app);
          connection.connect(function(err) {

              if (!err) {
                  console.log("Conn init success");
                  connection.query(query,function(err,rows) {

                      if(err){

                          console.log(err);
                          commonFunctions.handleDBError(pResponse, err,connection);
                      } else {

                            // Verify if valid
                            if(rows[0].length > 0) {
                                result.value = rows[0][0];
                            }

                            result.status = app.constants.httpCodes.success;
                            commonFunctions.endConnection(connection);
                            return commonFunctions.giveResponse(pResponse,result);
                      }
                  });
              }
              else {
                  console.log("Conn init error");
                  return commonFunctions.handleDBError(pResponse,err, connection);
              }
          });
        }
    }
};
