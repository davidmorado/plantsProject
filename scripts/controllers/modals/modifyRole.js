// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

bioPredictorApp.controller('modifyRoleController',['$rootScope','$scope','$uibModalInstance', 'rolesService',
function ($rootScope, $scope, $uibModalInstance, rolesService) {

    /**
     * Page init function
     * @return {[type]} [description]
     */
    var init = function () {

        $scope.roleActions = [];
        $rootScope.displayLoading();

        rolesService.getActions()
        .then(function(pActions) {
            $scope.systemActions = pActions;
            if($scope.role) {
                return rolesService.getActionsXRole($scope.role);
            } else {
                return [];
            }
        })
        .then(function(pActions) {
            $scope.roleActions = pActions;
            return mergeActions();
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
     * Sets current role actions as marked on UI
     * @return {[type]} [description]
     */
    var mergeActions = function () {

        $scope.displayActions = [];

        for(var actionIndex = 0; actionIndex < $scope.systemActions.length; actionIndex++) {
            var action = $scope.systemActions[actionIndex];

            if(isInArray(action)) {
                action.class = 'bp-calculation';
            } else {
                action.class = null;
            }

            $scope.displayActions.push(action);
        }
    };

    var isInArray = function(pElement) {

        var result = false;
        var roleActions = $scope.roleActions;

        for(var actionIndex = 0; actionIndex < roleActions.length; actionIndex++) {
            var action = roleActions[actionIndex];

            if(action.actionId === pElement.actionId) {

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
    var getSelectedActions = function () {

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


    $scope.modifyAction = function (pAction) {
        pAction.class = (pAction.class) ? null : 'bp-calculation';
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
