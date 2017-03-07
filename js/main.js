// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        19 Ago 2016
// * Description: Base app js file (routing and config included)
//

'use strict';
/**
 * Bio Predictor module declaration
 * @type {[type]}
 */
var bioPredictorApp = angular.module('bioPredictorApp', [
  'ui.router',
  'ui.bootstrap',
  'LocalStorageModule',
  'datePicker'
]);


bioPredictorApp.run(['$rootScope', '$state', '$timeout', '$location', 'sessionService', 'configFactory',
 function($rootScope, $state, $timeout, $location, sessionService,configFactory) {

    // variable Declaration
    $rootScope.isLogin = false;
    $rootScope.isMenu = false;
    $rootScope.returnMessages = configFactory.getReturnMessages();
    $rootScope.actions = configFactory.getSystemActions();
    $rootScope.navBarItems = configFactory.getNavBarItems();

    $rootScope.sessionKeys = {
        modifyUser: 'modifyUser',
        modifyData : 'modifyData'
    };


    /**
     * Displays the loading animation when called
     * @return {void}
     */
    $rootScope.displayLoading = function () {

        var messageItem = angular.element(document.getElementsByClassName('bp-content-load-panel')[0]);
        messageItem.css('height', '100vh');
        messageItem.css('padding-top', '38vh');
        messageItem.css('opacity', '0.9');
        messageItem.css('z-index', '100');
    };

    /**
     * Hides the login animation when calle
     * @return {void}
     */
    $rootScope.hideLoading =  function () {

        var messageItem = angular.element(document.getElementsByClassName('bp-content-load-panel')[0]);
        $timeout(function() {
            messageItem.css('opacity', '0');
        }, 300);
        $timeout(function() {
            messageItem.css('height', '0');
            messageItem.css('padding-top', '0');
            messageItem.css('z-index', '-1');
        }, 400);
    };

    /**
     * Handles the menu redirect functionality
     * @param  {String} pState [The module state to redirect]
     * @return {void}        []
     */
    $rootScope.redirect = function(pState) {

        var navBar = angular.element(document.getElementsByClassName('navbar-collapse')[0]);
        if(navBar.hasClass('in')) {
            navBar.toggleClass('in');
        }
        $state.go(pState);
    };

    $rootScope.logOut = function () {
        sessionService.logOut();
        $state.go('/');
    };


    $rootScope.$on('$viewContentLoading', function(event, viewConfig){

        //User login Validation
        var currentUser = sessionService.getCurrentUser();
        if(!currentUser) {
            $state.go('/');
        }
    });
}]);

// Init the App configuration in this section
bioPredictorApp.config(['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider',
  function($stateProvider, $urlRouterProvider,localStorageServiceProvider) {

    // Init session storage

    //console.log("HERE");
    localStorageServiceProvider.setStorageType('sessionStorage');

    //$urlRouterProvider.otherwise('/');

    // Here we configure the app routing
    $stateProvider
    .state('/', {
        url: '/',
        templateUrl: 'views/users/login.html',
        controller: 'loginController'
    })
    .state('menu', {
        url: '/menu',
        templateUrl: 'views/common/menu.html',
        controller: 'menuController'
    })
    .state('bp-list', {
        url: '/bp-list',
        templateUrl: 'views/bio-processes/bio-processes-list.html',
        controller: 'listBioProcessesController'
    })
    .state('companies-list', {
        url: '/companies-list',
        templateUrl: 'views/companies/companies-list.html',
        controller: 'listCompaniesController'
    })
    .state('factors-list', {
        url: '/factors-list',
        templateUrl: 'views/factors/factors-list.html',
        controller: 'listFactorsController'
    })
    .state('roles-list', {
        url: '/roles-list',
        templateUrl: 'views/roles/roles-list.html',
        controller: 'listRolesController'
    })
    .state('users-list', {
        url: '/users-list',
        templateUrl: 'views/users/users-list.html',
        controller: 'listUsersController'
    })
    .state('reports', {
        url: '/reports',
        templateUrl: 'views/reports/reports.html',
        controller: 'reportsController'
    })
    .state('modify-user', {
        url: '/modify-user',
        templateUrl: 'views/users/modify-user.html',
        controller: 'modifyUserController'
    })
    .state('data-list', {
        url: '/data-list',
        templateUrl: 'views/data/data-list.html',
        controller: 'listDataController'
    })
    .state('modify-data', {
        url: '/modify-data',
        templateUrl: 'views/data/modify-data.html',
        controller: 'modifyDataController'
    })
    .state('data-csv', {
        url: '/data-csv',
        templateUrl: 'views/data/data-csv.html',
        controller: 'loadDataCsv'
    })
    .state('calculations-list', {
        url: '/calculations-list',
        templateUrl: 'views/calculations/calculations-list.html',
        controller: 'listCalculationsController'
    })
    ;
}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        23 Nov 2016
// * Description: Common functions file
//

'use strict';

bioPredictorApp.factory('commonFunctions', function() {

    return {
         /**
         * Gets the Date String with DB format
         * @param  {Date} pDate [The Date object to format]
         * @return {String}       [The string object to be used]
         */
        getStingFormatDate : function (pDate) {

          var registerDate = 'DD/MM/YYYY HH:MM';

          registerDate = registerDate.replace('DD',pDate.getDate());
          registerDate = registerDate.replace('MM',pDate.getMonth() + 1);
          registerDate = registerDate.replace('YYYY',pDate.getFullYear());
          registerDate = registerDate.replace('HH',pDate.getHours());
          registerDate = registerDate.replace('MM',pDate.getMinutes());

          return registerDate;
        },

        /**
         * Gets the string to store the register values on DB
         * @param  {[factor]} pRegisters [The list of factor with values from DB]
         * @return {String}            [The string format for DB insert]
         */
        getRegisterValuesString : function (pRegisters) {

            var result = '';

            for(var registerIndex = 0; registerIndex < pRegisters.length; registerIndex++) {
                var register = pRegisters[registerIndex];
                result += '({id},' + register.factorId + ',' + register.value + '),';
            }

            return result.slice(0, -1);
        }

    };
});


// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        2 Set 2016
// * Description: Config Factory file
//

'use strict';

bioPredictorApp.factory('configFactory', function() {

    var currentEnvironment = 'develop';

    var configuration =
    {
        develop:
        {
            serverURL:'http://localhost:8080',
            appURL:'http://localhost:3000/#/'
        },
        demo:
        {
            serverURL:'https://biopredictor-demo.herokuapp.com',
            appURL:'http://localhost:3000/#/'
        },
        production: {
            serverURL:'http://localhost:8080',
            appURL:'http://localhost:3000/#/'
        }
    };

    /**
     * All system return messages
     * @type {Object}
     */
    var returnMessages = {

        //Error
        requestError : 'No se puede connectar con el serivor, intente más tarde',
        emailOrPassIncorrect : 'Correo o contraseña incorrectos',
        companyNameRequired : 'Por favor ingrese un nombre para la compañía',
        loadCompaniesError : 'Ha ocurrido un error cargando las compañías',
        removeCompanyError : 'Ha ocurrido un error removiendo la compañía',
        removeCompanyInvalid : 'La compañía no puede ser removida',
        removeUpkeepError: 'Ha ocurrido un error removiendo el mantenimiento',
        removeUpkeepInvalid : 'El mantenimiento no puede ser removido',
        loadUpkeepsError : 'Ha ocurrido un error cargando los mantenimientos.',
        loadBioProcessesError : 'Ha ocurrido un error cargando los Tipos de Equipos',
        loadActionsError: 'Ha ocurrido un error cargando las acciones',
        fieldsRequired: 'Por favor ingrese todos los datos.',
        factorNameRequired : 'Por favor ingrese un nombre para el Equipo',
        loadEquipmentsError : 'Ha ocurrido un error cargando los Equipos',
        removeEquipmentInvalid : 'El equipo no puede ser removido',
        removeEquipmentError : 'Ha ocurrido un error removiendo el Equipo',
        loadUsersError : 'Ha ocurrido un error cargando los usuarios',
        loadDataError : 'Ha ocurrido un error cargando los datos',
        loadCalculationsError: 'Ha ocurrido un error cargando los calculos',
        userNameRequired : 'El nombre del usuario es requerido.',
        userLastNameRequired : 'El apellido del usuario es requerido.',
        userEmailRequired : 'El email del usuario es requerido.',
        userPasswordRequired : 'La contraseña de usuario es requerida.',
        userCompanyRequired : 'La compañia del usuario es requerida.',
        userInfoRequired : 'Por favor ingrese la información del usuario.',
        emailAlreadyTaken : 'El email ingresado ya se encuentra en uso',
        removeUserError: 'El usuario no puede ser removido',
        addDataError : 'Ha ocurrido un error guardando los datos',
        removeDataInvalid : 'Los datos no pueden ser removidos',
        removeDataError : 'Ha ocurrido un error removiendo los datos',
        removeEquipmentTypeError : 'Ha ocurrido un error removiendo el Tipo de Equipo',
        removeEquipmentTypeInvalid : 'El tipo de equipo no pudo ser removido',
        invalidRangeOfDates : 'El Rango de fechas es invalido',
        invalidBioProcess : 'El Bio Proceso seleccionado es invalido',
        bioProcessAddSuccess : 'El BioProceso ha sido agregado exitosamente',
        calculationAddSuccess : 'El Calculo ha sido registrado exitosamente',
        loadProcessRegistersError : 'Ha ocurrido un Error cargando los registros del Bio Proceso',
        noUpkeep : 'No se ha realizado ningun mantenimiento.',
        equipmentTypeRequired : 'El tipo de equipo es requerido.',
        equipmentCodeRequired : 'El código del equipo es requerido.',

        //Success
        companyAddSuccess : 'La compañía ha sido agregada exitosamente',
        companyRemoveSucess : 'La compañía ha sido removida exitosamente',
        upkeepRemoveSuccess : 'El mantenimiento ha sido removido exitosamente',
        roleAddSuccess : 'El rol ha sido agregado exitosamente',
        factorAddSuccess : 'El mantenimiento ha sido registrado exitosamente.',
        equipmentRemoveSuccess : 'El Equipo ha sido removido exitosamente',
        userAddSuccess : 'El usuario ha sido modificado exitosamente',
        removeUserSuccess : 'El usuario ha sido removido exitosamente',
        addDataSuccess : 'Los datos han sido agregados exitosamente',
        dataRemoveSucess : 'Los datos han sido removidos exitosamente',
        equipmentTypeRemoveSuccess : 'El tipo de equipo ha sido removido exitosamente',
        bioProcessNameRequired : 'El nombre del BioProceso es requerido',
        equipmentAddSuccess : 'El equipo ha sido registrado exitosamente.',
    };

    /**
     * All system permited actions
     * @type {Object}
     */
    var actions = {
        // Users
        addUser :'addUser',
        editUser : 'editUser',
        viewListUser : 'viewListUser',
        removeUser: 'removeUser',
        //Companies
        addCompany : 'addCompany',
        viewListCompany : 'viewListCompany',
        removeCompany : 'removeCompany',
        // Roles
        addRole : 'addRole',
        viewListRole : 'viewListRole',
        removeRole : 'removeRole',
        // Factors
        addFactor : 'addFactor',
        viewListFactor : 'viewListFactor',
        removeFactor : 'removeFactor',
        //Bio Process
        addBioProcess : 'addBioProcess',
        viewBioProcess : 'viewBioProcess',
        removeBioProcess : 'removeBioProcess',
        // Data
        addDataCSV : 'addDataCSV',
        addDataManual : 'addDataManual',
        viewListData : 'viewListData',
        removeData : 'removeData',
        // Calculation
        generateCalculation : 'generateCalculation',
        viewListCalculation : 'viewListCalculation',
        removeCalculation : 'removeCalculation',
        // Reports
        reportCompanies : 'reportCompanies',
        reportFactors : 'reportFactors',
        reportBioProcesses : 'reportBioProcesses',
        reportData : 'reportData',
        reportCalculations : 'reportCalculations'
    };

    // Navigation control variable for menu
    var navBarItems = [
        {
            text : 'Tipos de Equipos',
            class : 'bp-bio-process',
            state : 'bp-list',
            icon : './images/icons/tiposEquipos.png'
        },
        {
            text : 'Equipos',
            class : 'bp-factor',
            state : 'factors-list',
            icon : './images/icons/bio_procesos_icon.png'
        },
        {
            text : 'Mantenimientos',
            class : 'bp-role',
            state : 'roles-list',
            icon : './images/icons/mantenimiento.png'
        },
        {
            text : 'Usuarios',
            class : 'bp-user',
            state : 'users-list',
            icon : './images/icons/user_icon.png'
        },

        // {
        //     text : 'Compañias',
        //     class : 'bp-company',
        //     state : 'companies-list',
        //     icon : './images/icons/companies_icon.png'
        // },
        // {
        //     text : 'Datos',
        //     class : 'bp-data',
        //     state : 'data-list',
        //     icon : './images/icons/data_icon.png'
        // },
        // {
        //     text : 'Reportes',
        //     class : 'bp-report',
        //     state : 'reports',
        //     icon : './images/icons/reportes_icon.png'
        // },
        // {
        //     text : 'Cálculos',
        //     class : 'bp-calculation',
        //     state : 'calculations-list',
        //     icon : './images/icons/calculos_icon.png'
        // }
    ];

    return {
        /**
         * Gets the configuration from file
         * @return {Objcet} [The configuration file to be used]
         */
        getConfiguration : function() {
            return configuration[currentEnvironment];
        },

        /**
         * Gets the page return messages
         * @return {[type]} [description]
         */
        getReturnMessages : function () {
            return returnMessages;
        },

        /**
         * Gets the system permited actions
         * @return {[type]} [description]
         */
        getSystemActions : function() {
            return actions;
        },

        /**
         * Gets the system navbar items
         * @return {[type]} [description]
         */
        getNavBarItems : function() {
            return navBarItems;
        }
    };
});


bioPredictorApp.directive('fileReader', function() {
  return {
    scope: {
      fileReader:"="
    },
    link: function(scope, element) {
      $(element).on('change', function(changeEvent) {
        var files = changeEvent.target.files;
        if (files.length) {
          var reader = new FileReader();
          reader.onload = function(e) {
              var contents = e.target.result;
              scope.$apply(function () {
                scope.fileReader = contents;
              });
          };
          reader.readAsText(files[0]);
        }
      });
    }
  };
});

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        2 Set 2016
// * Description: Config Factory file
//

'use strict';

bioPredictorApp.factory('request', ['$http', '$q', function($http, $q) {

    return {

        /**
         * Http post method wrapper
         * @param  {Sring} pUrl  [The url to pos the data ]
         * @param  {Object} pData [The request body to be sent]
         * @return {Object}       [The response from server]
         */
        post: function(pUrl, pData){

            var deferred = $q.defer();

            $http({
                url: pUrl,
                method: 'POST',
                data: pData,
                //withCredentials: true
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status) {
                deferred.reject(data, status);
            });
            //return the pormise object
            return deferred.promise;
        },

        /**
         * Http get method wrapper
         * @param  {string} pUrl [The url to get from]
         * @return {Object}      [Result obtained from request]
         */
        get: function(pUrl) {
            var deferred = $q.defer();

            $http({
                url: pUrl,
                method: 'GET',
                //withCredentials: true
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status) {
                deferred.reject(status, data);
            });
            //return the pormise object
            return deferred.promise;
        },

    };
}]);

// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Factors Service handle file
//

'use strict';

bioPredictorApp.service('bioProcessesService', function(configFactory, request) {



    var baseUrl = configFactory.getConfiguration().serverURL;
    var bioProcessesUrl = baseUrl + '/api/bioProcess/';


    /**
     * Send data to service to add a new factor
     * @param  {Objct} pFactor [The factor to be added]
     * @return {Object}       [The result from request]
     */
    this.addBioProcess = function(pBioProcess) {
        return request.post(bioProcessesUrl + 'addBioProcess', pBioProcess);
    };

    /**
     * Gets the list of bioProcess form Server
     * @return {Object} [The list of factors obtained]
     */
    this.getBioProcesses = function(pUser) {
        return request.post(bioProcessesUrl + 'getBioProcesses', pUser);
    };

    /**
     * Removes a bioProcess from DB
     * @param  {Object} pBioProcess [The
     * bioProcess to be removed]
     * @return {Object}            [The bioProcess object removed]
     */
    this.removeEquipmentType = function(pEquipmentType) {
        return request.post(bioProcessesUrl + 'removeEquipmentType', pEquipmentType);
    };

        /**
     * Gets the list of factors form Server
     * @return {Object} [The list of factors obtained]
     */
    this.getFactors = function() {
        return request.get(bioProcessesUrl + 'getFactors');
    };

    /**
     * Gets the factors related to an specific bioProcess
     * @param  {Object} pBioProcess [THe bioProcess to get data from]
     * @return {List[Object]}       [The list of factors returned]
     */
    this.getFactorsXBioProcess = function(pBioProcess) {
        return request.post(bioProcessesUrl + 'getFactorsXBioProcess', pBioProcess);
    };

    /**
     * Gets the bioProcess report
     * @param  {Object} pCompany [The company id filter, -1 to show all]
     * @return {List[Object]}       [The list of bioProcesses returned]
     */
    this.getBioProcessesReport = function(pCompany) {
        return request.post(bioProcessesUrl + 'getBioProcessesReport', pCompany);
    };

});

// *
// * Author:      David Obando Paniagua
// * Date:        18 Noviembre 2016
// * Description: Calculation Service handle file
//

'use strict';

bioPredictorApp.service('calculationsService', function(configFactory, request) 
{
    var baseUrl = configFactory.getConfiguration().serverURL;
    var calculationsURL = baseUrl + '/api/calculation/';

    /**
     * Send data to service to add a new calculation
     * @param  {Objct} pcalculation [The calculation to be added]
     * @return {Object}       [The result from request]
     */
    this.generateCalculation = function(pCalculation) {
        return request.post(calculationsURL + 'generateCalculation', pCalculation);
    };

    /**
     * Gets the list of Calculations form Server
     * @return {Object} [The list of Calculations obtained]
     */
    this.getCalculations = function(pUser) {
        return request.post(calculationsURL + 'getCalculations', pUser);
    };

    /**
     * Removes a Calculation from DB
     * @param  {Object} pCalculation [The Calculation to be removed]
     * @return {Object}            [The Calculation object removed]
     */
    this.removeCalculation = function(pCalculation) {
        return request.post(calculationsURL + 'removeCalculation', pCalculation);
    };

    /**
     * Gets the actions related to an specific Calculation
     * @param  {Object} pCalculation [THe Calculation to get data from]
     * @return {List[Object]}       [The list of actions returned]
     */
    this.getActionsXCalculation = function(pCalculation) {
        return request.post(calculationsURL + 'getActionsXCalculation', pCalculation);
    };

    /**
     * Gets the actions
     * @return {List[Object]}       [The list of actions returned]
     */
    this.getActions = function() {
        return request.get(calculationsURL + 'getActions');
    };

    /**
     * Sends a new calculation object to be added to DB
     * @param  {Object} pcalculation [The calculation to be inserted in DB]
     * @return {Int}       [The id of the calculation added]
     */
    this.addCalculation = function(pCalculation) {
        return request.post(calculationsURL + 'addCalculation', pCalculation);
    };

    /**
     * Gets the list of user Calculations form Server
     * @return {Object} [The list of Calculations obtained]
     */
    this.getRecomendedActivities = function() {
        return request.get(calculationsURL + 'getRecomendedActivities');
    };


    /**
     * Gets the list of Process Registers form Server
     * @return {Object} [The list of Process Registers obtained]
     */
    this.getProcessRegisters = function(pProcessId) {
        return request.post(calculationsURL + 'getProcessRegisters', pProcessId);
    };

});
// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        2 Set 2016
// * Description: User Service handle file
//

'use strict';

bioPredictorApp.service('companiesService', function(configFactory, request) 
{
    var baseUrl = configFactory.getConfiguration().serverURL;
    var companiesUrl = baseUrl + '/api/company/';

    /**
     * Send data to service to add a new company
     * @param  {Objct} pCompany [The company to be added]
     * @return {Object}       [The result from request]
     */
    this.addCompany = function(pCompany) {
        return request.post(companiesUrl + 'addCompany', pCompany);
    };

    /**
     * Gets the list of companies form Server
     * @return {Object} [The list of companies obtained]
     */
    this.getCompanies = function() {
        return request.get(companiesUrl + 'getCompanies');
    };

    /**
     * Removes a company from DB
     * @param  {Object} pCompany [The company to be removed]
     * @return {Object}            [The company object removed]
     */
    this.removeCompany = function(pCompany) {
        return request.post(companiesUrl + 'removeCompany', pCompany);
    };

    /**
     * Gets the report of companies form Server by companyId
     * @param  {Object} pCompany [The company id]
     * @return {Object} [The list of companies obtained]
     */
    this.getCompaniesReport = function (pCompany) {
        return request.post(companiesUrl + 'getCompaniesReport', pCompany);
    };

});

// *
// * Author:      Luis Carlos Cruz G - kalo070995@gmail.com
// * Date:        31 Oct 2016
// * Description: Data Service controller file
//

'use strict';

bioPredictorApp.service('dataService', function(configFactory, request) {


    var baseUrl = configFactory.getConfiguration().serverURL;
    var dataUrl = baseUrl + '/api/data/';


    /**
     * Send data to service to add a new factor
     * @param  {Objct} pFactor [The factor to be added]
     * @return {Object}       [The result from request]
     */
    this.addDataManual = function(pData) {
        return request.post(dataUrl + 'addDataManual', pData);
    };

    /**
     * Gets the data registers for the logged user
     * @param  {Object} pUser [The user logged in the system]
     * @return {Object}       [The result from request]
     */
    this.getData = function(pUser) {
        return request.post(dataUrl + 'getData', pUser);
    };

    /**
     * Disables a data register on DB
     * @param  {Object} pData [The data register to be disabled]
     * @return {Object}       [The result from request]
     */
    this.removeData = function(pData) {
        return request.post(dataUrl + 'removeData', pData);
    };

    /**
     * Gets the data registers for the specified data object
     * @param  {Object} pData [The data object to get registers from]
     * @return {Object}       [Result obtained from request]
     */
    this.getDataRegisters = function(pData) {
        return request.post(dataUrl + 'getDataRegisters', pData);
    };

});

// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Factors Service handle file
//

'use strict';

bioPredictorApp.service('factorsService', function(configFactory, request) {



    var baseUrl = configFactory.getConfiguration().serverURL;
    var factorsUrl = baseUrl + '/api/factor/';

    /**
     * Send data to service to add a new factor
     * @param  {Objct} pFactor [The factor to be added]
     * @return {Object}       [The result from request]
     */
    this.addEquipment = function(pFactor) {
        return request.post(factorsUrl + 'addEquipment', pFactor);
    };

    this.doUpkeep = function(pFactor) {
        return request.post(factorsUrl + 'doUpkeep', pFactor);
    };

    /**
     * Gets the list of factors form Server
     * @return {Object} [The list of factors obtained]
     */
    this.getFactors = function() {
        return request.get(factorsUrl + 'getFactors');
    };

    this.getEquipments = function() {
        return request.get(factorsUrl + 'getEquipments');
    };

    this.getAttributesXEquipmentType = function(pEquipmentType) {
        return request.post(factorsUrl + 'getAttributesXEquipmentType', pEquipmentType);
    };

    this.getUpkeepsXEquipmentType = function(pEquipmentType) {
        return request.post(factorsUrl + 'getUpkeepsXEquipmentType', pEquipmentType);
    };
    
    /**
     * Gets the list of factors form Server
     * @return {Object} [The list of factors obtained]
     */
    this.viewFactors = function() {
        return request.get(factorsUrl + 'viewFactors');
    };

    /**
     * Removes a factor from DB
     * @param  {Object} pFactor [The
     * factor to be removed]
     * @return {Object}            [The factor object removed]
     */
    this.removeEquipment = function(pEquipment) {
        return request.post(factorsUrl + 'removeEquipment', pEquipment);
    };


    this.getFactorsReport = function(pCompany) {
        return request.post(factorsUrl + 'getFactorsReport', pCompany);
    };
    
        this.getEquipmentTypes = function() {
        return request.get(factorsUrl + 'getEquipmentTypes');
    };
    
});

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        2 Set 2016
// * Description: User Service handle file
//

'use strict';

bioPredictorApp.service('rolesService', function(configFactory, request) 
{
    var baseUrl = configFactory.getConfiguration().serverURL;
    var rolesURL = baseUrl + '/api/role/';

    /**
     * Send data to service to add a new role
     * @param  {Objct} pRole [The role to be added]
     * @return {Object}       [The result from request]
     */
    this.addRole = function(pRole) {
        return request.post(rolesURL + 'addRole', pRole);
    };

    /**
     * Gets the list of roles form Server
     * @return {Object} [The list of roles obtained]
     */
    this.getRoles = function() {
        return request.get(rolesURL + 'getRoles');
    };

    /**
     * Removes a role from DB
     * @param  {Object} pRole [The role to be removed]
     * @return {Object}            [The role object removed]
     */
    this.removeUpkeep = function(pUpkeep) {
        return request.post(rolesURL + 'removeUpkeep', pUpkeep);
    };

    /**
     * Gets the actions related to an specific role
     * @param  {Object} pRole [THe role to get data from]
     * @return {List[Object]}       [The list of actions returned]
     */
    this.getActionsXRole = function(pRole) {
        return request.post(rolesURL + 'getActionsXRole', pRole);
    };

    /**
     * Gets the actions
     * @return {List[Object]}       [The list of actions returned]
     */
    this.getActions = function() {
        return request.get(rolesURL + 'getActions');
    };

    /**
     * Sends a new Role object to be added to DB
     * @param  {Object} pRole [The role to be inserted in DB]
     * @return {Int}       [The id of the role added]
     */
    this.addRole = function(pRole) {
        return request.post(rolesURL + 'addRole', pRole);
    };

    /**
     * Gets the list of user roles form Server
     * @return {Object} [The list of roles obtained]
     */
    this.getRolesByUserId = function(pUser) {
        return request.post(rolesURL + 'getRolesByUserId', pUser);
    };

    this.getUpkeepsXDate = function(pUser) {
        return request.post(rolesURL + 'getUpkeepsXDate', pUser);
    };


});

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        3 Sep 2016
// * Description: Session handler
//

'use strict';

//Factory to manage the users operations to the web server
bioPredictorApp.factory('sessionService', ['$rootScope', 'localStorageService',

    function ($rootScope,localStorageService) {

        var userStorage = 'userStorage';

        var session = {
            /**
             * Initialize the session by reset the session
             */
            init: function () {
                //this.resetSession();
            },
            /**
             * Reset the session
             */
            resetSession: function() {
                localStorageService.remove(userStorage);
            },
            /**
             * logout the session active
             */
            logOut: function() {
                this.resetSession();
            },
            /**
             * Save the data of the session in the frontend
             * @param  {Object} pUserData - Object with the information of the current user
             */
            authSuccess: function(pUserData) {
                localStorageService.set(userStorage,pUserData);
            },
            /**
             * If login failed, reset the session
             */
            authFailed: function() {
                this.resetSession();
            },

            /**
             * Get the current user in the system
             * @return {Object} Return the object of the current user in the system
             */
            getCurrentUser: function(){
                return localStorageService.get(userStorage);
            },

            /**
             * Stores and object on session
             * @param  {String} pKey    [The object key]
             * @param  {Object} pObject [The object to be stored]
             * @return {[type]}         [description]
             */
            storeObject: function(pKey, pObject) {
                localStorageService.set(pKey,pObject);
            },

            /**
             * Gets an object on session identified by its key
             * @param  {String} pKey [The object key]
             * @return {Object}      [The object returned from session]
             */
            getObject: function(pKey) {
                return localStorageService.get(pKey);
            },

            /**
             * Clears the object from session
             * @param  {String} pKey [The object key to be cleared]
             * @return {[type]}      [description]
             */
            clearObject: function(pKey) {
                localStorageService.remove(pKey);
            },

            /**
             * Vierifes if users has the specified action
             * @param  {String}  pActionName [The name of the action verify]
             * @return {Boolean}             [True if found false if not]
             */
            hasAction: function (pActionName) {

                var userActions = (localStorageService.get(userStorage)).actions;

                // Verify if user has actions
                for (var actionIndex = 0; actionIndex < userActions.length; actionIndex++) {
                    var action = userActions[actionIndex];

                    if (action.name === pActionName){
                        return true;
                    }
                }
                return false;
            }
        };
        session.init();
        return session;
    }
]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        2 Set 2016
// * Description: User Service handle file
//

'use strict';

bioPredictorApp.service('usersService', function(configFactory, request) {

    var baseUrl = configFactory.getConfiguration().serverURL;
    var usersURL = baseUrl + '/api/user/';

    /**
     * Handles the user login action
     * @param  {Objct} pUser [The user to be auth]
     * @return {Object}       [The result from request]
     */
    this.login = function(pUser) {
        return request.post(usersURL + 'login', pUser);
    };

    /**
     * Gets the list of users for an specific company
     * @param  {Object} pUser [The current user logged]
     * @return {List<User>}       [The list of users for the company]
     */
    this.getUsersByCompanyId = function(pUser) {
        return request.post(usersURL + 'getUsersByCompanyId', pUser);
    };

    /**
     * Adds or edits a new user in DataBase
     * @param  {Object} pUser [The current user logged]
     * @return {Object}       [The result object from Service]
     */
    this.modifyUser = function(pUser) {
      return request.post(usersURL + 'modifyUser',pUser);
    };

    /**
     * Adds or edits a new user in DataBase
     * @param  {Object} pUser [The current user logged]
     * @return {Object}       [The list of users for the company]
     */
    this.removeUser = function(pUser) {
      return request.post(usersURL + 'removeUser',pUser);
    };

});

// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: The Factors list controller
//


'use strict';

// Handles the menu controller logic
bioPredictorApp.controller('listBioProcessesController', ['$scope', '$rootScope', '$state', '$uibModal', 'sessionService', 'bioProcessesService',
  function($scope, $rootScope,$state, $uibModal, sessionService, bioProcessesService) {

    $rootScope.isLogin = false;
    $rootScope.isMenu = false;

    $scope.modalActions = {
        add: "Agregar Tipo de Equipo",
        edit: "Editar Tipo de Equipo",
        view: "Ver Tipo de Equipo"
    };

    $scope.permissions = {
      addBioProcess : {
        enabled : true,
        class : ''
      },
      viewBioProcess : {
        enabled : true,
        class : ''
      },
      removeBioProcess : {
        enabled : true,
        class : ''
      }
    };

     /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function() {

      // Get all permissions
      $scope.permissions.addBioProcess.enabled = sessionService.hasAction($rootScope.actions.addBioProcess);
      $scope.permissions.viewBioProcess.enabled = sessionService.hasAction($rootScope.actions.viewBioProcess);
      $scope.permissions.removeBioProcess.enabled = sessionService.hasAction($rootScope.actions.removeBioProcess);

      $scope.permissions.addBioProcess.class = ($scope.permissions.addBioProcess.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.viewBioProcess.class = ($scope.permissions.viewBioProcess.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.removeBioProcess.class = ($scope.permissions.removeBioProcess.enabled) ? 'bp-enabled' : 'bp-disabled';

      if($scope.permissions.viewBioProcess.enabled) {
        $scope.loadBioProcesses();
      }
    };

    /**
     * Inits the Page variables
     * @return {[type]} [description]
     */
    $scope.loadBioProcesses = function () {

      $rootScope.displayLoading();
       var currentUser = sessionService.getCurrentUser();
      bioProcessesService.getBioProcesses(currentUser)
      .then(function(pBioProcesses) {
        $scope.bioProcesses = pBioProcesses;
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadBioProcessesError);
        $rootScope.hideLoading();
      });
    };


    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Handles the modal display event
     * @param  {string} pModalAction [The action to be performed]
     * @param  {Object} pFactor     [The factor object to be used if neccessary]
     * @return {[type]}              [description]
     */
    $scope.displayModal = function (pModalAction, pBioProcess) {


    if(($scope.permissions.addBioProcess.enabled && pModalAction === $scope.modalActions.add) ||
      (pModalAction === $scope.modalActions.view)) {

        $scope.currentAction = pModalAction;

        // Set company on edit
        if($scope.currentAction != $scope.modalActions.add) {
          $scope.bioProcess = pBioProcess;

        } else {
          $scope.bioProcess = null;
        }

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/modifyBioProcess.html',
          controller: 'modifyBioProcessController',
          scope: $scope
        });
      }
    };

    /**
     * Sets the user company to view
     * @return {[type]} [description]
     */
    $scope.viewMyCompany = function () {

      var currentUser = sessionService.getCurrentUser();

      if(currentUser) {

        var company = {
          companyId : currentUser.companyId,
          name : currentUser.companyName,
          description: currentUser.companyDescription
       };

        $scope.displayModal($scope.modalActions.edit, company);
      }
    };

    /**
     * Sends the request to te service to remove a factor
     * @param  {[type]} pFactor [description]
     * @return {[type]}          [description]
     */
    $scope.removeEquipmentType = function (pEquipmentType) {


      $scope.removeObject = pEquipmentType;
      $scope.removeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/removeConfirm.html',
        controller: 'removeConfirmController',
        scope: $scope
      });
    };

    /**
     * Does the remove action
     * @param  {Object} pData [The data object to be removed]
     * @return {[type]}       [description]
     */
    $scope.remove = function () {

      $rootScope.displayLoading();
      bioProcessesService.removeEquipmentType($scope.removeObject)
      .then(function(pResult) {
        if(pResult.removed == 1) {
          displaySuccess($rootScope.returnMessages.equipmentTypeRemoveSuccess);
          $scope.loadBioProcesses();
        } else {
          displayError($rootScope.returnMessages.removeEquipmentTypeInvalid);
        }
      })
      .catch(function(pError) {
        console.log(pError);
        displayError($rootScope.returnMessages.removeEquipmentTypeError);
      })
      .finally(function() {
        $rootScope.hideLoading();
        $scope.removeObject = {};
        $scope.removeModalInstance.dismiss();
      });
    };


    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    init();


}]);


// *
// * Author:      David Obando Paniagua
// * Date:        18 Noviembre 2016
// * Description: The Calculations List Controller
//

'use strict';

// Handles the menu controller logic
bioPredictorApp.controller('listCalculationsController', ['$scope', '$rootScope', '$state', '$uibModal', 'sessionService', 'calculationsService',
  function($scope, $rootScope,$state, $uibModal, sessionService, calculationsService) {

    $rootScope.isLogin = false;
    $rootScope.isMenu = false;

    $scope.modalActions = {
        add: "Generar Calculo",
        edit: "Editar Calculo",
        view: "Ver Calculo"
    };

    $scope.permissions = {
      addCalculation : {
        enabled : true,
        class : ''
      },
      viewListCalculation : {
        enabled : true,
        class : ''
      },
      removeCalculation : {
        enabled : true,
        class : ''
      }
    };

     /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function() {

      var currentUser = sessionService.getCurrentUser();

      if (currentUser.email == 'bpadmin@gmail.com' || currentUser.email == 'bpAdmin@gmail.com') {
        $scope.loadCalculations();
        return
      }

      // Get all permissions
      $scope.permissions.addCalculation.enabled = sessionService.hasAction($rootScope.actions.addCalculation);
      $scope.permissions.viewListCalculation.enabled = sessionService.hasAction($rootScope.actions.viewListCalculation);
      $scope.permissions.removeCalculation.enabled = sessionService.hasAction($rootScope.actions.removeCalculation);

      $scope.permissions.addCalculation.class = ($scope.permissions.addCalculation.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.viewListCalculation.class = ($scope.permissions.viewListCalculation.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.removeCalculation.class = ($scope.permissions.removeCalculation.enabled) ? 'bp-enabled' : 'bp-disabled';

      if($scope.permissions.viewListCalculation.enabled) {
        $scope.loadCalculations();
      }
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

     /**
     * Inits the Page variables
     * @return {[type]} [description]
     */
    $scope.loadCalculations = function () {

      $rootScope.displayLoading();
      var currentUser = sessionService.getCurrentUser();
      calculationsService.getCalculations(currentUser)
      .then(function(pCalculations) {
        $scope.calculations = pCalculations;
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadCalculationsError);
        $rootScope.hideLoading();
      });
    };

    /**
     * Handles the modal display event
     * @param  {string} pModalAction [The action to be performed]
     * @param  {Object} pCalculation     [The Calculation object to be used if neccessary]
     * @return {[type]}              [description]
     */
    $scope.displayModal = function (pModalAction, pCalculation) {

        if(($scope.permissions.addCalculation.enabled && pModalAction === $scope.modalActions.add) ||
        (pModalAction === $scope.modalActions.view)) {

          $scope.currentAction = pModalAction;
          // Set company on edit
          if($scope.currentAction != $scope.modalActions.add) {
            $scope.calculation = pCalculation;
          } else {
            $scope.calculation = null;
          }

          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/modifyCalculation.html',
            controller: 'modifyCalculationController',
            scope: $scope
          });

        }
    };

        /**
     * Handles the modal display event
     * @param  {string} pModalAction [The action to be performed]
     * @param  {Object} pCalculation     [The Calculation object to be used if neccessary]
     * @return {[type]}              [description]
     */
    $scope.displayCalculation = function (pCalculation) {

          $scope.calculation = pCalculation;
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/showCalculation.html',
            controller: 'showCalculationController',
            scope: $scope
          });

    };

    /**
     * Sends the request to te service to remove a Calculation
     * @param  {[type]} pCalculation [The Calculation to be removed]
     * @return {[type]}          [description]
     */
    $scope.removeCalculation = function (pCalculation) {

      // if(!$scope.permissions.removeCalculation.enabled){
      //   return;
      // }

      // $scope.removeObject = pCalculation;
      // $scope.removeModalInstance = $uibModal.open({
      //   animation: true,
      //   templateUrl: 'views/modals/removeConfirm.html',
      //   controller: 'removeConfirmController',
      //   scope: $scope
      // });
    };



    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    init();

}]);


// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        19 Ago 2016
// * Description: Menu html js controller
//

'use strict';

// Handles the menu controller logic
bioPredictorApp.controller('menuController', ['$scope', '$rootScope', '$state',function($scope, $rootScope,$state) 
{
    $rootScope.isLogin = false;
    $rootScope.isMenu = true;
}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        19 Ago 2016
// * Description: The Companies list controller
//

'use strict';

// Handles the menu controller logic
bioPredictorApp.controller('listCompaniesController', ['$scope', '$rootScope', '$state', '$uibModal', 'sessionService', 'companiesService',
  function($scope, $rootScope,$state, $uibModal, sessionService, companiesService) {

    $rootScope.isLogin = false;
    $rootScope.isMenu = false;

    $scope.modalActions = {
        add: "Agregar Compañía",
        edit: "Editar Compañía",
        view: "Ver Compañia"
    };

    $scope.permissions = {
      addCompany : {
        enabled : true,
        class : ''
      },
      viewListCompany : {
        enabled : true,
        class : ''
      },
      removeCompany : {
        enabled : true,
        class : ''
      }
    };

     /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function() {

      // Get all permissions
      $scope.permissions.addCompany.enabled = sessionService.hasAction($rootScope.actions.addCompany);
      $scope.permissions.viewListCompany.enabled = sessionService.hasAction($rootScope.actions.viewListCompany);
      $scope.permissions.removeCompany.enabled = sessionService.hasAction($rootScope.actions.removeCompany);

      $scope.permissions.addCompany.class = ($scope.permissions.addCompany.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.viewListCompany.class = ($scope.permissions.viewListCompany.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.removeCompany.class = ($scope.permissions.removeCompany.enabled) ? 'bp-enabled' : 'bp-disabled';

      if($scope.permissions.viewListCompany.enabled) {
        $scope.loadCompanies();
      }
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Inits the Page variables
     * @return {[type]} [description]
     */
    $scope.loadCompanies = function () {

      $rootScope.displayLoading();
      companiesService.getCompanies()
      .then(function(pCompanies) {
        $scope.companies = pCompanies;
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadCompaniesError);
        $rootScope.hideLoading();
      });
    };

    /**
     * Handles the modal display event
     * @param  {string} pModalAction [The action to be performed]
     * @param  {Object} pCompany     [The company object to be used if neccessary]
     * @return {[type]}              [description]
     */
    $scope.displayModal = function (pModalAction, pCompany) {

      if(($scope.permissions.addCompany.enabled && pModalAction === $scope.modalActions.add) ||
        (pModalAction === $scope.modalActions.view)) {

        $scope.currentAction = pModalAction;

        // Set company on edit
        if($scope.currentAction != $scope.modalActions.add) {
          $scope.company = pCompany;
        } else {
          $scope.company = null;
        }

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/modifyCompany.html',
          controller: 'modifyCompanyController',
          scope: $scope
        });
      }
    };

    /**
     * Sets the user company to view
     * @return {[type]} [description]
     */
    $scope.viewMyCompany = function () {

      var currentUser = sessionService.getCurrentUser();

      if(currentUser) {

        var company = {
          companyId : currentUser.companyId,
          name : currentUser.companyName,
          description: currentUser.companyDescription
       };

        $scope.displayModal($scope.modalActions.view, company);
      }
    };

    /**
     * Sends the request to te service to remove a company
     * @param  {[type]} pCompany [description]
     * @return {[type]}          [description]
     */
    $scope.removeCompany = function (pCompany) {

      if(!$scope.permissions.removeCompany.enabled ) {
        return;
      }

      $scope.removeObject = pCompany;
      $scope.removeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/removeConfirm.html',
        controller: 'removeConfirmController',
        scope: $scope
      });

    };

    /**
     * Does the remove action
     * @param  {Object} pData [The data object to be removed]
     * @return {[type]}       [description]
     */
    $scope.remove = function () {

      $rootScope.displayLoading();
      companiesService.removeCompany($scope.removeObject)
      .then(function(pResult) {

        if(pResult.removed) {
          displaySuccess($rootScope.returnMessages.companyRemoveSucess);
          $scope.loadCompanies();
        } else {
          displayError($rootScope.returnMessages.removeCompanyInvalid);
        }
      })
      .catch(function(pError) {
        console.log(pError);
        displayError($rootScope.returnMessages.removeCompanyError);
      })
      .finally(function() {
        $rootScope.hideLoading();
        $scope.removeObject = {};
        $scope.removeModalInstance.dismiss();
      });
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    init();

}]);


// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify factor controller file
//

bioPredictorApp.controller('doUpkeepController',['$rootScope','$scope','$uibModalInstance', 'factorsService', 'sessionService','rolesService',
function ($rootScope, $scope, $uibModalInstance, factorsService, sessionService,rolesService) {

    var init = function () {
        loadEquipmentTypes();
        loadUpKeeps();
        $scope.values = [];

    };

    var loadUpKeeps = function () {

      $rootScope.displayLoading();
      factorsService.getUpkeepsXEquipmentType($scope.factor)
      .then(function(pUpkeeps) {
        $scope.displayUpkeeps = pUpkeeps;
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadRolesError);
        $rootScope.hideLoading();
      });
    };

    $scope.updateAttributes= function(pEquipmentType){

      $scope.equipmentType = $scope.selectedEquipmentType;
      loadAttributes();
    };

    var loadEquipmentTypes = function(){

      factorsService.getEquipmentTypes()
      .then(function(pEquipmentTypes)
      {
        $scope.equipmentTypes = pEquipmentTypes;
      })
      .catch(function(pError)
      {
        displayError($rootScope.returnMessages.loadBioProcessesError);
      });

    };

        var loadAttributes = function(){

      factorsService.getAttributesXEquipmentType($scope.equipmentType)
      .then(function(pAttributes)
      {
        $scope.attributes = pAttributes;
      })
      .catch(function(pError)
      {
        displayError($rootScope.returnMessages.loadBioProcessesError);
      });

    };
    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Sends new factor to service
     * @param {[type]} pCompany [description]
     */
    var addFactor = function(pFactor) {

        $rootScope.displayLoading();

        pFactor.upKeepIds = getSelectedUpkeeps();

        factorsService.doUpkeep(pFactor)
        .then(function(pFactor) {

            if(pFactor && pFactor.factorId != - 1) {

                $scope.factor = null;
                displaySuccess($rootScope.returnMessages.factorAddSuccess);
            } else {

                displayError($rootScope.returnMessages.requestError);
            }
            $rootScope.hideLoading();

        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
            $rootScope.hideLoading();
        });
    };

    $scope.modifyFactor = function (pFactor) {
        pFactor.class = (pFactor.class) ? null : 'bp-calculation';
    };
    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

            var sUpkeeps = getSelectedUpkeeps();
            if(sUpkeeps.length > 0) {
                addFactor($scope.factor);
            } else {
                displayError($rootScope.returnMessages.noUpkeep);
            }

    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    $scope.modifyUpkeep = function (pUpkeep) {
        pUpkeep.class = (pUpkeep.class) ? null : 'bp-calculation';
    };

    var getSelectedUpkeeps = function () {

        var selectedUpkeeps = [];
        var displayUpkeeps = $scope.displayUpkeeps;


        for(var factorIndex = 0; factorIndex < displayUpkeeps.length; factorIndex++) {

            var upkeep = displayUpkeeps[factorIndex];

            
            if(upkeep.class) {
                selectedUpkeeps.push(upkeep.upkeepId);
            }
        }

        return selectedUpkeeps;
    };

        init();
}]);

// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: The Factors list controller
//

'use strict';

// Handles the menu controller logic
bioPredictorApp.controller('listFactorsController', ['$scope', '$rootScope', '$state', '$uibModal', 'sessionService', 'factorsService',
  function($scope, $rootScope,$state, $uibModal, sessionService, factorsService) {

    $rootScope.isLogin = false;
    $rootScope.isMenu = false;

    $scope.modalActions = {
        add: "Agregar Equipo",
        edit: "Realizar Mantenimiento",
        view: "Ver Equipo"
    };

    $scope.permissions = {
      addFactor : {
        enabled : true,
        class : ''
      },
      viewListFactor : {
        enabled : true,
        class : ''
      },
      removeFactor : {
        enabled : true,
        class : ''
      }
    };

    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function() {

      // Get all permissions
      $scope.permissions.viewListFactor.enabled = sessionService.hasAction($rootScope.actions.viewListFactor);
      $scope.permissions.addFactor.enabled = sessionService.hasAction($rootScope.actions.addFactor);
      $scope.permissions.removeFactor.enabled = sessionService.hasAction($rootScope.actions.removeFactor);

      $scope.permissions.viewListFactor.class = ($scope.permissions.viewListFactor.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.addFactor.class = ($scope.permissions.addFactor.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.removeFactor.class = ($scope.permissions.removeFactor.enabled) ? 'bp-enabled' : 'bp-disabled';

      if($scope.permissions.viewListFactor.enabled) {
        $scope.loadFactors();
      }

    };


    /**
     * Inits the Page variables
     * @return {[type]} [description]
     */
    $scope.loadFactors = function () {

      $rootScope.displayLoading();

      factorsService.getEquipments()
      .then(function(pFactors) {
        $scope.factors = pFactors;
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadEquipmentsError);
        $rootScope.hideLoading();
      });
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Handles the modal display event
     * @param  {string} pModalAction [The action to be performed]
     * @param  {Object} pFactor     [The factor object to be used if neccessary]
     * @return {[type]}              [description]
     */
    $scope.displayModal = function (pModalAction, pFactor) {

        if(($scope.permissions.addFactor.enabled && pModalAction === $scope.modalActions.add) ||
        (pModalAction === $scope.modalActions.view)) {

          $scope.currentAction = pModalAction;

          // Set factor on edit
          if($scope.currentAction != $scope.modalActions.add) {
            $scope.factor = pFactor;
          } else {
            $scope.factor = null;
          }

          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/modifyFactor.html',
            controller: 'modifyFactorController',
            scope: $scope
          });

        }
    };

    $scope.displayModal2 = function (pModalAction, pFactor) {

        // if(($scope.permissions.addFactor.enabled && pModalAction === $scope.modalActions.add) ||
        // (pModalAction === $scope.modalActions.view)) {

          $scope.currentAction = pModalAction;

          // Set factor on edit
          if($scope.currentAction != $scope.modalActions.add) {
            $scope.factor = pFactor;
          } else {
            $scope.factor = null;
          }

          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/factors/doUpkeep.html',
            controller: 'doUpkeepController',
            scope: $scope
          });

        // }
    };

    /**
     * Sends the request to te service to remove a factor
     * @param  {[type]} pFactor [description]
     * @return {[type]}          [description]
     */
    $scope.removeEquipment = function (pEquipment) {
      $scope.removeObject = pEquipment;
      $scope.removeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/removeConfirm.html',
        controller: 'removeConfirmController',
        scope: $scope
      });
    };

    /**
     * Does the remove action
     * @param  {Object} pData [The data object to be removed]
     * @return {[type]}       [description]
     */
    $scope.remove = function () {

      $rootScope.displayLoading();

      factorsService.removeEquipment($scope.removeObject)
      .then(function(pResult) {

        if(pResult.removed) {
          displaySuccess($rootScope.returnMessages.equipmentRemoveSuccess);
          $scope.loadFactors();
        } else {
          displayError($rootScope.returnMessages.removeEquipmentInvalid);
        }
      })
      .catch(function(pError) {
        console.log(pError);
        displayError($rootScope.returnMessages.removeEquipmentError);
      })
      .finally(function() {
        $rootScope.hideLoading();
        $scope.removeObject = {};
        $scope.removeModalInstance.dismiss();
      });
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    init();

}]);


// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

'use strict';

bioPredictorApp.controller('loadDataCsv',['$rootScope','$scope', '$state', 'sessionService', 'bioProcessesService', 'dataService', 'commonFunctions',
  function ($rootScope, $scope, $state, sessionService,bioProcessesService,dataService, commonFunctions) {

    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

      /*
      // Redirect outside if no data is stored
      if(!modifyData) {
        $state.go('menu');
        $rootScope.hideLoading();
        return;
      }*/

    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage) {
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };


    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    $scope.saveCSV = function () 
    {
        
    };

    init();
}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        31 Oct 2016
// * Description: The data list controller
//

'use strict';

// Handles the menu controller logic
bioPredictorApp.controller('listDataController', ['$scope', '$rootScope', '$state', '$uibModal', 'sessionService', 'rolesService', 'dataService','commonFunctions',
  function($scope, $rootScope,$state, $uibModal, sessionService, rolesService, dataService,commonFunctions) {

    $rootScope.isLogin = false;
    $rootScope.isMenu = false;

    $scope.modalActions = {
        add: "Agregar Dato",
        load: "Cargar CSV",
        view: "Ver Dato",
        remove: "Remove Dato"
    };

    $scope.permissions = {
      addDataCSV : {
        enabled : true,
        class : ''
      },
      addDataManual : {
        enabled : true,
        class : ''
      },
      viewListData : {
        enabled : true,
        class : ''
      },
      removeData : {
        enabled : true,
        class : ''
      }
    };

     /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function() {

      // Get all permissions
      $scope.permissions.addDataCSV.enabled = sessionService.hasAction($rootScope.actions.addDataCSV);
      $scope.permissions.addDataManual.enabled = sessionService.hasAction($rootScope.actions.addDataManual);
      $scope.permissions.viewListData.enabled = sessionService.hasAction($rootScope.actions.viewListData);
      $scope.permissions.removeData.enabled = sessionService.hasAction($rootScope.actions.removeData);


      $scope.permissions.addDataCSV.class = ($scope.permissions.addDataCSV.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.addDataManual.class = ($scope.permissions.addDataManual.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.viewListData.class = ($scope.permissions.viewListData.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.removeData.class = ($scope.permissions.removeData.enabled) ? 'bp-enabled' : 'bp-disabled';


      if($scope.permissions.viewListData.enabled) {
        $scope.loadData();
      }

    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Formats the data date to display on list
     * @param  {[type]} pData [description]
     * @return {[type]}       [description]
     */
    var formatDataDate = function (pData) {

      for(var dataIndex = 0; dataIndex < pData.length; dataIndex++) {
          var dataObject = pData[dataIndex];
          dataObject.displayDate = commonFunctions.getStingFormatDate(new Date(dataObject.registerDate));
      }
      return pData;
    };

     /**
     * Loads the registered data on DB
     * @return {[type]} [description]
     */
    $scope.loadData = function () {

      var currentUser = sessionService.getCurrentUser();

      $rootScope.displayLoading();
      dataService.getData(currentUser)
      .then(function(pData) {
        $scope.data = formatDataDate(pData);
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadDataError);
      })
      .finally(function(){
        $rootScope.hideLoading();
      });
    };

    /**
     * Displays the modal to add/edit/view a data record
     * @param  {String} pModalAction [The current modal action to be used]
     * @param  {Object} pData        [Optional: The data object to be viewed/edited]
     * @return {void}              [none]
     */
    $scope.modifyData = function (pModalAction, pData) {

      if(($scope.permissions.addDataManual.enabled && pModalAction === $scope.modalActions.add) ||
        (pModalAction === $scope.modalActions.view)) {

        // Set user on edit/view
        var modifyData = {};
        modifyData.data = ($scope.currentAction != $scope.modalActions.add) ? pData : null;
        modifyData.action = pModalAction;

        // Set session data to modify
        sessionService.storeObject($rootScope.sessionKeys.modifyData, modifyData);
        $state.go('modify-data');
      }
    };

    /**
     * Sends the request to te service to remove a data record
     * @param  {[type]} pData [The data to be removed]
     * @return {[type]}          [description]
     */
    $scope.removeData = function (pData) {

      if(!$scope.permissions.removeData.enabled){
        return;
      }

      $scope.removeObject = pData;
      $scope.removeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/removeConfirm.html',
        controller: 'removeConfirmController',
        scope: $scope
      });
    };

    /**
     * Does the remove action
     * @param  {Object} pData [The data object to be removed]
     * @return {[type]}       [description]
     */
    $scope.remove = function () {

      $rootScope.displayLoading();

      dataService.removeData($scope.removeObject)
      .then(function(pResult) {

        if(pResult.removed) {
          displaySuccess($rootScope.returnMessages.dataRemoveSucess);

          $scope.loadData();
        } else {
          displayError($rootScope.returnMessages.removeDataInvalid);
        }
      })
      .catch(function(pError) {
        console.log(pError);
        displayError($rootScope.returnMessages.removeDataError);
      })
      .finally(function() {
        $rootScope.hideLoading();
        $scope.removeObject = {};
        $scope.removeModalInstance.dismiss();
      });
    };

    /**
     * Redirects to the load CSV data module
     */
    $scope.addDataCSV = function() {
      $state.go('data-csv');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    init();

}]);


// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

'use strict';

bioPredictorApp.controller('modifyDataController',['$rootScope','$scope', '$state', 'sessionService', 'bioProcessesService', 'dataService', 'commonFunctions',
  function ($rootScope, $scope, $state, sessionService,bioProcessesService,dataService, commonFunctions) {

    $scope.actions = {
        add: "Agregar Dato",
        view: "Ver Dato"
    };

    $scope.errors = {
      dateError: "Por favor elija una fecha para los datos",
      bioProcessError: "Por favor elija un BioProceso"
    };

    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

      var modifyData = sessionService.getObject($rootScope.sessionKeys.modifyData);

      // Redirect outside if no data is stored
      if(!modifyData) {
        $state.go('menu');
        $rootScope.hideLoading();
        return;
      }

      $scope.data = modifyData.data;
      $scope.action = modifyData.action;

      loadPageData();
    };

    /**
     * Gets the data to be used on the page
     * @return {[type]} [description]
     */
    var loadPageData = function() {

        $rootScope.displayLoading();

        var user = sessionService.getCurrentUser();

        bioProcessesService.getBioProcesses(user)
        .then(function(pBioProcesses) {

            // Add defalut element
            pBioProcesses.unshift({
                processId: -1,
                name : 'Seleccione un Bio Proceso...'
            });

            // Set The BioProcess
            setDataBioProcess(pBioProcesses);
            $scope.bioProcesses = pBioProcesses;

            if(!$scope.data) {
              $scope.data = {};
              return [];
            } else {
              $scope.data.date = new Date($scope.data.registerDate);
              return dataService.getDataRegisters($scope.data);
            }
        })
        .then(function(pDataRegisters) {
            $scope.factors = pDataRegisters;
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.loadDataError);
        })
        .finally(function() {
            $rootScope.hideLoading();
        });
    };

    /**
     * Sets the selected BioProcess for the entered when view action is required
     * @param {[type]} pBioProcesses [The list of BioProcesses from DB]
     */
    var setDataBioProcess = function (pBioProcesses) {

        if($scope.data) {

          for(var bpIndex = 0; bpIndex < pBioProcesses.length; bpIndex++) {

            var bioProcess = pBioProcesses[bpIndex];

            if(bioProcess.processId === $scope.data.processId) {
              $scope.selectedBioProcess = bioProcess;
              break;
            }
          }
        } else {
            $scope.selectedBioProcess = pBioProcesses[0];
        }
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage) {
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Handles the data validation process
     * @return {String} [A message with all validation comments]
     */
    var isValidData = function () {

      var validationMessage = "";

      // Bio Process Validation
      if(!$scope.selectedBioProcess || $scope.selectedBioProcess.processId == -1) {
        validationMessage += $scope.errors.bioProcessError;
      }
      if(!$scope.data || !$scope.data.date) {
        validationMessage += " - " + $scope.errors.dateError;
      }

      return validationMessage;
    };

    /**
     * Gets the current data object
     * @return {Object} [The object obtained from user values]
     */
    var getDataObject = function () {

      var user = sessionService.getCurrentUser();

      var data = {
        registerUser : user.userId,
        registerDate : commonFunctions.getStingFormatDate($scope.data.date),
        processId : $scope.selectedBioProcess.processId,
        isRemoved : false,
        registerValues : commonFunctions.getRegisterValuesString($scope.factors)
      };

      return data;
    };

    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

        var validationMessage = isValidData();
        if(validationMessage == "") {

          $rootScope.displayLoading();
          var data = getDataObject();

          dataService.addDataManual(data)
          .then(function(pResult) {

            // Success Validation
            if(pResult.processRegisterId != -1) {

              $scope.data = {};
              $scope.selectedBioProcess = $scope.bioProcesses[0];
              $scope.factors = null;
              displaySuccess($rootScope.returnMessages.addDataSuccess);

            } else {
              displayError($rootScope.returnMessages.addDataError);
            }
          })
          .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.addDataError);
          })
          .finally(function() {
              $rootScope.hideLoading();
          });
        } else {
          displayError(validationMessage);
        }
    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        // Clear the session user to modify
        sessionService.clearObject($rootScope.sessionKeys.modifyData);
        $state.go('data-list');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    /**
     * Updates the factors on screen when BioProcessChanges
     * @return {[type]} [description]
     */
    $scope.updateFactors = function() {

      $rootScope.displayLoading();

      bioProcessesService.getFactorsXBioProcess($scope.selectedBioProcess)
      .then(function(pFactors) {
        $scope.factors = pFactors;
      })
      .catch(function(pError) {
          console.log(pError);
          displayError($rootScope.returnMessages.loadDataError);
      })
      .finally(function() {
          $rootScope.hideLoading();
      });
    };

    init();
}]);

// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify factor controller file
//

bioPredictorApp.controller('modifyBioProcessController',['$rootScope','$scope','$uibModalInstance', 'bioProcessesService', 'sessionService',
function ($rootScope, $scope, $uibModalInstance, bioProcessesService, sessionService) {


    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

        $scope.bpFactors = [];
        $rootScope.displayLoading();

        bioProcessesService.getFactors()
        .then(function(pFactors) {
            $scope.systemFactors = pFactors;
            if($scope.bioProcess) {

                return bioProcessesService.getFactorsXBioProcess($scope.bioProcess);
            } else {
                return [];
            }
        })
        .then(function(pFactors) {
            $scope.bpFactors = pFactors;
            return mergeFactors();
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.loadActionsError);
        })
        .finally(function() {
            $rootScope.hideLoading();
        });
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    var isInArray = function(pElement) {

        var result = false;
        var bpFactors = $scope.bpFactors;
        for(var factorIndex = 0; factorIndex < bpFactors.length; factorIndex++) {
            var factor = bpFactors[factorIndex];

            if(factor.attributeId === pElement.attributeId) {

                result = true;
                break;
            }
        }

        return result;
    };

    /**
     * Sends new factor to service
     * @param {[type]} pCompany [description]
     */
    var addBioProcess = function(pBioProcess) {

        $rootScope.displayLoading();
        pBioProcess.factorIds = getSelectedFactors();

        var currentUser = sessionService.getCurrentUser();

        pBioProcess.registerUserId = currentUser.userId;
        pBioProcess.companyId = currentUser.companyId;

        bioProcessesService.addBioProcess(pBioProcess)
        .then(function(pBioProcess) {

            if(pBioProcess && pBioProcess.bioProcessId != - 1) {

                $scope.bioProcess = null;
                displaySuccess($rootScope.returnMessages.bioProcessAddSuccess);
                $scope.loadBioProcesses();
            } else {
                displayError($rootScope.returnMessages.requestError);
            }
            $rootScope.hideLoading();

        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
            $rootScope.hideLoading();
        });
    };


    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

        if($scope.currentAction === $scope.modalActions.add ) {

            if($scope.bioProcess && $scope.bioProcess.name) {
                $scope.bioProcess.description = ($scope.bioProcess.description) ? $scope.bioProcess.description : '';
                addBioProcess($scope.bioProcess);
            } else {
                displayError($rootScope.returnMessages.bioProcessNameRequired);
            }

        } else {
            // Add HERE EDIT ACTIONS
            console.log('Edit action');
        }
    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    /**
     * Sets current role actions as marked on UI
     * @return {[type]} [description]
     */
    var mergeFactors = function () {
        $scope.displayFactors = [];

        for(var factorIndex = 0; factorIndex < $scope.systemFactors.length; factorIndex++) {
            var factor = $scope.systemFactors[factorIndex];

            if(isInArray(factor)) {
                factor.class = 'bp-calculation';
            } else {
                factor.class = null;
            }

            $scope.displayFactors.push(factor);
        }
    };

    $scope.modifyFactor = function (pFactor) {
        pFactor.class = (pFactor.class) ? null : 'bp-calculation';
    };

    /**
     * Gets the current selected factors on UI
     * @return {List[Object]} [The list of factors selected for the specified bioProcess]
     */
    var getSelectedFactors = function () {

        var selectedFactors = [];
        var displayFactors = $scope.displayFactors;


        for(var factorIndex = 0; factorIndex < displayFactors.length; factorIndex++) {

            var factor = displayFactors[factorIndex];

            // Enter the selected factor on new array
            if(factor.class) {
                selectedFactors.push(factor.attributeId);
            }
        }

        return selectedFactors;
    };


    init();
}]);

// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify Calculation controller file
//

bioPredictorApp.controller('modifyCalculationController',['$rootScope','$scope','$uibModalInstance', 'calculationsService','bioProcessesService', 'sessionService',
function ($rootScope, $scope, $uibModalInstance, calculationsService, bioProcessesService, sessionService) {


    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

      $rootScope.isLogin = true;
      $rootScope.isMenu = true;

      $scope.bioProcesses = [];
      $scope.processRegisters = [];
      $scope.showBioProcessFilter = true;

      //$scope.bioProcessesList = {bioProcess:{processId:-1, name: ""}};


      $rootScope.displayLoading();
      loadProcesses();
      getRecomendedActivities();
      $rootScope.hideLoading();

    };

    /**
     * Load the bio processes in the Form Modal
     * @param  No params
     * @return No Return 
     */

    var loadProcesses = function(){

      var currentUser = sessionService.getCurrentUser();

      bioProcessesService.getBioProcesses(currentUser)
      .then(function(pBioProcesses)
      {
        $scope.bioProcesses = [];
        $scope.bioProcesses = $scope.bioProcesses.concat(pBioProcesses);
      })
      .catch(function(pError)
      {
        displayError($rootScope.returnMessages.loadBioProcessesError);
      });

    };

        /**
     * Load the activities to the Scope
     * @param  No params
     * @return No Return 
     */

    var getRecomendedActivities = function(){

      calculationsService.getRecomendedActivities()
      .then(function(pRecomendedActivities)
      {
        $scope.recomendedActivities = pRecomendedActivities;
      })
      .catch(function(pError)
      {
        displayError($rootScope.returnMessages.loadBioProcessesError);
      });

    };
    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };


    /**
     * Sends new calculation to service
     * @param {[type]}  [description]
     */
   var generateCalculation = function(pCalculation) {

        $rootScope.displayLoading();
        calculationsService.generateCalculation(pCalculation)
        .then(function(pCalculationO) {

            if(pCalculationO && pCalculationO.calculationId != - 1) {

                $scope.calculation = null;
                displaySuccess($rootScope.returnMessages.calculationAddSuccess);
                $scope.loadCalculations();
            } else {
                displayError($rootScope.returnMessages.requestError);
            }
            $rootScope.hideLoading();

        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
            $rootScope.hideLoading();
        });
    };


    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {
      if((document.getElementById('startDate').value > document.getElementById('endDate').value)||
        (document.getElementById('startDate').value=="")||(document.getElementById('endDate').value=="")){
        displayError($rootScope.returnMessages.invalidRangeOfDates);
      }else{
        $scope.calculation = {};
        var bpElement = document.getElementById('bpOption');
        $scope.calculation.bioProcessId = parseInt(bpElement.options[bpElement.selectedIndex].id);
        if($scope.calculation.bioProcessId){

          $scope.calculation.userId = sessionService.getCurrentUser().userId;

          var startDate = document.getElementById('startDate').value;
          $scope.calculation.startDate = startDate;
          var endDate = document.getElementById('endDate').value;
          $scope.calculation.endDate = endDate;
          $scope.calculation.dateRange = startDate + ' . ' + endDate;

          getProcessRegisters($scope.calculation);
        }
        else{displayError($rootScope.returnMessages.invalidBioProcess);
        }
      }
    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };



    var recomendActivity  = function(pResult){
      var activities = $scope.recomendedActivities;
      for(var i in activities){
        if (pResult >= activities[i].startValue && pResult <= activities[i].endValue) {
          return activities[i].recomendedActivityId
        }
      }
      return 1;
    }


    var getProcessRegisters = function (pCalculation) {

      pCalculation.processId = pCalculation.bioProcessId;

      calculationsService.getProcessRegisters(pCalculation)
      .then(function(pProcessRegisters) {
        $scope.processRegisters = pProcessRegisters;
        $scope.calculation.result = calculateValue(pProcessRegisters);
        $scope.calculation.recomendedActivityId = recomendActivity($scope.calculation.result);
        generateCalculation($scope.calculation);
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadProcessRegistersError);

      });
    };

    var calculateValue = function (pProcessRegisters){
      var result=0.0;
      for (var i in pProcessRegisters) {
        result+= pProcessRegisters[i].value;
      }
        return result;

    };





    init();
}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        31 Ago 2016
// * Description: Modify company controller file
//

bioPredictorApp.controller('modifyCompanyController',['$rootScope','$scope','$uibModalInstance', 'companiesService',
function ($rootScope, $scope, $uibModalInstance, companiesService) {

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Sends new company to service
     * @param {[type]} pCompany [description]
     */
    var addCompany = function(pCompany) {

        $rootScope.displayLoading();

        companiesService.addCompany(pCompany)
        .then(function(pCompany) {

            if(pCompany && pCompany.companyId != - 1) {

                $scope.company = null;
                displaySuccess($rootScope.returnMessages.companyAddSuccess);
                console.log('Compañia agregada: ' + pCompany.companyId);
                $scope.loadCompanies();

            } else {
                displayError($rootScope.returnMessages.requestError);
            }
            $rootScope.hideLoading();

        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
            $rootScope.hideLoading();
        });
    };


    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

        if($scope.currentAction === $scope.modalActions.add ) {

            if($scope.company && $scope.company.name) {
                $scope.company.description = ($scope.company.description) ? $scope.company.description : '';
                addCompany($scope.company);
            } else {
                displayError($rootScope.returnMessages.companyNameRequired);
            }

        } else {
            // Add HERE EDIT ACTIONS
            console.log('Edit action');
        }
    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };
}]);

// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify factor controller file
//

bioPredictorApp.controller('modifyFactorController',['$rootScope','$scope','$uibModalInstance', 'factorsService', 'sessionService',
function ($rootScope, $scope, $uibModalInstance, factorsService, sessionService) {

    var init = function () {
        loadEquipmentTypes();
        $scope.values = [];

    };

    $scope.updateAttributes= function(pEquipmentType){

      $scope.equipmentType = $scope.selectedEquipmentType;
      loadAttributes();
    };

    var loadEquipmentTypes = function(){

      factorsService.getEquipmentTypes()
      .then(function(pEquipmentTypes)
      {
        $scope.equipmentTypes = pEquipmentTypes;
      })
      .catch(function(pError)
      {
        displayError($rootScope.returnMessages.loadBioProcessesError);
      });

    };

        var loadAttributes = function(){

      factorsService.getAttributesXEquipmentType($scope.equipmentType)
      .then(function(pAttributes)
      {
        $scope.attributes = pAttributes;
      })
      .catch(function(pError)
      {
        displayError($rootScope.returnMessages.loadBioProcessesError);
      });

    };
    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Sends new factor to service
     * @param {[type]} pCompany [description]
     */
    var addEquipment = function(pEquipment) {

        $rootScope.displayLoading();


        factorsService.addEquipment(pEquipment)
        .then(function(pEquipment) {

            if(pEquipment && pEquipment.equipmentId != - 1) {

                $scope.factor = null;
                displaySuccess($rootScope.returnMessages.equipmentAddSuccess);
                console.log('Equipo Agregado: ' + pEquipment.equipmentId);
                $scope.loadFactors();
            } else {

                displayError($rootScope.returnMessages.requestError);
            }
            $rootScope.hideLoading();

        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
            $rootScope.hideLoading();
        });
    };

    $scope.modifyFactor = function (pFactor) {
        pFactor.class = (pFactor.class) ? null : 'bp-calculation';
    };
    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

        if($scope.currentAction === $scope.modalActions.add ) {

            if($scope.factor && $scope.factor.code) {
              if($scope.selectedEquipmentType){
                $scope.factor.equipmentTypeId = $scope.selectedEquipmentType.equipmentTypeId;
                addEquipment($scope.factor);
              }else{
                displayError($rootScope.returnMessages.equipmentTypeRequired);
              }
            } else {
                displayError($rootScope.returnMessages.equipmentCodeRequired);
            }

        } else {
            // Add HERE EDIT ACTIONS
            console.log('Edit action');
        }
    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

        init();
}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

bioPredictorApp.controller('modifyRoleController',['$rootScope','$scope','$uibModalInstance', 'rolesService','factorsService',
function ($rootScope, $scope, $uibModalInstance, rolesService, factorsService) {

    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {
        loadEquipmentTypes();
    };

    var loadEquipmentTypes = function(){

      factorsService.getEquipmentTypes()
      .then(function(pEquipmentTypes)
      {
        $scope.equipmentTypes = pEquipmentTypes;
      })
      .catch(function(pError)
      {
        displayError($rootScope.returnMessages.loadBioProcessesError);
      });

    };

    /**
     * Sets current role actions as marked on UI
     * @return {[type]} [description]
     */
    var mergeActions = function () {

        $scope.displayActions = [];

        for(var actionIndex = 0; actionIndex < $scope.systemActions.length; actionIndex++) {
            var action = $scope.systemActions[actionIndex];

            if(isInArray(action)) {
                action.class = 'bp-calculation';
            } else {
                action.class = null;
            }

            $scope.displayActions.push(action);
        }
    };

    var isInArray = function(pElement) {

        var result = false;
        var roleActions = $scope.roleActions;

        for(var actionIndex = 0; actionIndex < roleActions.length; actionIndex++) {
            var action = roleActions[actionIndex];

            if(action.actionId === pElement.actionId) {

                result = true;
                break;
            }
        }

        return result;
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Creates the role object to be sent to service
     * @param {Object} pRole [The role object to be save]
     */
    var addRole = function(pRole) {

        $rootScope.displayLoading();
        pRole.equipmentTypeId = $scope.selectedEquipmentType.equipmentTypeId;

        rolesService.addRole(pRole)
        .then(function(pRoleId) {
            $scope.role = null;
            displaySuccess($rootScope.returnMessages.roleAddSuccess);
            init();
            $scope.loadRoles();
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
        })
        .finally(function(){
            $rootScope.hideLoading();
        });
    };

    /**
     * Gets the current selected actions on UI
     * @return {List[Object]} [The list of actions selected for the specified role]
     */
    var getSelectedActions = function () {

        var selectedActions = [];
        var displayActions = $scope.displayActions;

        for(var actionIndex = 0; actionIndex < displayActions.length; actionIndex++) {

            var action = displayActions[actionIndex];

            // Enter the selected action on new array
            if(action.class) {
                selectedActions.push(action.actionId);
            }
        }

        return selectedActions;
    };


    $scope.modifyAction = function (pAction) {
        pAction.class = (pAction.class) ? null : 'bp-calculation';
    };


    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

        if($scope.currentAction === $scope.modalActions.add ) {

            if($scope.role && $scope.role.name) {
                $scope.role.description = ($scope.role.description) ? $scope.role.description : '';
                addRole($scope.role);
            } else {
                displayError($rootScope.returnMessages.roleNameRequired);
            }

        } else {
            // Add HERE EDIT ACTIONS
            console.log('Edit action');
        }
    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    init();


}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

bioPredictorApp.controller('modifyUserControllerModal',['$rootScope','$scope','$uibModalInstance', 'companiesService', 'rolesService',
function ($rootScope, $scope, $uibModalInstance, companiesService,rolesService) {

    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

        $scope.companies = [];
        $scope.systemRoles = [];
        $rootScope.displayLoading();

        companiesService.getCompanies()
        .then(function(pCompanies) {
            $scope.companies = pCompanies;
            return rolesService.getRoles();
        })
        .then(function(pRoles) {
            $scope.systemRoles = pRoles;

            if($scope.user) {
                return rolesService.getRolesByUserId($scope.user);
            } else {
                return [];
            }
        })
        .then(function(pRoles) {
            $scope.userRoles = pRoles;
            return mergeRoles();
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.loadDataError);
        })
        .finally(function() {
            $rootScope.hideLoading();
        });
    };


    /**
     * Merge the current roles with user's to be displayed on UI
     * @return {[type]} [description]
     */
    var mergeRoles = function () {

        $scope.displayRoles = [];

        for(var roleIndex = 0; roleIndex < $scope.systemRoles.length; roleIndex++) {
            var role = $scope.systemRoles[roleIndex];

            if(isInArray(role)) {
                role.class = 'bp-calculation';
            } else {
                role.class = null;
            }

            $scope.displayRoles.push(role);

        }
    };

    /**
     * Verify if role is in array
     * @param  {Object}  pElement [The element to vefify that exists in array]
     * @return {Boolean}          [description]
     */
    var isInArray = function(pElement) {

        var result = false;
        var userRoles = $scope.userRoles;

        for(var elemIndex = 0; elemIndex < userRoles.length; elemIndex++) {
            var role = userRoles[elemIndex];

            if(role.roleId === pElement.roleId) {
                result = true;
                break;
            }
        }

        return result;
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Creates the role object to be sent to service
     * @param {Object} pRole [The role object to be save]
     */
    var addRole = function(pRole) {

        $rootScope.displayLoading();
        pRole.actionIds = getSelectedActions();

        rolesService.addRole(pRole)
        .then(function(pRoleId) {
            $scope.role = null;
            displaySuccess($rootScope.returnMessages.roleAddSuccess);
            init();
            $scope.loadRoles();
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
        })
        .finally(function(){
            $rootScope.hideLoading();
        });
    };

    /**
     * Gets the current selected actions on UI
     * @return {List[Object]} [The list of actions selected for the specified role]
     */
    var getSelectedRoles = function () {

        var selectedActions = [];
        var displayActions = $scope.displayActions;

        for(var actionIndex = 0; actionIndex < displayActions.length; actionIndex++) {

            var action = displayActions[actionIndex];

            // Enter the selected action on new array
            if(action.class) {
                selectedActions.push(action.actionId);
            }
        }

        return selectedActions;
    };

    /**
     * Changes the role state on selecte/unselected
     * @param  {[type]} pRole [description]
     * @return {[type]}       [description]
     */
    $scope.modifyRole = function (pRole) {
        pRole.class = (pRole.class) ? null : 'bp-calculation';
    };


    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

        if($scope.currentAction === $scope.modalActions.add ) {

            if($scope.role && $scope.role.name) {
                $scope.role.description = ($scope.role.description) ? $scope.role.description : '';
                addRole($scope.role);
            } else {
                displayError($rootScope.returnMessages.roleNameRequired);
            }

        } else {
            // Add HERE EDIT ACTIONS
            console.log('Edit action');
        }
    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    init();
}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

bioPredictorApp.controller('removeConfirmController',['$rootScope','$scope','$uibModalInstance',
function ($rootScope, $scope, $uibModalInstance) {

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        console.log("Cancel action");
        $uibModalInstance.dismiss('cancel');
    };

}]);

// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify Calculation controller file
//

bioPredictorApp.controller('showCalculationController',['$rootScope','$scope','$uibModalInstance', 'calculationsService','bioProcessesService', 'sessionService',
function ($rootScope, $scope, $uibModalInstance, calculationsService, bioProcessesService, sessionService) {


    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

      $rootScope.isLogin = true;
      $rootScope.isMenu = true;

      $rootScope.displayLoading();
      $rootScope.hideLoading();
    };


    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };




    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };



    init();
}]);

// *
// * Author:      Fabian Arce Molina - sarcem1111@gmail.com
// * Date:        10 Oct 2016
// * Description: The reports controller
//

'use strict';

// Handles the report controller logic
bioPredictorApp.controller('reportsController', ['$scope', '$rootScope', 'rolesService', 'companiesService', 'factorsService', 'usersService','bioProcessesService',
function($scope, $rootScope, rolesService, companiesService, factorsService, usersService, bioProcessesService)
{

  $rootScope.isLogin = false;
  $rootScope.isMenu = false;

  $scope.reports = [];
  $scope.companies = [];
  $scope.bioProcesses = [];
  $scope.showCompanyFilter = false;
  $scope.showBioProcessFilter = false;

  $scope.companiesList = {company:{companyId:-1, name: "No Filter"}};
  $scope.bioProcessesList = {bioProcess:{processId:-1, name: "No Filter"}};
  var downloadButton = document.getElementById("downloadButton");

  $rootScope.displayLoading();

  companiesService.getCompanies()
  .then(function(pCompanies)
  {
    $scope.companies = [];
    $scope.companies.push({companyId:-1, name: "Sin filtro"});
    $scope.companies = $scope.companies.concat(pCompanies);
  })
  .catch(function(pError)
  {
    displayError($rootScope.returnMessages.loadRolesError);
  });
/*
  bioProcessesService.getBioProcesses()
  .then(function(pBioProcesses)
  {
    $scope.bioProcesses.push({processId:-1, name: "Sin filtro"});
    $scope.bioProcesses = pBioProcesses;
  })
  .catch(function(pError)
  {
    displayError($rootScope.returnMessages.loadRolesError);
  });
*/
  $rootScope.hideLoading();

  $scope.getBioProcessesReport = function(pCompany)
  {
    $scope.showCompanyFilter = true;
    $scope.showBioProcessFilter = false;
    $scope.downloadName = "Descargar reporte de BioProcesos";
    $scope.showDownload = true;

    $rootScope.displayLoading();
    bioProcessesService.getBioProcessesReport(pCompany)
    .then(function(pBioProcesses)
    {
      loadCSVFromJSON(pBioProcesses, "Reporte de bioProcesos - BioPredictor");
      createReport(pBioProcesses);
    })
    .catch(function(pError)
    {
      displayError($rootScope.returnMessages.loadRolesError);
      $rootScope.hideLoading();
    });
  };

  $scope.getCompaniesReport = function(pCompany)
  {
    $scope.showCompanyFilter = true;
    $scope.showBioProcessFilter = false;
    $scope.downloadName = "Descargar reporte de compañias";
    $scope.showDownload = true;

    $rootScope.displayLoading();
    companiesService.getCompaniesReport(pCompany)
    .then(function(pCompanies)
    {
      loadCSVFromJSON(pCompanies, "Reporte de compañias - BioPredictor");
      createReport(pCompanies);
    })
    .catch(function(pError)
    {
      displayError($rootScope.returnMessages.loadRolesError);
      $rootScope.hideLoading();
    });
  };

  $scope.getFactorsReport = function(pCompany)
  {
    $scope.showCompanyFilter = true;
    $scope.showBioProcessFilter = false;
    $scope.downloadName = "Descargar reporte de factores";
    $scope.showDownload = true;

    $rootScope.displayLoading();
    factorsService.getFactorsReport(pCompany)
    .then(function(pFactors)
    {
      loadCSVFromJSON(pFactors, "Reporte de factores - BioPredictor");
      createReport(pFactors);
    })
    .catch(function(pError)
    {
      displayError($rootScope.returnMessages.loadRolesError);
      $rootScope.hideLoading();
    });
  };

  function createReport(pData)
  {
      $scope.reports = [];

      var elements =
      {
        element:[]
      };

      for (var i = 0; i < pData.length; i++)
      {
        Object.keys(pData[i]).forEach(function(key)
        {
          elements.element.push
          (
            {title: key,content: pData[i][key]}
          );
        });

        $scope.reports.push(elements);

        elements =
        {
          element:[]
        };
      };
      //alert(JSON.stringify($scope.reports)); For debug
      $rootScope.hideLoading();
  };

  function loadCSVFromJSON(pJSONArray, pCSVName)
  {
    if(pJSONArray != "")
    {
      var array = typeof pJSONArray != 'object' ? JSON.parse(pJSONArray) : pJSONArray;
      var csvContent = "data:text/csv;charset=utf-8,";

      Object.keys(pJSONArray[0]).forEach(function(key)
      {
        csvContent += key +',';
      });

      csvContent += '\r\n';

      for (var i = 0; i < array.length; i++)
      {
          var line = '';
          for (var index in array[i])
          {
              if (line != '')
                line += ','
              line += array[i][index];
          }
          csvContent += line + '\r\n';
      };

      downloadButton.setAttribute("href", encodeURI(csvContent));
      downloadButton.setAttribute("download", pCSVName + ".csv");

    }
  };
}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

bioPredictorApp.controller('modifyRoleController2',['$rootScope','$scope','$uibModalInstance', 'rolesService', 'factorsService',
function ($rootScope, $scope, $uibModalInstance, rolesService, factorsService) {


    var init = function () {

     $rootScope.displayLoading();

      factorsService.getEquipments()
      .then(function(pEquipments) {
        $scope.equipments = pEquipments;
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadEquipmentsError);
        $rootScope.hideLoading();
      });


    };

    /**
     * Sets current role actions as marked on UI
     * @return {[type]} [description]
     */
    var mergeActions = function () {

        $scope.displayActions = [];

        for(var actionIndex = 0; actionIndex < $scope.systemActions.length; actionIndex++) {
            var action = $scope.systemActions[actionIndex];

            if(isInArray(action)) {
                action.class = 'bp-calculation';
            } else {
                action.class = null;
            }

            $scope.displayActions.push(action);
        }
    };

    var isInArray = function(pElement) {

        var result = false;
        var roleActions = $scope.roleActions;

        for(var actionIndex = 0; actionIndex < roleActions.length; actionIndex++) {
            var action = roleActions[actionIndex];

            if(action.actionId === pElement.actionId) {

                result = true;
                break;
            }
        }

        return result;
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Creates the role object to be sent to service
     * @param {Object} pRole [The role object to be save]
     */
    var addRole = function(pRole) {

        $rootScope.displayLoading();
        pRole.actionIds = getSelectedActions();

        rolesService.addRole(pRole)
        .then(function(pRoleId) {
            $scope.role = null;
            displaySuccess($rootScope.returnMessages.roleAddSuccess);
            init();
            $scope.loadRoles();
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
        })
        .finally(function(){
            $rootScope.hideLoading();
        });
    };

    /**
     * Gets the current selected actions on UI
     * @return {List[Object]} [The list of actions selected for the specified role]
     */
    var getSelectedActions = function () {

        var selectedActions = [];
        var displayActions = $scope.displayActions;

        for(var actionIndex = 0; actionIndex < displayActions.length; actionIndex++) {

            var action = displayActions[actionIndex];

            // Enter the selected action on new array
            if(action.class) {
                selectedActions.push(action.actionId);
            }
        }

        return selectedActions;
    };


    $scope.modifyAction = function (pAction) {
        pAction.class = (pAction.class) ? null : 'bp-calculation';
    };


    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {


            if($scope.selectedEquipment && $scope.startDate && $scope.endDate) {
                $scope.getUpkeepsXDate();
                
                
            } else {
                displayError($rootScope.returnMessages.fieldsRequired);
            }

 
    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    var genPDF = function(pSelectedUpkeeps){
        var doc=new jsPDF();
        console.log(pSelectedUpkeeps);
        var canvas = document.getElementById('myCanvas');
        var dataURL = canvas.toDataURL();
        doc.addImage(dataURL,'JPEG',10,1,180,100);
        doc.setFontSize(20);
        doc.setFont("cambria");
        doc.text(40,60,'Informe de Mantenimiento Preventivo');
        doc.setFontSize(11);
        doc.text(15,75,'Unidad de Tratamiento:');
        doc.text(55,75,$scope.selectedEquipment.treatmentUnit);
        doc.text(15,80,'Tipo de Equipo:');
        doc.text(45,80,$scope.selectedEquipment.name);
        doc.text(15,85,'Modelo:');
        doc.text(35,85,$scope.selectedEquipment.model);
        doc.text(15,90,'Marca:');
        doc.text(35,90,$scope.selectedEquipment.brand);
        doc.text(15,95,'Voltaje Nominal:');
        doc.text(45,95,$scope.selectedEquipment.voltage.toString());
        doc.text(80,90,'Amperios Nominal:');
        doc.text(113,90,$scope.selectedEquipment.ampers.toString());
        doc.text(80,95,'Potencia Nominal:');
        doc.text(110,95,$scope.selectedEquipment.name.toString());
        doc.text(130,75,'Código:');
        doc.text(150,75,$scope.selectedEquipment.code);
        var y = 65
        var max = 1;
        for(var i = 0; i<$scope.selectedUpkeeps.length; i++){
          if(max == 4){
            doc.addImage(dataURL,'JPEG',10,240,180,100);
            doc.addPage();
            y  = 0;
            max = 0;
          }
          y+=45;
          doc.setFontSize(12);
          doc.setFont("cambria","bold");
          doc.text(15,y,$scope.selectedUpkeeps[i].NAME);
          doc.setFont("cambria","regular");
          y+=5;
          doc.text(15,y,"Descripción: "+$scope.selectedUpkeeps[i].DESCRIPTION);
          max+=1;
          doc.text(15,y+5,"Detalle: ");

        }
        doc.addImage(dataURL,'JPEG',10,240,180,100);
        doc.addPage();
        doc.setFont("cambria","bold");
        doc.text(15,45,"Otras revisiones o reparaciones:");
        doc.text(15,120,"Observaciones o recomendaciones:");
        doc.text(15,200,"Fotos durante el mantenimiento");
        doc.addImage(dataURL,'JPEG',10,240,180,100);



        doc.save('Reporte Aminsa.pdf');

    };

    $scope.getUpkeepsXDate = function () {
      $rootScope.displayLoading();
      $scope.factor = {};
      console.log();
      $scope.factor.startDate = document.getElementById("startD").value;
      $scope.factor.endDate = document.getElementById("endD").value;
      $scope.factor.equipmentId = $scope.selectedEquipment.equipmentId;
      rolesService.getUpkeepsXDate($scope.factor)
      .then(function(pUpkeeps) {
        $scope.selectedUpkeeps = pUpkeeps;
        genPDF($scope.selectedUpkeeps);
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadUpkeepsError);
        $rootScope.hideLoading();
      });
    };



    init();

}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        19 Ago 2016
// * Description: The Companies list controller
//

'use strict';

// Handles the menu controller logic
bioPredictorApp.controller('listRolesController', ['$scope', '$rootScope', '$state', '$uibModal', 'sessionService', 'rolesService',
  function($scope, $rootScope,$state, $uibModal, sessionService, rolesService) {

    $rootScope.isLogin = false;
    $rootScope.isMenu = false;

    $scope.modalActions = {
        add: "Crear Mantenimiento",
        edit: "Editar Mantenimiento",
        view: "Exportar"
    };

    $scope.permissions = {
      addRole : {
        enabled : true,
        class : ''
      },
      viewListRole : {
        enabled : true,
        class : ''
      },
      removeRole : {
        enabled : true,
        class : ''
      }
    };

     /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function() {

      var currentUser = sessionService.getCurrentUser();

      if (currentUser.email == 'bpadmin@gmail.com' || currentUser.email == 'bpAdmin@gmail.com') {
        $scope.loadRoles();
        return
      }

      // Get all permissions
      $scope.permissions.addRole.enabled = sessionService.hasAction($rootScope.actions.addRole);
      $scope.permissions.viewListRole.enabled = sessionService.hasAction($rootScope.actions.viewListRole);
      $scope.permissions.removeRole.enabled = sessionService.hasAction($rootScope.actions.removeRole);

      $scope.permissions.addRole.class = ($scope.permissions.addRole.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.viewListRole.class = ($scope.permissions.viewListRole.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.removeRole.class = ($scope.permissions.removeRole.enabled) ? 'bp-enabled' : 'bp-disabled';

      if($scope.permissions.viewListRole.enabled) {
        $scope.loadRoles();
      }
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

     /**
     * Inits the Page variables
     * @return {[type]} [description]
     */
    $scope.loadRoles = function () {

      $rootScope.displayLoading();
      rolesService.getRoles()
      .then(function(pRoles) {
        $scope.roles = pRoles;
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadRolesError);
        $rootScope.hideLoading();
      });
    };

    /**
     * Handles the modal display event
     * @param  {string} pModalAction [The action to be performed]
     * @param  {Object} pRole     [The role object to be used if neccessary]
     * @return {[type]}              [description]
     */
    $scope.displayModal = function (pModalAction, pRole) {


        if(($scope.permissions.addRole.enabled && pModalAction === $scope.modalActions.add) ||
        (pModalAction === $scope.modalActions.view)) {

          $scope.currentAction = pModalAction;

          // Set company on edit
          if($scope.currentAction != $scope.modalActions.add) {
            $scope.role = pRole;
          } else {
            $scope.role = null;
          }

          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/modifyRole.html',
            controller: 'modifyRoleController',
            scope: $scope
          });

        }
    };

        $scope.displaySecondModal = function (pModalAction, pRole) {


        if(($scope.permissions.addRole.enabled && pModalAction === $scope.modalActions.add) ||
        (pModalAction === $scope.modalActions.view)) {

          $scope.currentAction = pModalAction;

          // Set company on edit
          if($scope.currentAction != $scope.modalActions.add) {
            $scope.role = pRole;
          } else {
            $scope.role = null;
          }

          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/roles/modifyRole2.html',
            controller: 'modifyRoleController2',
            scope: $scope
          });

        }
    };

    /**
     * Sends the request to te service to remove a role
     * @param  {[type]} pRole [The role to be removed]
     * @return {[type]}          [description]
     */
    $scope.removeUpkeep = function (pUpkeep) {


      $scope.removeObject = pUpkeep;
      $scope.removeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/removeConfirm.html',
        controller: 'removeConfirmController',
        scope: $scope
      });
    };

    /**
     * Does the remove action
     * @param  {Object} pData [The data object to be removed]
     * @return {[type]}       [description]
     */
    $scope.remove = function () {

      $rootScope.displayLoading();
      rolesService.removeUpkeep($scope.removeObject)
      .then(function(pResult) {

        if(pResult.removed) {
          displaySuccess($rootScope.returnMessages.upkeepRemoveSuccess);
          $scope.loadRoles();
        } else {
          displayError($rootScope.returnMessages.removeUpkeepInvalid);
        }
      })
      .catch(function(pError) {
        console.log(pError);
        displayError($rootScope.returnMessages.removeUpkeepError);
      })
      .finally(function() {
        $rootScope.hideLoading();
        $scope.removeObject = {};
        $scope.removeModalInstance.dismiss();
      });
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };


    init();

}]);


// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        19 Ago 2016
// * Description: Login html js controller
//

'use strict';

bioPredictorApp.controller('loginController', ['$scope', '$rootScope', '$state','usersService','sessionService',
    function($scope, $rootScope, $state, usersService, sessionService) {

    // Variable declaration
    $scope.error = false;
    $scope.errorMessage = '';
    $rootScope.isLogin = true;
    $rootScope.isMenu = false;

    var displayLoginError = function(){
        $scope.errorMessage = $rootScope.returnMessages.emailOrPassIncorrect;
        $scope.error = true;
    };


    /**
     * Handles the login login
     * @return {void} []
     */
    $scope.login = function () {

        $rootScope.displayLoading();

        usersService.login($scope.user)
        .then(function(pUser){
            if(pUser.email) {
                sessionService.authSuccess(pUser);
                $state.go('menu');
            } else {
                sessionService.authFailed();
                displayLoginError();
            }
            $rootScope.hideLoading();
        })
        .catch(function(pError){
            console.log(pError);
            displayLoginError();
            $rootScope.hideLoading();
        });
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function () {
        $scope.error = false;
        $scope.errorMessage = '';
    };

}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

'use strict';

bioPredictorApp.controller('modifyUserController',['$rootScope','$scope', '$state', 'companiesService', 'rolesService', 'sessionService',
  'usersService',
  function ($rootScope, $scope, $state, companiesService,rolesService, sessionService,usersService) {

    $scope.actions = {
        add: "Agregar Usuario",
        edit: "Editar Usuario",
        view: "Ver Usuario",
        edit_own: "Modificar"
    };

    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

        $rootScope.displayLoading();
        var modifyUser = sessionService.getObject($rootScope.sessionKeys.modifyUser);
        $scope.companies = [];
        $scope.systemRoles = [];

        if(!modifyUser) {
          $state.go('menu');
          $rootScope.hideLoading();
          return;
        }

        $scope.user = modifyUser.user;
        $scope.action = modifyUser.action;

        companiesService.getCompanies()
        .then(function(pCompanies) {

            // Add defalut element
            pCompanies.unshift({
                companyId: -1,
                name : 'Seleccione una compañia...'
            });
            setUserCompany(pCompanies);
            $scope.companies = pCompanies;

            return rolesService.getRoles();
        })
        .then(function(pRoles) {
            $scope.systemRoles = pRoles;

            if($scope.user) {
                return rolesService.getRolesByUserId($scope.user);
            } else {
                return [];
            }
        })
        .then(function(pRoles) {
            $scope.userRoles = pRoles;
            return mergeRoles();
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.loadDataError);
        })
        .finally(function() {
            $rootScope.hideLoading();
        });
    };

    /**
     * Sets the user company on the UI
     * @param {Object} pCompanies [The list of companies from DB]
     */
    var setUserCompany = function (pCompanies) {
        if($scope.user) {

            for(var companyIndex = 0; companyIndex < pCompanies.length; companyIndex++) {

                var company = pCompanies[companyIndex];

                if(company.companyId === $scope.user.companyId) {
                    $scope.selectedCompany = company;
                    break;
                }
            }
        } else {
            $scope.selectedCompany = pCompanies[0];
        }
    };


    /**
     * Merge the current roles with user's to be displayed on UI
     * @return {[type]} [description]
     */
    var mergeRoles = function () {

        $scope.displayRoles = [];

        for(var roleIndex = 0; roleIndex < $scope.systemRoles.length; roleIndex++) {
            var role = $scope.systemRoles[roleIndex];

            if(isInArray(role)) {
                role.class = 'bp-calculation';
            } else {
                role.class = null;
            }

             $scope.displayRoles.push(role);

        }
    };

    /**
     * Verify if role is in array
     * @param  {Object}  pElement [The element to vefify that exists in array]
     * @return {Boolean}          [description]
     */
    var isInArray = function(pElement) {

        var result = false;
        var userRoles = $scope.userRoles;

        for(var elemIndex = 0; elemIndex < userRoles.length; elemIndex++) {
            var role = userRoles[elemIndex];

            if(role.roleId === pElement.roleId) {
                result = true;
                break;
            }
        }

        return result;
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage) {
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Creates the role object to be sent to service
     * @param {Object} pUser [The user object to be save]
     */
    var modifyUser = function(pUser) {

        $rootScope.displayLoading();
        usersService.modifyUser(pUser)
        .then(function(pResult) {

            // Success Validation
            if(pResult.userId != -1) {

              $scope.user = ($scope.action == $scope.actions.add) ? null : $scope.user;
              displaySuccess($rootScope.returnMessages.userAddSuccess);

            } else {
              displayError(pResult.message);
            }
        })
        .catch(function(pError) {
            displayError($rootScope.returnMessages.requestError);
        })
        .finally(function(){
            $rootScope.hideLoading();
        });

    };

    /**
     * Gets the current selected roles on UI
     * @return {List[Object]} [The list of roles selected for the specified user]
     */
    var getSelectedRoles = function () {

        var selectedRoles = [];
        var displayRoles = $scope.displayRoles;

        for(var roleIndex = 0; roleIndex < displayRoles.length; roleIndex++) {

            var role = displayRoles[roleIndex];

            // Enter the selected action on new array
            if(role.class) {
                selectedRoles.push(role.roleId);
            }
        }

        return selectedRoles;
    };


    /**
     * Validates the user fields before sending them to DB save
     * @param  {Object}  pUser [The user to be store on DB]
     * @return {Object}       [A Result object with validation result]
     */
    var isValidUser = function (pUser) {

        var result = {};
        result.message = '';
        result.value = true;

        if(!pUser) {
          result.message += $rootScope.returnMessages.userInfoRequired + "\n";
          result.value = false;
          return result;
        }
        if(!pUser.name || pUser.name === '') {
          result.message += $rootScope.returnMessages.userNameRequired + "\n";
          result.value = false;
        }
        if(!pUser.lastName || pUser.lastName === '') {
          result.message += $rootScope.returnMessages.userLastNameRequired + "\n";
          result.value = false;
        }
        if(!pUser.email || pUser.email === '') {
          result.message += $rootScope.returnMessages.userEmailRequired + "\n";
          result.value = false;
        }
        if(!pUser.password || pUser.password === '') {
          result.message += $rootScope.returnMessages.userPasswordRequired + "\n";
          result.value = false;
        }
        if($scope.selectedCompany == $scope.companies[0]) {
          result.message += $rootScope.returnMessages.userCompanyRequired + "\n";
          result.value = false;
        }

        return result;
    };

    /**
     * Changes the role state on selecte/unselected
     * @param  {[type]} pRole [description]
     * @return {[type]}       [description]
     */
    $scope.modifyRole = function (pRole) {

        if($scope.action != $scope.actions.view && $scope.action != $scope.actions.edit_own){
            pRole.class = (pRole.class) ? null : 'bp-calculation';
        }
    };


    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

        var user = $scope.user;
        //$rootScope.hideLoading();
        var validationResult = isValidUser(user);

        if(validationResult.value){
            user.rolesIds = getSelectedRoles();
            user.isNew = ($scope.action == $scope.actions.add );
            user.companyId = $scope.selectedCompany.companyId;
            modifyUser(user);
        } else {
          displayError(validationResult.message);
        }

    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        // Clear the session user to modify
        sessionService.clearObject($rootScope.sessionKeys.modifyUser);
        $state.go('users-list');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    init();
}]);

// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        19 Ago 2016
// * Description: The Companies list controller
//

'use strict';

// Handles the menu controller logic
bioPredictorApp.controller('listUsersController', ['$scope', '$rootScope', '$state', '$uibModal', 'sessionService', 'usersService',
  function($scope, $rootScope,$state, $uibModal, sessionService, usersService) {

    $rootScope.isLogin = false;
    $rootScope.isMenu = false;
    // Clear the session user to modify
    sessionService.clearObject($rootScope.sessionKeys.modifyUser);

    $scope.modalActions = {
        add: 'Agregar Usuario',
        edit: 'Editar Usuario',
        view: 'Ver Usuario',
        edit_own: 'Modificar'
    };

    $scope.permissions = {
      addUser : {
        enabled : true,
        class : ''
      },
      editUser : {
        enabled : true,
        class : ''
      },
      viewListUser : {
        enabled : true,
        class : ''
      },
      removeUser : {
        enabled : true,
        class : ''
      }
    };

     /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function() {

      var currentUser = sessionService.getCurrentUser();

      if (currentUser.email == 'bpadmin@gmail.com' || currentUser.email == 'bpAdmin@gmail.com') {
        loadUsers();
        return
      }

      // Get all permissions
      $scope.permissions.addUser.enabled = sessionService.hasAction($rootScope.actions.addUser);
      $scope.permissions.editUser.enabled = sessionService.hasAction($rootScope.actions.editUser);
      $scope.permissions.viewListUser.enabled = sessionService.hasAction($rootScope.actions.viewListUser);
      $scope.permissions.removeUser.enabled = sessionService.hasAction($rootScope.actions.removeUser);

      $scope.permissions.addUser.class = ($scope.permissions.addUser.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.editUser.class = ($scope.permissions.editUser.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.viewListUser.class = ($scope.permissions.viewListUser.enabled) ? 'bp-enabled' : 'bp-disabled';
      $scope.permissions.removeUser.class = ($scope.permissions.removeUser.enabled) ? 'bp-enabled' : 'bp-disabled';

      if($scope.permissions.viewListUser.enabled) {
        loadUsers();
      }
    };

    /**
     * Inits the Page variables
     * @return {[type]} [description]
     */
    var loadUsers = function () {

      $rootScope.displayLoading();
      var currentUser = sessionService.getCurrentUser();
      usersService.getUsersByCompanyId(currentUser)
      .then(function(pUsers) {
        $scope.users = pUsers;
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadUsersError);
      })
      .finally(function () {
        $rootScope.hideLoading();
      });
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Displays the modal to add/edit/view an user
     * @param  {String} pModalAction [The current modal action to be user]
     * @param  {Object} pUser        [Optional: The user object to be viewed/edited]
     * @return {void}              [none]
     */
    $scope.modifyUser = function (pModalAction, pUser) {

      if(($scope.permissions.addUser.enabled && pModalAction === $scope.modalActions.add) ||
        ($scope.permissions.editUser.enabled && pModalAction === $scope.modalActions.edit) ||
        (pModalAction === $scope.modalActions.view)) {

        // Set user on edit/view
        var modifyUser = {};
        modifyUser.user = ($scope.currentAction != $scope.modalActions.add) ? pUser : null;
        modifyUser.action = pModalAction;
        // Set session user to modify
        sessionService.storeObject($rootScope.sessionKeys.modifyUser, modifyUser);
        $state.go('modify-user');
      }
    };

    /**
     * Sets the user to view
     * @return {[type]} [description]
     */
    $scope.viewMyAccount = function () {

      var currentUser = sessionService.getCurrentUser();
      var modifyUser = {};
      modifyUser.user = currentUser;
      modifyUser.action = $scope.modalActions.edit_own;
      // Set session user to modify
      sessionService.storeObject($rootScope.sessionKeys.modifyUser, modifyUser);
      $state.go('modify-user');
    };

    /**
     * Sends the request to te service to remove an user
     * @param  {[type]} pUser [description]
     * @return {[type]}          [description]
     */
    $scope.removeUser = function (pUser) {

      if(!$scope.permissions.removeUser.enabled) {
        return;
      }

      $scope.removeObject = pUser;
      $scope.removeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/removeConfirm.html',
        controller: 'removeConfirmController',
        scope: $scope
      });
    };

    /**
     * Does the remove action
     * @param  {Object} pData [The data object to be removed]
     * @return {[type]}       [description]
     */
    $scope.remove = function () {

      $rootScope.displayLoading();
      usersService.removeUser($scope.removeObject)
      .then(function(pResult) {

        if(pResult.removed) {
          displaySuccess($rootScope.returnMessages.removeUserSuccess);
          loadUsers();
        } else {
          displayError($rootScope.returnMessages.removeUserError);
        }
      })
      .catch(function(pError) {
        console.log(pError);
        displayError($rootScope.returnMessages.requestError);
      })
      .finally(function() {
        $rootScope.hideLoading();
        $scope.removeObject = {};
        $scope.removeModalInstance.dismiss();
      });
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    init();

}]);
