// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        19 Ago 2016
// * Description: Login html js controller
//

'use strict';

bioPredictorApp.controller('loginController', ['$scope', '$rootScope', '$state','usersService','sessionService',
    function($scope, $rootScope, $state, usersService, sessionService) {

    // Variable declaration
    $scope.error = false;
    $scope.errorMessage = '';
    $rootScope.isLogin = true;
    $rootScope.isMenu = false;

    var displayLoginError = function(){
        $scope.errorMessage = $rootScope.returnMessages.emailOrPassIncorrect;
        $scope.error = true;
    };


    /**
     * Handles the login login
     * @return {void} []
     */
    $scope.login = function () {

        $rootScope.displayLoading();

        usersService.login($scope.user)
        .then(function(pUser){
            if(pUser.email) {
                sessionService.authSuccess(pUser);
                $state.go('menu');
            } else {
                sessionService.authFailed();
                displayLoginError();
            }
            $rootScope.hideLoading();
        })
        .catch(function(pError){
            console.log(pError);
            displayLoginError();
            $rootScope.hideLoading();
        });
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function () {
        $scope.error = false;
        $scope.errorMessage = '';
    };

}]);
