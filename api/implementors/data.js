// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        18 Nov 2016
// * Description: Data DB implementor file
//
var mysql = require('mysql');

module.exports = function(app) {

    // Store module procedures on local variable
    var procedures = app.procedures.data;
    var commonFunctions = require('../common/commonFunctions.js');

    // Declare public functions Here
    return {

        /**
         * Adds a new  role to DB
         * @param  {Object} pResponse [The response object in use]
         * @param  {Object} pBody    [The request body obtained]
         */
        addDataManual : function (pResponse, pBody) {

            var result = {};

            // Add query params
            var query = procedures.addProcessRegister.callStr;

            query = query.replace(procedures.addProcessRegister.params.registerUser, pBody.registerUser);
            query = query.replace(procedures.addProcessRegister.params.registerDate, pBody.registerDate);
            query = query.replace(procedures.addProcessRegister.params.processId, pBody.processId);
            query = query.replace(procedures.addProcessRegister.params.registerValues, pBody.registerValues);

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
                                    processRegisterId : -1
                                };
                            }

                            // Agregamos los registros AQUI !!
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
         * Gets the data registers for the user logged
         * @param  {[type]} pResponse [description]
         * @param  {[type]} pBody     [description]
         * @return {[type]}           [description]
         */
        getData : function (pResponse, pBody) {

            var result = {};
            var query = procedures.getData.callStr;
            query = query.replace(procedures.getData.params.companyId, pBody.companyId);

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
         * Executes DB query to remove a data register
         * @param  {Object} pResponse [description]
         * @param  {Object} pBody     [description]
         * @return {[type]}           [description]
         */
        removeData : function (pResponse, pBody) {

            var result = {};

            // Add query params
            var query = procedures.removeData.callStr;
            query = query.replace(procedures.removeData.params.processRegisterId, pBody.processRegisterId);
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

        saveCSV : function (pResponse, pBody) {

            var result = {};
            var query = procedures.saveCSV.callStr;
            query = query.replace(procedures.saveCSV.params.data, pBody.data);

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
        /**
         * Gets the data registers for the user logged
         * @param  {[type]} pResponse [description]
         * @param  {[type]} pBody     [description]
         * @return {[type]}           [description]
         */
        getDataRegisters : function (pResponse, pBody) {

            var result = {};
            var query = procedures.getDataRegisters.callStr;
            query = query.replace(procedures.getDataRegisters.params.processRegisterId, pBody.processRegisterId);

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


