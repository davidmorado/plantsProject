// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        2 Set 2016
// * Description: User Service handle file
//

'use strict';

bioPredictorApp.service('rolesService', function(configFactory, request) 
{
    var baseUrl = configFactory.getConfiguration().serverURL;
    var rolesURL = baseUrl + '/api/role/';

    /**
     * Send data to service to add a new role
     * @param  {Objct} pRole [The role to be added]
     * @return {Object}       [The result from request]
     */
    this.addRole = function(pRole) {
        return request.post(rolesURL + 'addRole', pRole);
    };

    /**
     * Gets the list of roles form Server
     * @return {Object} [The list of roles obtained]
     */
    this.getRoles = function() {
        return request.get(rolesURL + 'getRoles');
    };

    /**
     * Removes a role from DB
     * @param  {Object} pRole [The role to be removed]
     * @return {Object}            [The role object removed]
     */
    this.removeRole = function(pRole) {
        return request.post(rolesURL + 'removeRole', pRole);
    };

    /**
     * Gets the actions related to an specific role
     * @param  {Object} pRole [THe role to get data from]
     * @return {List[Object]}       [The list of actions returned]
     */
    this.getActionsXRole = function(pRole) {
        return request.post(rolesURL + 'getActionsXRole', pRole);
    };

    /**
     * Gets the actions
     * @return {List[Object]}       [The list of actions returned]
     */
    this.getActions = function() {
        return request.get(rolesURL + 'getActions');
    };

    /**
     * Sends a new Role object to be added to DB
     * @param  {Object} pRole [The role to be inserted in DB]
     * @return {Int}       [The id of the role added]
     */
    this.addRole = function(pRole) {
        return request.post(rolesURL + 'addRole', pRole);
    };

    /**
     * Gets the list of user roles form Server
     * @return {Object} [The list of roles obtained]
     */
    this.getRolesByUserId = function(pUser) {
        return request.post(rolesURL + 'getRolesByUserId', pUser);
    };

});
