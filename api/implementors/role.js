// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        3 Sep 2016
// * Description: Company DB implementor file
//
var mysql = require('mysql');
//var async = require('async');

module.exports = function(app) {

    // Store module procedures on local variable
    var procedures = app.procedures.role;
    var commonFunctions = require('../common/commonFunctions.js');

    // Declare public functions Here
    return {

        /**
         * Executes DB call to get system roles
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getRoles : function (pResponse) {

            var result = {};
            var query = procedures.getRoles.callStr;

            var connection = commonFunctions.createConnection(app);
            connection.connect(function(err) {

                if (!err) {
                    console.log("Conn init success");
                    connection.query(query,function(err,rows) {

                        if(err){
                            commonFunctions.handleDBError(pResponse, err, connection);
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
         * Executes DB query to remove a role
         * @param  {Object} pResponse [description]
         * @param  {Object} pBody     [description]
         * @return {[type]}           [description]
         */
        removeUpkeep : function (pResponse, pBody) {

            var result = {};
            // Add query params
            var query = procedures.removeUpkeep.callStr;
            query = query.replace(procedures.removeUpkeep.params.upkeepId, pBody.upkeepId);
            var connection = commonFunctions.createConnection(app);
            connection.connect(function(err) {

                if (!err) {
                    console.log("Conn init success");
                    connection.query(query,function(err,rows) {

                        if(err){
                            commonFunctions.handleDBError(pResponse, err, connection);
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
        },

        /* Executes DB call to get role actions
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getActionsXRole : function (pResponse, pBody) {

            var result = {};

            // Add query params
            var query = procedures.getActionsXRole.callStr;
            query = query.replace(procedures.getActionsXRole.params.roleId, pBody.roleId);
            var connection = commonFunctions.createConnection(app);
            connection.connect(function(err) {

                if (!err) {
                    console.log("Conn init success");
                    connection.query(query,function(err,rows) {

                        if(err){
                            commonFunctions.handleDBError(pResponse, err, connection);
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

        /* Executes DB call to get role actions
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getActions : function (pResponse) {

            var result = {};
            // Add query params
            var query = procedures.getActions.callStr;
            var connection = commonFunctions.createConnection(app);
            connection.connect(function(err) {

                if (!err) {
                    console.log("Conn init success");
                    connection.query(query,function(err,rows) {

                        if(err){
                            commonFunctions.handleDBError(pResponse, err, connection);
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
         * Adds a new  role to DB
         * @param  {Object} pResponse [The response object in use]
         * @param  {Object} pBody    [The request body obtained]
         */
        addRole : function (pResponse, pBody) {

            var result = {};
            // Add query params
            var query = procedures.addRole.callStr;
            query = query.replace(procedures.addRole.params.name, pBody.name);
            query = query.replace(procedures.addRole.params.description, pBody.description);
            query = query.replace(procedures.addRole.params.equipmentTypeId, pBody.equipmentTypeId);
            var connection = commonFunctions.createConnection(app);
            console.log(query);
            connection.connect(function(err) {

                if (!err) {
                    console.log("Conn init success");
                    connection.query(query,function(err,rows) {

                        if(err){
                            commonFunctions.handleDBError(pResponse, err, connection);
                        } else {

                            // Verify if valid
                            if(rows[0].length > 0) {
                                result.value = rows[0][0];
                            } else {
                                result.value = {
                                    roleId : -1
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
         * Executes DB call to get system roles assigned to an user
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getRolesByUserId : function (pResponse, pBody) {

            var result = {};
            var query = procedures.getRolesByUserId.callStr;
            query = query.replace(procedures.getRolesByUserId.params.userId, pBody.userId);

            var connection = commonFunctions.createConnection(app);
            connection.connect(function(err) {

                if (!err) {
                    console.log("Conn init success");
                    connection.query(query,function(err,rows) {

                        if(err){
                            commonFunctions.handleDBError(pResponse, err, connection);
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

        getUpkeepsXDate : function (pResponse, pBody) {

            var result = {};
            var query = procedures.getUpkeepsXDate.callStr;
            query = query.replace(procedures.getUpkeepsXDate.params.startDate, pBody.startDate);
            query = query.replace(procedures.getUpkeepsXDate.params.endDate, pBody.endDate);
            query = query.replace(procedures.getUpkeepsXDate.params.equipmentId, pBody.equipmentId);

            var connection = commonFunctions.createConnection(app);
            connection.connect(function(err) {

                if (!err) {
                    console.log("Conn init success");
                    connection.query(query,function(err,rows) {

                        if(err){
                            commonFunctions.handleDBError(pResponse, err, connection);
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




    }
};


