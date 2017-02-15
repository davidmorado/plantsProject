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
