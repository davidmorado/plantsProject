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

