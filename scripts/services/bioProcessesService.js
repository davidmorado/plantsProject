// *
// * Author:      David Obando Paniagua - dobando2595@gmail.com
// * Date:        05 Sep 2016
// * Description: Factors Service handle file
//

'use strict';

bioPredictorApp.service('bioProcessesService', function(configFactory, request) {



    var baseUrl = configFactory.getConfiguration().serverURL;
    var bioProcessesUrl = baseUrl + '/api/bioProcess/';


    /**
     * Send data to service to add a new factor
     * @param  {Objct} pFactor [The factor to be added]
     * @return {Object}       [The result from request]
     */
    this.addBioProcess = function(pBioProcess) {
        return request.post(bioProcessesUrl + 'addBioProcess', pBioProcess);
    };

    /**
     * Gets the list of bioProcess form Server
     * @return {Object} [The list of factors obtained]
     */
    this.getBioProcesses = function(pUser) {
        return request.post(bioProcessesUrl + 'getBioProcesses', pUser);
    };

    /**
     * Removes a bioProcess from DB
     * @param  {Object} pBioProcess [The
     * bioProcess to be removed]
     * @return {Object}            [The bioProcess object removed]
     */
    this.removeEquipmentType = function(pEquipmentType) {
        return request.post(bioProcessesUrl + 'removeEquipmentType', pEquipmentType);
    };

        /**
     * Gets the list of factors form Server
     * @return {Object} [The list of factors obtained]
     */
    this.getFactors = function() {
        return request.get(bioProcessesUrl + 'getFactors');
    };

    /**
     * Gets the factors related to an specific bioProcess
     * @param  {Object} pBioProcess [THe bioProcess to get data from]
     * @return {List[Object]}       [The list of factors returned]
     */
    this.getFactorsXBioProcess = function(pBioProcess) {
        return request.post(bioProcessesUrl + 'getFactorsXBioProcess', pBioProcess);
    };

    /**
     * Gets the bioProcess report
     * @param  {Object} pCompany [The company id filter, -1 to show all]
     * @return {List[Object]}       [The list of bioProcesses returned]
     */
    this.getBioProcessesReport = function(pCompany) {
        return request.post(bioProcessesUrl + 'getBioProcessesReport', pCompany);
    };

});
