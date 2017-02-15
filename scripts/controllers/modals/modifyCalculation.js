// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Modify Calculation controller file
//

bioPredictorApp.controller('modifyCalculationController',['$rootScope','$scope','$uibModalInstance', 'calculationsService','bioProcessesService', 'sessionService',
function ($rootScope, $scope, $uibModalInstance, calculationsService, bioProcessesService, sessionService) {


    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

      $rootScope.isLogin = true;
      $rootScope.isMenu = true;

      $scope.bioProcesses = [];
      $scope.processRegisters = [];
      $scope.showBioProcessFilter = true;

      //$scope.bioProcessesList = {bioProcess:{processId:-1, name: ""}};


      $rootScope.displayLoading();
      loadProcesses();
      getRecomendedActivities();
      $rootScope.hideLoading();

    };

    /**
     * Load the bio processes in the Form Modal
     * @param  No params
     * @return No Return 
     */

    var loadProcesses = function(){

      var currentUser = sessionService.getCurrentUser();

      bioProcessesService.getBioProcesses(currentUser)
      .then(function(pBioProcesses)
      {
        $scope.bioProcesses = [];
        $scope.bioProcesses = $scope.bioProcesses.concat(pBioProcesses);
      })
      .catch(function(pError)
      {
        displayError($rootScope.returnMessages.loadBioProcessesError);
      });

    };

        /**
     * Load the activities to the Scope
     * @param  No params
     * @return No Return 
     */

    var getRecomendedActivities = function(){

      calculationsService.getRecomendedActivities()
      .then(function(pRecomendedActivities)
      {
        $scope.recomendedActivities = pRecomendedActivities;
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
     * Sends new calculation to service
     * @param {[type]}  [description]
     */
   var generateCalculation = function(pCalculation) {

        $rootScope.displayLoading();
        calculationsService.generateCalculation(pCalculation)
        .then(function(pCalculationO) {

            if(pCalculationO && pCalculationO.calculationId != - 1) {

                $scope.calculation = null;
                displaySuccess($rootScope.returnMessages.calculationAddSuccess);
                $scope.loadCalculations();
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
      if((document.getElementById('startDate').value > document.getElementById('endDate').value)||
        (document.getElementById('startDate').value=="")||(document.getElementById('endDate').value=="")){
        displayError($rootScope.returnMessages.invalidRangeOfDates);
      }else{
        $scope.calculation = {};
        var bpElement = document.getElementById('bpOption');
        $scope.calculation.bioProcessId = parseInt(bpElement.options[bpElement.selectedIndex].id);
        if($scope.calculation.bioProcessId){

          $scope.calculation.userId = sessionService.getCurrentUser().userId;

          var startDate = document.getElementById('startDate').value;
          $scope.calculation.startDate = startDate;
          var endDate = document.getElementById('endDate').value;
          $scope.calculation.endDate = endDate;
          $scope.calculation.dateRange = startDate + ' . ' + endDate;

          getProcessRegisters($scope.calculation);
        }
        else{displayError($rootScope.returnMessages.invalidBioProcess);
        }
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



    var recomendActivity  = function(pResult){
      var activities = $scope.recomendedActivities;
      for(var i in activities){
        if (pResult >= activities[i].startValue && pResult <= activities[i].endValue) {
          return activities[i].recomendedActivityId
        }
      }
      return 1;
    }


    var getProcessRegisters = function (pCalculation) {

      pCalculation.processId = pCalculation.bioProcessId;

      calculationsService.getProcessRegisters(pCalculation)
      .then(function(pProcessRegisters) {
        $scope.processRegisters = pProcessRegisters;
        $scope.calculation.result = calculateValue(pProcessRegisters);
        $scope.calculation.recomendedActivityId = recomendActivity($scope.calculation.result);
        generateCalculation($scope.calculation);
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadProcessRegistersError);

      });
    };

    var calculateValue = function (pProcessRegisters){
      var result=0.0;
      for (var i in pProcessRegisters) {
        result+= pProcessRegisters[i].value;
      }
        return result;

    };





    init();
}]);
