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
        add: "Agregar Factor",
        edit: "Editar Factor",
        view: "Ver Factor"
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

      factorsService.getFactors()
      .then(function(pFactors) {
        $scope.factors = pFactors;
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadFactorsError);
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

    /**
     * Sends the request to te service to remove a factor
     * @param  {[type]} pFactor [description]
     * @return {[type]}          [description]
     */
    $scope.removeFactor = function (pFactor) {

      if(!$scope.permissions.removeFactor.enabled) {
        return;
      }

      $scope.removeObject = pFactor;
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

      factorsService.removeFactor($scope.removeObject)
      .then(function(pResult) {

        if(pResult.removed) {
          displaySuccess($rootScope.returnMessages.factorRemoveSuccess);
          $scope.loadFactors();
        } else {
          displayError($rootScope.returnMessages.removeFactorInvalid);
        }
      })
      .catch(function(pError) {
        console.log(pError);
        displayError($rootScope.returnMessages.removeFactorError);
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

