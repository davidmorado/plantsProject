// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        2 Set 2016
// * Description: User Service handle file
//

'use strict';

bioPredictorApp.service('companiesService', function(configFactory, request) 
{
    var baseUrl = configFactory.getConfiguration().serverURL;
    var companiesUrl = baseUrl + '/api/company/';

    /**
     * Send data to service to add a new company
     * @param  {Objct} pCompany [The company to be added]
     * @return {Object}       [The result from request]
     */
    this.addCompany = function(pCompany) {
        return request.post(companiesUrl + 'addCompany', pCompany);
    };

    /**
     * Gets the list of companies form Server
     * @return {Object} [The list of companies obtained]
     */
    this.getCompanies = function() {
        return request.get(companiesUrl + 'getCompanies');
    };

    /**
     * Removes a company from DB
     * @param  {Object} pCompany [The company to be removed]
     * @return {Object}            [The company object removed]
     */
    this.removeCompany = function(pCompany) {
        return request.post(companiesUrl + 'removeCompany', pCompany);
    };

    /**
     * Gets the report of companies form Server by companyId
     * @param  {Object} pCompany [The company id]
     * @return {Object} [The list of companies obtained]
     */
    this.getCompaniesReport = function (pCompany) {
        return request.post(companiesUrl + 'getCompaniesReport', pCompany);
    };

});
