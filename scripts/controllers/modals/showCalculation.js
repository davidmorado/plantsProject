// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify Calculation controller file
//

bioPredictorApp.controller('showCalculationController',['$rootScope','$scope','$uibModalInstance', 'calculationsService','bioProcessesService', 'sessionService',
function ($rootScope, $scope, $uibModalInstance, calculationsService, bioProcessesService, sessionService) {


    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

      $rootScope.isLogin = true;
      $rootScope.isMenu = true;

      $rootScope.displayLoading();
      $rootScope.hideLoading();
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
