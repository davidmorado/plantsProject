// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        31 Ago 2016
// * Description: Modify company controller file
//

bioPredictorApp.controller('modifyCompanyController',['$rootScope','$scope','$uibModalInstance', 'companiesService',
function ($rootScope, $scope, $uibModalInstance, companiesService) {

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
     * Sends new company to service
     * @param {[type]} pCompany [description]
     */
    var addCompany = function(pCompany) {

        $rootScope.displayLoading();

        companiesService.addCompany(pCompany)
        .then(function(pCompany) {

            if(pCompany && pCompany.companyId != - 1) {

                $scope.company = null;
                displaySuccess($rootScope.returnMessages.companyAddSuccess);
                console.log('Compañia agregada: ' + pCompany.companyId);
                $scope.loadCompanies();

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

            if($scope.company && $scope.company.name) {
                $scope.company.description = ($scope.company.description) ? $scope.company.description : '';
                addCompany($scope.company);
            } else {
                displayError($rootScope.returnMessages.companyNameRequired);
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
