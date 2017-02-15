// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify factor controller file
//

bioPredictorApp.controller('modifyBioProcessController',['$rootScope','$scope','$uibModalInstance', 'bioProcessesService', 'sessionService',
function ($rootScope, $scope, $uibModalInstance, bioProcessesService, sessionService) {


    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

        $scope.bpFactors = [];
        $rootScope.displayLoading();

        bioProcessesService.getFactors()
        .then(function(pFactors) {
            $scope.systemFactors = pFactors;
            if($scope.bioProcess) {
                console.log($scope.bioProcess);
                return bioProcessesService.getFactorsXBioProcess($scope.bioProcess);
            } else {
                console.log("Nada");
                return [];
            }
        })
        .then(function(pFactors) {
            $scope.bpFactors = pFactors;
            return mergeFactors();
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.loadActionsError);
        })
        .finally(function() {
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

    var isInArray = function(pElement) {

        var result = false;
        var bpFactors = $scope.bpFactors;
        for(var factorIndex = 0; factorIndex < bpFactors.length; factorIndex++) {
            var factor = bpFactors[factorIndex];

            if(factor.factorId === pElement.factorId) {

                result = true;
                break;
            }
        }

        return result;
    };

    /**
     * Sends new factor to service
     * @param {[type]} pCompany [description]
     */
    var addBioProcess = function(pBioProcess) {

        $rootScope.displayLoading();
        pBioProcess.factorIds = getSelectedFactors();

        var currentUser = sessionService.getCurrentUser();

        pBioProcess.registerUserId = currentUser.userId;
        pBioProcess.companyId = currentUser.companyId;

        bioProcessesService.addBioProcess(pBioProcess)
        .then(function(pBioProcess) {

            if(pBioProcess && pBioProcess.bioProcessId != - 1) {

                $scope.bioProcess = null;
                displaySuccess($rootScope.returnMessages.bioProcessAddSuccess);
                $scope.loadBioProcesses();
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

            if($scope.bioProcess && $scope.bioProcess.name) {
                $scope.bioProcess.description = ($scope.bioProcess.description) ? $scope.bioProcess.description : '';
                addBioProcess($scope.bioProcess);
            } else {
                displayError($rootScope.returnMessages.bioProcessNameRequired);
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

    /**
     * Sets current role actions as marked on UI
     * @return {[type]} [description]
     */
    var mergeFactors = function () {

        $scope.displayFactors = [];

        for(var factorIndex = 0; factorIndex < $scope.systemFactors.length; factorIndex++) {
            var factor = $scope.systemFactors[factorIndex];

            if(isInArray(factor)) {
                factor.class = 'bp-calculation';
            } else {
                factor.class = null;
            }

            $scope.displayFactors.push(factor);
        }
    };

    $scope.modifyFactor = function (pFactor) {
        pFactor.class = (pFactor.class) ? null : 'bp-calculation';
    };

    /**
     * Gets the current selected factors on UI
     * @return {List[Object]} [The list of factors selected for the specified bioProcess]
     */
    var getSelectedFactors = function () {

        var selectedFactors = [];
        var displayFactors = $scope.displayFactors;

        for(var factorIndex = 0; factorIndex < displayFactors.length; factorIndex++) {

            var factor = displayFactors[factorIndex];

            // Enter the selected factor on new array
            if(factor.class) {
                selectedFactors.push(factor.factorId);
            }
        }

        return selectedFactors;
    };


    init();
}]);
