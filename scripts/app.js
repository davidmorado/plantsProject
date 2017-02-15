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
