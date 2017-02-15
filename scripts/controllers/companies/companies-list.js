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

