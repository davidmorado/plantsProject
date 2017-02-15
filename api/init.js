// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        31 Ago 2016
// * Description: Server initializer file
//

var fs = require('fs');
var mysql = require('mysql');

/**
 * Exports module constructor
 * @param  {Object} pApp [The app core variable with configuration values]
 * @return {void}      []
 */
module.exports = function(app) {

    /**
     * Initialices the Database connection
     * @return {void} [None]
     */
    var initDBConnection = function () {

        console.log('Connecting to DB...');

        var connection = mysql.createConnection({
            host : app.configSettings.dbHost,
            user : app.configSettings.dbUser,
            password : app.configSettings.dbPass,
            database : app.configSettings.dbName,
            multipleStatements: true
        });

        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting: ' + err.stack);
                return;
            }
            console.log('Connected to DB conn: ' + connection.threadId);
        });

        app.connection = connection;
    };

    /**
     * Loads all the implementor files to be used on server
     * @return {void} [None]
     */
    var loadImplementors = function () {

        app.implementors = {};
        var implementors = fs.readdirSync(__dirname + '/implementors/');
        console.log("Loading implementors...");

        implementors.forEach(function(implementor) {

            // Load all js files on folder
            if (implementor.indexOf('js')>0) {
                implementor = implementor.replace('.js', '');
                app.implementors[implementor] = require(__dirname + '/implementors/'+implementor)(app);
            }
        });
    };

    return {

        /**
         * Handles functions related to server routing
         * @type {Object}
         */
        routes: {

            /**
             * Routes initialization object
             * @return {void} []
             */
            init: function() {

                // Init DB and load implementor files
                //initDBConnection();
                loadImplementors();

                // Render index file on load
                app.get('/', function (req, res) {
                    res.sendFile('./index.html');
                });

                // USER MODULE ENDPOINTS

                app.post('/api/user/login', function(req, res) {
                    return app.implementors.user.login(res,req.body);
                });

                app.post('/api/user/getUsersByCompanyId', function(req, res) {
                    return app.implementors.user.getUsersByCompanyId(res,req.body);
                });

                app.post('/api/user/modifyUser', function(req, res) {
                    return app.implementors.user.modifyUser(res, req.body);
                });

                app.post('/api/user/removeUser', function(req, res) {
                    return app.implementors.user.removeUser(res, req.body);
                });

                // COMPANY MODULE ENDPOINTS

                app.get('/api/company/getCompanies', function(req, res) {
                    return app.implementors.company.getCompanies(res);
                });

                app.post('/api/company/addCompany', function(req, res) {
                    return app.implementors.company.addCompany(res,req.body);
                });

                app.post('/api/company/removeCompany', function(req, res) {
                    return app.implementors.company.removeCompany(res,req.body);
                });

                app.post('/api/company/getCompaniesReport', function(req, res) {
                    return app.implementors.company.getCompaniesReport(res,req.body);
                });

                //FACTOR MODULE ENDPOINTS

                app.post('/api/factor/addFactor', function(req, res) {
                    return app.implementors.factor.addFactor(res,req.body);
                });

                app.get('/api/factor/getFactors', function(req, res) {
                    return app.implementors.factor.getFactors(res);
                });

                app.get('/api/factor/viewFactors', function(req, res) {
                    return app.implementors.factor.viewFactors(res);
                });

                app.post('/api/factor/removeFactor', function(req, res) {
                    return app.implementors.factor.removeFactor(res,req.body);
                });

                app.post('/api/factor/getFactorsReport', function(req, res) {
                    return app.implementors.factor.getFactorsReport(res,req.body);
                });
                // ROLE MODULE ENDPOINTS

                app.get('/api/role/getRoles', function(req, res) {
                    return app.implementors.role.getRoles(res);
                });

                app.get('/api/role/getActions', function(req, res) {
                    return app.implementors.role.getActions(res,req.body);
                });

                app.post('/api/role/removeRole', function(req, res) {
                    return app.implementors.role.removeRole(res,req.body);
                });

                app.post('/api/role/getActionsXRole', function(req, res) {
                    return app.implementors.role.getActionsXRole(res, req.body);
                });

                app.post('/api/role/addRole', function(req, res) {
                    return app.implementors.role.addRole(res, req.body);
                });

                app.post('/api/role/getRolesByUserId', function(req, res) {
                    return app.implementors.role.getRolesByUserId(res, req.body);
                });

                //BIOPROCESS MODULE ENDPOINTS

                app.post('/api/bioProcess/addBioProcess', function(req, res) {
                    return app.implementors.bioProcess.addBioProcess(res,req.body);
                });

                app.post('/api/bioProcess/getBioProcesses', function(req, res) {
                    return app.implementors.bioProcess.getBioProcesses(res, req.body);
                });

                app.get('/api/bioProcess/getFactors', function(req, res) {
                    return app.implementors.factor.getFactors(res);
                });

                app.post('/api/bioProcess/removeBioProcess', function(req, res) {
                    return app.implementors.bioProcess.removeBioProcess(res,req.body);
                });

                app.post('/api/bioProcess/getFactorsXBioProcess', function(req, res) {
                    return app.implementors.bioProcess.getFactorsXBioProcess(res, req.body);
                });

                app.post('/api/bioProcess/getBioProcessesReport', function(req, res) {
                    return app.implementors.bioProcess.getBioProcessesReport(res, req.body);
                });

                //DATA MODULE ENDPOINTS
                //
                app.post('/api/data/addDataManual', function(req, res) {
                    return app.implementors.data.addDataManual(res, req.body);
                });

                app.post('/api/data/getData', function(req, res) {
                    return app.implementors.data.getData(res, req.body);
                });

                app.post('/api/data/removeData', function(req, res) {
                    return app.implementors.data.removeData(res, req.body);
                });

                app.post('/api/data/saveCSV', function(req, res) {
                    return app.implementors.data.saveCSV(res, req.body);
                });

                app.post('/api/data/getDataRegisters', function(req, res) {
                    return app.implementors.data.getDataRegisters(res, req.body);
                });

                //CALCULATION MODULE ENDPOINTS
                //
                app.post('/api/calculation/getCalculations', function(req, res) {
                    return app.implementors.calculation.getCalculations(res, req.body);
                });

                app.post('/api/calculation/generateCalculation', function(req, res) {
                    return app.implementors.calculation.generateCalculation(res,req.body);
                });

                app.get('/api/calculation/getRecomendedActivities', function(req, res) {
                    return app.implementors.calculation.getRecomendedActivities(res);
                });

                app.post('/api/calculation/getRangeCalculations', function(req, res) {
                    return app.implementors.calculation.getRangeCalculations(res, req.body);
                });

                app.post('/api/calculation/getProcessRegisters', function(req, res) {
                    return app.implementors.calculation.getProcessRegisters(res, req.body);
                });
            }
        }
    }
};
