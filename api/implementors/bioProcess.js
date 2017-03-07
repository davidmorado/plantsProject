// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        25 Sep 2016
// * Description: Factor DB implementor file
//
var mysql = require('mysql');
//var async = require('async');

module.exports = function(app) {

    // Store module procedures on local variable
    var procedures = app.procedures.bioProcess;
    var commonFunctions = require('../common/commonFunctions.js');

    // Declare public functions Here
    return {

        /**
         * Handles the login functionality
         * @param  {Object} pResponse [The response object in use]
         * @param  {Object} pBody    [The request body obtained]
         */
        addBioProcess : function (pResponse, pBody) {
            console.log(pBody);
            var result = {};
            // Add query params
            var query = procedures.addBioProcess.callStr;
            query = query.replace(procedures.addBioProcess.params.name, pBody.name);
            query = query.replace(procedures.addBioProcess.params.factorIds, pBody.factorIds);
            var connection = commonFunctions.createConnection(app);
            console.log(pBody);
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
                                    bioProcessId : -1
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
        getBioProcesses : function (pResponse, pBody) {

            var result = {};

            var query = procedures.getBioProcesses.callStr;
            

            // Admin Validation
            if (pBody.email == 'bpadmin@gmail.com' || pBody.email == 'bpAdmin@gmail.com') {
              query = procedures.getAllBioProcesses.callStr;
            }

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
        /**
         * Executes DB query to remove a bioProcessById
         * @param  {Object} pResponse [description]
         * @param  {Object} pBody     [description]
         * @return {[type]}           [description]
         */
        removeEquipmentType : function (pResponse, pBody) {
            var result = {};
            // Add query params
            var query = procedures.removeEquipmentType.callStr;
            query = query.replace(procedures.removeEquipmentType.params.equipmentTypeId, pBody.equipmentTypeId);
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

        /* Executes DB call to get bioProcess Factors
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getFactorsXBioProcess : function (pResponse, pBody) {

            var result = {};

            // Add query params
            var query = procedures.getFactorsXBioProcess.callStr;
            query = query.replace(procedures.getFactorsXBioProcess.params.equipmentTypeId, pBody.equipmentTypeId);
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
                            console.log(result.value);
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
        getBioProcessesReport : function (pResponse, pBody)
        {
            var result = {};
            // Add query params
            var query = procedures.getBioProcessesReport.callStr;
            query = query.replace(procedures.getBioProcessesReport.params.companyId, pBody.companyId);
            console.log(pBody);
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


