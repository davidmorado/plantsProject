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

