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

