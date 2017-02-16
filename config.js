// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        31 Ago 2016
// * Description: Main app configuration file
//

// Change this when deploy is required
var currentEnvironment = 'demo';

/**
 * Main server configuration variable
 */
var configuration =
{
    develop:
    {
        port:8080,
        urlClient:'http://localhost:3000/#/',
        urlServer: 'http://localhost:8080/',
        dbName: 'BioPredictorDB',
        dbHost: 'localhost',
        dbUser: 'bpUser',
        dbPass: 'bpPass'
    },
    develop_demo:
    {
        port:8080,
        urlClient:'http://localhost:3000/#/',
        urlServer: 'http://localhost:8080/',
        dbName: 'heroku_566ced79278b69a',
        dbHost: 'us-cdbr-iron-east-04.cleardb.net',
        dbUser: 'bf0f24d1515278',
        dbPass: '240171fc'
    },
    demo:
    {
        port: process.env.PORT  || 3306,
        urlClient:'http://localhost:3000/#/',
        urlServer: 'https://biopredictor-demo.herokuapp.com',
        dbName: 'heroku_d505f16243dcbeb',
        dbHost: 'us-cdbr-iron-east-04.cleardb.net',
        dbUser: 'bcd40e86ae0725',
        dbPass: 'f9a283d5'
    },
    production:
    {
        port:8080,
        urlClient:'http://localhost:3000/#/',
        urlServer: 'http://localhost:8080/',
        dbName: 'BioPredictorDB',
        dbHost: 'localhost',
        dbUser: 'bpUser',
        dbPass: 'bpPass'
    }
};

/**
 * Handles the system registered procedures to be used
 * @type {Object}
 */
var procedures = {

    user : {
        login: {
            callStr : "CALL loginUser('@pEmail', '@pPassword')",
            params : {
                email : '@pEmail',
                password : '@pPassword'
            }
        },
        getActionsByUserId: {
            callStr : "CALL getActionsByUserId(@pUserId)",
            params : {
                userId : '@pUserId'
            }
        },
        getUsersByCompanyId : {
            callStr : "CALL getUsersByCompanyId(@pCompanyId)",
            params : {
                companyId : '@pCompanyId'
            }
        },
        modifyUser : {
            callStr : "CALL modifyUser('@pEmail','@pPassword','@pName','@pLastName',@pCompanyId, '@pRolesIds', @pIsNew, @pUserId)",
            params : {
                email : '@pEmail',
                password : '@pPassword',
                name : '@pName',
                lastName : '@pLastName',
                companyId : '@pCompanyId',
                rolesIds : '@pRolesIds',
                isNew : '@pIsNew',
                userId : '@pUserId'
            }
        },
        removeUser : {
            callStr : "CALL removeUser(@pUserId)",
            params : {
                userId : '@pUserId'
            }
        },
        getAllUsers : {
            callStr : "CALL getAllUsers()"
        }
    },
    company: {
        addCompany : {
            callStr : "CALL addCompany('@pName', '@pDescription')",
            params: {
                name: '@pName',
                description: '@pDescription'
            }
        },
        getCompanies: {
            callStr : "CALL getCompanies()"
        },
        getCompaniesReport: {
            callStr : "CALL getCompaniesReport(@pCompanyId)",
            params : {
                companyId: '@pCompanyId'
            }
        },
        removeCompany: {
            callStr : "CALL removeCompany(@pCompanyId)",
            params : {
                companyId: '@pCompanyId'
            }
        }
    },
    factor: {
        addFactor : {
            callStr : "CALL addFactor('@pName', '@pDescription', @pRegisterUserId, @pCompanyId)",
            params :{
                name: '@pName',
                description: '@pDescription',
                registerUserId: '@pRegisterUserId',
                companyId: '@pCompanyId'
            }
        },
        getFactors: {
            callStr : "CALL getAttributes()"
        },
        viewFactors: {
            callStr : "CALL viewFactors()"
        },
        removeFactor : {
            callStr : "CALL removeFactor(@pFactorId)",
            params :{
                factorId : '@pFactorId'
            }
        },
        getFactorsReport : {
            callStr : "CALL getFactorsReport(@pCompanyId)",
            params :{
                companyId : '@pCompanyId'
            }
        }
    },
    role : {
        getRoles : {
            callStr : "CALL getRoles()"
        },
        removeRole : {
            callStr : "CALL removeRole(@pRoleId)",
            params : {
                roleId : '@pRoleId'
            }
        },
        getActionsXRole : {
            callStr : "CALL getActionsXRoleId(@pRoleId)",
            params : {
                roleId : '@pRoleId'
            }
        },
        getActions : {
            callStr : "CALL getActions()"
        },
        addRole : {
            callStr : "CALL addRole('@pName', '@pDescription', '@pActionIds')",
            params : {
                name : '@pName',
                description : '@pDescription',
                actionIds : '@pActionIds'
            }
        },
        getRolesByUserId : {
            callStr : "CALL getRolesByUserId(@pUserId)",
            params : {
                userId : '@pUserId'
            }
        },


    },
    bioProcess: {
        addBioProcess : {
            callStr : "CALL addBioProcess('@pName', '@pDescription', @pRegisterUserId, @pCompanyId, '@pFactorIds')",
            params :{
                name: '@pName',
                description: '@pDescription',
                registerUserId: '@pRegisterUserId',
                companyId: '@pCompanyId',
                factorIds : '@pFactorIds'
            }
        },
        getBioProcesses: {
            callStr : "CALL getEquipmentTypes()",
            params :{
                
            }
        },
        removeBioProcess : {
            callStr : "CALL removeBioProcess(@pBioProcessId)",
            params :{
                bioProcessId : '@pBioProcessId'
            }
        },
        getFactorsXBioProcess : {
            callStr : "CALL getAttributesXEquipmentType(@equipmentTypeId)",
            params : {
                equipmentTypeId : '@equipmentTypeId'
            }
        },
        getBioProcessesReport : {
            callStr: "CALL getBioProcessesReport(@pCompanyId)",
            params : {
                companyId: '@pCompanyId'
            }
        },
        getAllBioProcesses: {
            callStr : "CALL getEquipmentTypes()"
        },
    },
    data: {
        addProcessRegister : {
            callStr : "CALL addProcessRegister(@pRegisterUser, '@pRegisterDate', @pProcessId, '@pRegisterValues')",
            params : {
                registerUser : '@pRegisterUser',
                registerDate : '@pRegisterDate',
                processId : '@pProcessId',
                registerValues : '@pRegisterValues'
            }
        },
        saveCSV : {
            callStr : "CALL saveCSVDatas(@data)",
            params : {
                data : '@data'
            }
        },
        getData : {
            callStr : "CALL getData(@pCompanyId)",
            params : {
                companyId : '@pCompanyId'
            }
        },
        removeData : {
            callStr : "CALL removeData(@pProcessRegisterId)",
            params : {
                processRegisterId : '@pProcessRegisterId'
            }
        },
        getDataRegisters : {
            callStr : "CALL getDataRegisters(@pProcessRegisterId)",
            params : {
                processRegisterId : '@pProcessRegisterId'
            }
        }
    },
    calculation: {
        getCalculations: {
            callStr : "CALL getCalculations(@pCompanyId)",
            params :{
                companyId: '@pCompanyId'
            }
        },
        generateCalculation: {
            callStr : "CALL generateCalculation(@pResult, @pBioProcessId, @pUserId, '@pDateRange', @pRecomendedActivityId)",
            params :{
                result: '@pResult',
                bioProcessId: '@pBioProcessId',
                userId: '@pUserId',
                dateRange: '@pDateRange',
                recomendedActivityId: '@pRecomendedActivityId'
            }
        },
        getRecomendedActivities: {
            callStr : "CALL getRecomendedActivities()",

        },
        getRangeCalculations: {
            callStr : "CALL getRangeCalculations(@pBioProcessId, '@pStartDate', '@pEndDate')",
            params :{
                bioProcessId: '@pBioProcessId',
                startDate: '@pStartDate',
                endDate: '@pEndDate',
            }
        },
        getProcessRegisters: {
            callStr : "CALL getProcessRegisters(@pProcessId, '@pStartDate', '@pEndDate')",
            params :{
                processId: '@pProcessId',
                startDate: '@pStartDate',
                endDate: '@pEndDate',
            }
        },
        
    }
};

/**
 * Handles main app constants
 * @type {Object}
 */
var constants = {

    httpCodes : {
        error: 400,
        success: 200
    }
};

/**
 * Gets the current configuration settings
 * @return {[type]} [description]
 */
exports.getConfiguration = function () {
    console.log('Current Env: ' + currentEnvironment);
    return configuration[currentEnvironment];
};

/**
 * Gets the current configuration settings
 * @return {[type]} [description]
 */
exports.getProcedures = function () {
    return procedures;
};

/**
 * Gets the main app defined constants
 * @return {Object} [The constants object]
 */
exports.getConstants = function () {
    return constants;
};


