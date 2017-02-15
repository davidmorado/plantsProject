// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        3 Sep 2016
// * Description: Session handler
//

'use strict';

//Factory to manage the users operations to the web server
bioPredictorApp.factory('sessionService', ['$rootScope', 'localStorageService',

    function ($rootScope,localStorageService) {

        var userStorage = 'userStorage';

        var session = {
            /**
             * Initialize the session by reset the session
             */
            init: function () {
                //this.resetSession();
            },
            /**
             * Reset the session
             */
            resetSession: function() {
                localStorageService.remove(userStorage);
            },
            /**
             * logout the session active
             */
            logOut: function() {
                this.resetSession();
            },
            /**
             * Save the data of the session in the frontend
             * @param  {Object} pUserData - Object with the information of the current user
             */
            authSuccess: function(pUserData) {
                localStorageService.set(userStorage,pUserData);
            },
            /**
             * If login failed, reset the session
             */
            authFailed: function() {
                this.resetSession();
            },

            /**
             * Get the current user in the system
             * @return {Object} Return the object of the current user in the system
             */
            getCurrentUser: function(){
                return localStorageService.get(userStorage);
            },

            /**
             * Stores and object on session
             * @param  {String} pKey    [The object key]
             * @param  {Object} pObject [The object to be stored]
             * @return {[type]}         [description]
             */
            storeObject: function(pKey, pObject) {
                localStorageService.set(pKey,pObject);
            },

            /**
             * Gets an object on session identified by its key
             * @param  {String} pKey [The object key]
             * @return {Object}      [The object returned from session]
             */
            getObject: function(pKey) {
                return localStorageService.get(pKey);
            },

            /**
             * Clears the object from session
             * @param  {String} pKey [The object key to be cleared]
             * @return {[type]}      [description]
             */
            clearObject: function(pKey) {
                localStorageService.remove(pKey);
            },

            /**
             * Vierifes if users has the specified action
             * @param  {String}  pActionName [The name of the action verify]
             * @return {Boolean}             [True if found false if not]
             */
            hasAction: function (pActionName) {

                var userActions = (localStorageService.get(userStorage)).actions;

                // Verify if user has actions
                for (var actionIndex = 0; actionIndex < userActions.length; actionIndex++) {
                    var action = userActions[actionIndex];

                    if (action.name === pActionName){
                        return true;
                    }
                }
                return false;
            }
        };
        session.init();
        return session;
    }
]);
