// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

'use strict';

bioPredictorApp.controller('loadDataCsv',['$rootScope','$scope', '$state', 'sessionService', 'bioProcessesService', 'dataService', 'commonFunctions',
  function ($rootScope, $scope, $state, sessionService,bioProcessesService,dataService, commonFunctions) {

    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

      /*
      // Redirect outside if no data is stored
      if(!modifyData) {
        $state.go('menu');
        $rootScope.hideLoading();
        return;
      }*/

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

    $scope.saveCSV = function () 
    {
        
    };

    init();
}]);
