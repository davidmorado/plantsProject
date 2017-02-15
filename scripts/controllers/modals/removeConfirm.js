// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

bioPredictorApp.controller('removeConfirmController',['$rootScope','$scope','$uibModalInstance',
function ($rootScope, $scope, $uibModalInstance) {

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        console.log("Cancel action");
        $uibModalInstance.dismiss('cancel');
    };

}]);
