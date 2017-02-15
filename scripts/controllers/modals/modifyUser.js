// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

bioPredictorApp.controller('modifyUserControllerModal',['$rootScope','$scope','$uibModalInstance', 'companiesService', 'rolesService',
function ($rootScope, $scope, $uibModalInstance, companiesService,rolesService) {

    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

        $scope.companies = [];
        $scope.systemRoles = [];
        $rootScope.displayLoading();

        companiesService.getCompanies()
        .then(function(pCompanies) {
            $scope.companies = pCompanies;
            return rolesService.getRoles();
        })
        .then(function(pRoles) {
            $scope.systemRoles = pRoles;

            if($scope.user) {
                return rolesService.getRolesByUserId($scope.user);
            } else {
                return [];
            }
        })
        .then(function(pRoles) {
            $scope.userRoles = pRoles;
            return mergeRoles();
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.loadDataError);
        })
        .finally(function() {
            $rootScope.hideLoading();
        });
    };


    /**
     * Merge the current roles with user's to be displayed on UI
     * @return {[type]} [description]
     */
    var mergeRoles = function () {

        $scope.displayRoles = [];

        for(var roleIndex = 0; roleIndex < $scope.systemRoles.length; roleIndex++) {
            var role = $scope.systemRoles[roleIndex];

            if(isInArray(role)) {
                role.class = 'bp-calculation';
            } else {
                role.class = null;
            }

            $scope.displayRoles.push(role);

        }
    };

    /**
     * Verify if role is in array
     * @param  {Object}  pElement [The element to vefify that exists in array]
     * @return {Boolean}          [description]
     */
    var isInArray = function(pElement) {

        var result = false;
        var userRoles = $scope.userRoles;

        for(var elemIndex = 0; elemIndex < userRoles.length; elemIndex++) {
            var role = userRoles[elemIndex];

            if(role.roleId === pElement.roleId) {
                result = true;
                break;
            }
        }

        return result;
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
     * Creates the role object to be sent to service
     * @param {Object} pRole [The role object to be save]
     */
    var addRole = function(pRole) {

        $rootScope.displayLoading();
        pRole.actionIds = getSelectedActions();

        rolesService.addRole(pRole)
        .then(function(pRoleId) {
            $scope.role = null;
            displaySuccess($rootScope.returnMessages.roleAddSuccess);
            init();
            $scope.loadRoles();
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
        })
        .finally(function(){
            $rootScope.hideLoading();
        });
    };

    /**
     * Gets the current selected actions on UI
     * @return {List[Object]} [The list of actions selected for the specified role]
     */
    var getSelectedRoles = function () {

        var selectedActions = [];
        var displayActions = $scope.displayActions;

        for(var actionIndex = 0; actionIndex < displayActions.length; actionIndex++) {

            var action = displayActions[actionIndex];

            // Enter the selected action on new array
            if(action.class) {
                selectedActions.push(action.actionId);
            }
        }

        return selectedActions;
    };

    /**
     * Changes the role state on selecte/unselected
     * @param  {[type]} pRole [description]
     * @return {[type]}       [description]
     */
    $scope.modifyRole = function (pRole) {
        pRole.class = (pRole.class) ? null : 'bp-calculation';
    };


    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {

        if($scope.currentAction === $scope.modalActions.add ) {

            if($scope.role && $scope.role.name) {
                $scope.role.description = ($scope.role.description) ? $scope.role.description : '';
                addRole($scope.role);
            } else {
                displayError($rootScope.returnMessages.roleNameRequired);
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
