// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify factor controller file
//

bioPredictorApp.controller('modifyFactorController',['$rootScope','$scope','$uibModalInstance', 'factorsService', 'sessionService',
function ($rootScope, $scope, $uibModalInstance, factorsService, sessionService) {

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

        var currentUser = sessionService.getCurrentUser();

        pFactor.registerUserId = currentUser.userId;
        pFactor.companyId = currentUser.companyId;

        factorsService.addFactor(pFactor)
        .then(function(pFactor) {

            if(pFactor && pFactor.factorId != - 1) {

                $scope.factor = null;
                displaySuccess($rootScope.returnMessages.factorAddSuccess);
                console.log('Factor agregado: ' + pFactor.factorId);
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


    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

        if($scope.currentAction === $scope.modalActions.add ) {

            if($scope.factor && $scope.factor.name) {
                $scope.factor.description = ($scope.factor.description) ? $scope.factor.description : '';
                addFactor($scope.factor);
            } else {
                displayError($rootScope.returnMessages.factorNameRequired);
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
}]);
