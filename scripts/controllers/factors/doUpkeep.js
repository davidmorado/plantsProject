// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify factor controller file
//

bioPredictorApp.controller('doUpkeepController',['$rootScope','$scope','$uibModalInstance', 'factorsService', 'sessionService','rolesService',
function ($rootScope, $scope, $uibModalInstance, factorsService, sessionService,rolesService) {

    var init = function () {
        loadEquipmentTypes();
        loadUpKeeps();
        $scope.values = [];

    };

    var loadUpKeeps = function () {

      $rootScope.displayLoading();
      factorsService.getUpkeepsXEquipmentType($scope.factor)
      .then(function(pUpkeeps) {
        $scope.displayUpkeeps = pUpkeeps;
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadRolesError);
        $rootScope.hideLoading();
      });
    };

    $scope.updateAttributes= function(pEquipmentType){

      $scope.equipmentType = $scope.selectedEquipmentType;
      loadAttributes();
    };

    var loadEquipmentTypes = function(){

      factorsService.getEquipmentTypes()
      .then(function(pEquipmentTypes)
      {
        $scope.equipmentTypes = pEquipmentTypes;
      })
      .catch(function(pError)
      {
        displayError($rootScope.returnMessages.loadBioProcessesError);
      });

    };

        var loadAttributes = function(){

      factorsService.getAttributesXEquipmentType($scope.equipmentType)
      .then(function(pAttributes)
      {
        $scope.attributes = pAttributes;
      })
      .catch(function(pError)
      {
        displayError($rootScope.returnMessages.loadBioProcessesError);
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
     * Sends new factor to service
     * @param {[type]} pCompany [description]
     */
    var addFactor = function(pFactor) {

        $rootScope.displayLoading();

        pFactor.upKeepIds = getSelectedUpkeeps();

        factorsService.doUpkeep(pFactor)
        .then(function(pFactor) {

            if(pFactor && pFactor.factorId != - 1) {

                $scope.factor = null;
                displaySuccess($rootScope.returnMessages.factorAddSuccess);
            } else {

                displayError($rootScope.returnMessages.requestError);
            }
            $rootScope.hideLoading();

        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
            $rootScope.hideLoading();
        });
    };

    $scope.modifyFactor = function (pFactor) {
        pFactor.class = (pFactor.class) ? null : 'bp-calculation';
    };
    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

            var sUpkeeps = getSelectedUpkeeps();
            if(sUpkeeps.length > 0) {
                addFactor($scope.factor);
            } else {
                displayError($rootScope.returnMessages.noUpkeep);
            }

    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
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

    $scope.modifyUpkeep = function (pUpkeep) {
        pUpkeep.class = (pUpkeep.class) ? null : 'bp-calculation';
    };

    var getSelectedUpkeeps = function () {

        var selectedUpkeeps = [];
        var displayUpkeeps = $scope.displayUpkeeps;


        for(var factorIndex = 0; factorIndex < displayUpkeeps.length; factorIndex++) {

            var upkeep = displayUpkeeps[factorIndex];

            
            if(upkeep.class) {
                selectedUpkeeps.push(upkeep.upkeepId);
            }
        }

        return selectedUpkeeps;
    };

        init();
}]);
