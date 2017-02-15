// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Factors Service handle file
//

'use strict';

bioPredictorApp.service('factorsService', function(configFactory, request) {



    var baseUrl = configFactory.getConfiguration().serverURL;
    var factorsUrl = baseUrl + '/api/factor/';

    /**
     * Send data to service to add a new factor
     * @param  {Objct} pFactor [The factor to be added]
     * @return {Object}       [The result from request]
     */
    this.addFactor = function(pFactor) {
        return request.post(factorsUrl + 'addFactor', pFactor);
    };

    /**
     * Gets the list of factors form Server
     * @return {Object} [The list of factors obtained]
     */
    this.getFactors = function() {
        return request.get(factorsUrl + 'getFactors');
    };

    /**
     * Gets the list of factors form Server
     * @return {Object} [The list of factors obtained]
     */
    this.viewFactors = function() {
        return request.get(factorsUrl + 'viewFactors');
    };

    /**
     * Removes a factor from DB
     * @param  {Object} pFactor [The
     * factor to be removed]
     * @return {Object}            [The factor object removed]
     */
    this.removeFactor = function(pFactor) {
        return request.post(factorsUrl + 'removeFactor', pFactor);
    };


    this.getFactorsReport = function(pCompany) {
        return request.post(factorsUrl + 'getFactorsReport', pCompany);
    };
});
