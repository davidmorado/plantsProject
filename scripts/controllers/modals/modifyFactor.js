// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify factor controller file
//

bioPredictorApp.controller('modifyFactorController',['$rootScope','$scope','$uibModalInstance', 'factorsService', 'sessionService',
function ($rootScope, $scope, $uibModalInstance, factorsService, sessionService) {

    var init = function () {
        loadEquipmentTypes();
        $scope.values = [];

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
    var addEquipment = function(pEquipment) {

        $rootScope.displayLoading();


        factorsService.addEquipment(pEquipment)
        .then(function(pEquipment) {

            if(pEquipment && pEquipment.equipmentId != - 1) {

                $scope.factor = null;
                displaySuccess($rootScope.returnMessages.equipmentAddSuccess);
                console.log('Equipo Agregado: ' + pEquipment.equipmentId);
                $scope.loadFactors();
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

        if($scope.currentAction === $scope.modalActions.add ) {

            if($scope.factor && $scope.factor.code) {
              if($scope.selectedEquipmentType){
                $scope.factor.equipmentTypeId = $scope.selectedEquipmentType.equipmentTypeId;
                addEquipment($scope.factor);
              }else{
                displayError($rootScope.returnMessages.equipmentTypeRequired);
              }
            } else {
                displayError($rootScope.returnMessages.equipmentCodeRequired);
            }

        } else {
            // Add HERE EDIT ACTIONS
            console.log('Edit action');
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

        init();
}]);
