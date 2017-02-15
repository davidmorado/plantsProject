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
