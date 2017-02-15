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

