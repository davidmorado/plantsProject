// *
// * Author:      David Obando Paniagua
// * Date:        18 Noviembre 2016
// * Description: Calculation DB implementor file
//
var mysql = require('mysql');
//var async = require('async');

module.exports = function(app) {

    // Store module procedures on local variable
    var procedures = app.procedures.calculation;
    var commonFunctions = require('../common/commonFunctions.js');

    // Declare public functions Here
    return {

         /**
         * Executes DB call to get system Calculations
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getCalculations : function (pResponse, pBody) {

            var result = {};

            var query = procedures.getCalculations.callStr;
            query = query.replace(procedures.getCalculations.params.companyId, pBody.companyId);

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
         * Handles the login functionality
         * @param  {Object} pResponse [The response object in use]
         * @param  {Object} pBody    [The request body obtained]
         */
        generateCalculation : function (pResponse, pBody) {
            console.log('----------------------------');
            console.log(pBody);
            var result = {};
            // Add query params
            console.log('----------------------------');
            console.log(pBody);
            var query = procedures.generateCalculation.callStr;
            query = query.replace(procedures.generateCalculation.params.result, pBody.result);
            query = query.replace(procedures.generateCalculation.params.bioProcessId, pBody.bioProcessId);
            query = query.replace(procedures.generateCalculation.params.userId, pBody.userId);
            query = query.replace(procedures.generateCalculation.params.dateRange, pBody.dateRange);
            query = query.replace(procedures.generateCalculation.params.recomendedActivityId, pBody.recomendedActivityId);
            var connection = commonFunctions.createConnection(app);
            console.log(query);
            console.log('----------------------------');
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
                                    calculationId : -1
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
         * Executes DB call to get the Recomended Activities
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getRecomendedActivities : function (pResponse, pBody) {

            var result = {};
            var query = procedures.getRecomendedActivities.callStr;
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
                            }else {
                                result.value = {
                                    recomendedActivityId : -1
                                };
                            }

                            result.status = app.constants.httpCodes.success;
                            commonFunctions.endConnection(connection);
                            console.log(rows);
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
         * Executes DB call to get system Calculations in the range of dates
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getRangeCalculations : function (pResponse, pBody) {

            var result = {};

            var query = procedures.getRangeCalculations.callStr;
            query = query.replace(procedures.getRangeCalculations.params.bioProcessId, pBody.bioProcessId);
            query = query.replace(procedures.getRangeCalculations.params.startDate, pBody.startDate);
            query = query.replace(procedures.getRangeCalculations.params.endDate, pBody.endDate);

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
         * Executes DB call to get system Process registers
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getProcessRegisters : function (pResponse, pBody) {

            var result = {};

            var query = procedures.getProcessRegisters.callStr;
            query = query.replace(procedures.getProcessRegisters.params.processId, pBody.processId);
            query = query.replace(procedures.getProcessRegisters.params.startDate, pBody.startDate);
            query = query.replace(procedures.getProcessRegisters.params.endDate, pBody.endDate);

            console.log(query);

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


