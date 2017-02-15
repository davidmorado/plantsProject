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
