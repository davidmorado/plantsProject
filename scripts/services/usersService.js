// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        2 Set 2016
// * Description: User Service handle file
//

'use strict';

bioPredictorApp.service('usersService', function(configFactory, request) {

    var baseUrl = configFactory.getConfiguration().serverURL;
    var usersURL = baseUrl + '/api/user/';

    /**
     * Handles the user login action
     * @param  {Objct} pUser [The user to be auth]
     * @return {Object}       [The result from request]
     */
    this.login = function(pUser) {
        return request.post(usersURL + 'login', pUser);
    };

    /**
     * Gets the list of users for an specific company
     * @param  {Object} pUser [The current user logged]
     * @return {List<User>}       [The list of users for the company]
     */
    this.getUsersByCompanyId = function(pUser) {
        return request.post(usersURL + 'getUsersByCompanyId', pUser);
    };

    /**
     * Adds or edits a new user in DataBase
     * @param  {Object} pUser [The current user logged]
     * @return {Object}       [The result object from Service]
     */
    this.modifyUser = function(pUser) {
      return request.post(usersURL + 'modifyUser',pUser);
    };

    /**
     * Adds or edits a new user in DataBase
     * @param  {Object} pUser [The current user logged]
     * @return {Object}       [The list of users for the company]
     */
    this.removeUser = function(pUser) {
      return request.post(usersURL + 'removeUser',pUser);
    };

});
