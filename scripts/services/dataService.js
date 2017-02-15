// *
// * Author:      Luis Carlos Cruz G - kalo070995@gmail.com
// * Date:        31 Oct 2016
// * Description: Data Service controller file
//

'use strict';

bioPredictorApp.service('dataService', function(configFactory, request) {


    var baseUrl = configFactory.getConfiguration().serverURL;
    var dataUrl = baseUrl + '/api/data/';


    /**
     * Send data to service to add a new factor
     * @param  {Objct} pFactor [The factor to be added]
     * @return {Object}       [The result from request]
     */
    this.addDataManual = function(pData) {
        return request.post(dataUrl + 'addDataManual', pData);
    };

    /**
     * Gets the data registers for the logged user
     * @param  {Object} pUser [The user logged in the system]
     * @return {Object}       [The result from request]
     */
    this.getData = function(pUser) {
        return request.post(dataUrl + 'getData', pUser);
    };

    /**
     * Disables a data register on DB
     * @param  {Object} pData [The data register to be disabled]
     * @return {Object}       [The result from request]
     */
    this.removeData = function(pData) {
        return request.post(dataUrl + 'removeData', pData);
    };

    /**
     * Gets the data registers for the specified data object
     * @param  {Object} pData [The data object to get registers from]
     * @return {Object}       [Result obtained from request]
     */
    this.getDataRegisters = function(pData) {
        return request.post(dataUrl + 'getDataRegisters', pData);
    };

});
