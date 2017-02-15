// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        5 Sep 2016
// * Description: Factor DB implementor file
//
var mysql = require('mysql');
//var async = require('async');

module.exports = function(app) {

    // Store module procedures on local variable
    var procedures = app.procedures.factor;
    var commonFunctions = require('../common/commonFunctions.js');

    // Declare public functions Here
    return {

        /**
         * Handles the login functionality
         * @param  {Object} pResponse [The response object in use]
         * @param  {Object} pBody    [The request body obtained]
         */
        addFactor : function (pResponse, pBody) {

            var result = {};
            // Add query params
            var query = procedures.addFactor.callStr;
            query = query.replace(procedures.addFactor.params.name, pBody.name);
            query = query.replace(procedures.addFactor.params.description, pBody.description);
            query = query.replace(procedures.addFactor.params.registerUserId, pBody.registerUserId);
            query = query.replace(procedures.addFactor.params.companyId, pBody.companyId);
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
                            } else {
                                result.value = {
                                    factorId : -1
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
         * Executes DB call to get system factors
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getFactors : function (pResponse) {

            var result = {};
            var query = procedures.getFactors.callStr;
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
         * Executes DB call to get system factors
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        viewFactors : function (pResponse) {

            var result = {};
            var query = procedures.viewFactors.callStr;
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
         * Executes DB query to remove a factorById
         * @param  {Object} pResponse [description]
         * @param  {Object} pBody     [description]
         * @return {[type]}           [description]
         */
        removeFactor : function (pResponse, pBody) {
            var result = {};
            // Add query params
            var query = procedures.removeFactor.callStr;
            query = query.replace(procedures.removeFactor.params.factorId, pBody.factorId);
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
        getFactorsReport : function (pResponse, pBody) {

            var result = {};
            // Add query params
            var query = procedures.getFactorsReport.callStr;
            query = query.replace(procedures.getFactorsReport.params.companyId, pBody.companyId);
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
        }
    }
};


