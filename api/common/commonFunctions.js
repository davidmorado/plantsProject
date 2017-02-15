var mysql = require('mysql');
var async = require('async');

/**
 * Sets the current response values
 * @param  {Object} pResponse [The response object in user]
 * @param  {Object} pResult   [The result obtained from query]
 * @return {void}           []
 */
exports.giveResponse = function(pResponse, pResult) {
    pResponse.status(pResult.status);
    pResponse.send(pResult.value);
};

/**
 * Generec error handler for DB errors
 * @param  {Objcet} pResponse [The current response]
 * @param  {Object} pError    [The Error ocurred]
 * @return {[type]}           [description]
 */
exports.handleDBError = function(pResponse, pError, pConnection) {

    var result = {};
    console.log(pError);
    result.status = 400;
    result.value = pError;
    this.endConnection(pConnection);
    this.giveResponse(pResponse,result);
};

/**
 * Creates a new DB connection for a query
 * @param  {[type]} pApp [description]
 * @return {[type]}      [description]
 */
exports.createConnection = function(pApp) {

    var connection = mysql.createConnection({
        host : pApp.configSettings.dbHost,
        user : pApp.configSettings.dbUser,
        password : pApp.configSettings.dbPass,
        database : pApp.configSettings.dbName,
        multipleStatements: true
    });

    return connection
};

/**
 * Ends the DB connection
 * @param  {[type]} pApp [description]
 * @return {[type]}      [description]
 */
exports.endConnection = function(pConnection) {


    var options = { timeout: 60000 };

    pConnection.end(options,function(err) {
        if(err) {
            console.log("Error ending connection");
            console.log(err);
        } else {
            console.log("Connection ended succesfully");
        }
    });

};
