// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        3 Sep 2016
// * Description: Company DB implementor file
//
var mysql = require('mysql');
//var async = require('async');

module.exports = function(app) {

    // Store module procedures on local variable
    var procedures = app.procedures.company;
    var commonFunctions = require('../common/commonFunctions.js');

    // Declare public functions Here
    return {

        /**
         * Handles the login functionality
         * @param  {Object} pResponse [The response object in use]
         * @param  {Object} pBody    [The request body obtained]
         */
        addCompany : function (pResponse, pBody) {

            var result = {};
            // Add query params
            var query = procedures.addCompany.callStr;
            query = query.replace(procedures.addCompany.params.name, pBody.name);
            query = query.replace(procedures.addCompany.params.description, pBody.description);

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
                                    companyId : -1
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
         * Executes DB call to get system companies
         * @param  {Object} pResponse [The current reponse object]
         * @return {[type]}           [description]
         */
        getCompanies : function (pResponse) {

            var result = {};
            var query = procedures.getCompanies.callStr;
            var connection = commonFunctions.createConnection(app);

            connection.connect(function(err) {

                if (!err) {
                    console.log("Conn init success");

                    connection.query(query,function(err,rows) {

                        if(err){
                            return commonFunctions.handleDBError(pResponse,err, connection);
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
         * Executes DB query to remove a companyById
         * @param  {Object} pResponse [description]
         * @param  {Object} pBody     [description]
         * @return {[type]}           [description]
         */
        removeCompany : function (pResponse, pBody) {

            var result = {};
            // Add query params
            var query = procedures.removeCompany.callStr;
            query = query.replace(procedures.removeCompany.params.companyId, pBody.companyId);

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

        getCompaniesReport : function (pResponse, pBody) {

            var result = {};
            // Add query params
            var query = procedures.getCompaniesReport.callStr;
            query = query.replace(procedures.getCompaniesReport.params.companyId, pBody.companyId);

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


