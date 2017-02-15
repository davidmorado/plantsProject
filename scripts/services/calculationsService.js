// *
// * Author:      David Obando Paniagua
// * Date:        18 Noviembre 2016
// * Description: Calculation Service handle file
//

'use strict';

bioPredictorApp.service('calculationsService', function(configFactory, request) 
{
    var baseUrl = configFactory.getConfiguration().serverURL;
    var calculationsURL = baseUrl + '/api/calculation/';

    /**
     * Send data to service to add a new calculation
     * @param  {Objct} pcalculation [The calculation to be added]
     * @return {Object}       [The result from request]
     */
    this.generateCalculation = function(pCalculation) {
        return request.post(calculationsURL + 'generateCalculation', pCalculation);
    };

    /**
     * Gets the list of Calculations form Server
     * @return {Object} [The list of Calculations obtained]
     */
    this.getCalculations = function(pUser) {
        return request.post(calculationsURL + 'getCalculations', pUser);
    };

    /**
     * Removes a Calculation from DB
     * @param  {Object} pCalculation [The Calculation to be removed]
     * @return {Object}            [The Calculation object removed]
     */
    this.removeCalculation = function(pCalculation) {
        return request.post(calculationsURL + 'removeCalculation', pCalculation);
    };

    /**
     * Gets the actions related to an specific Calculation
     * @param  {Object} pCalculation [THe Calculation to get data from]
     * @return {List[Object]}       [The list of actions returned]
     */
    this.getActionsXCalculation = function(pCalculation) {
        return request.post(calculationsURL + 'getActionsXCalculation', pCalculation);
    };

    /**
     * Gets the actions
     * @return {List[Object]}       [The list of actions returned]
     */
    this.getActions = function() {
        return request.get(calculationsURL + 'getActions');
    };

    /**
     * Sends a new calculation object to be added to DB
     * @param  {Object} pcalculation [The calculation to be inserted in DB]
     * @return {Int}       [The id of the calculation added]
     */
    this.addCalculation = function(pCalculation) {
        return request.post(calculationsURL + 'addCalculation', pCalculation);
    };

    /**
     * Gets the list of user Calculations form Server
     * @return {Object} [The list of Calculations obtained]
     */
    this.getRecomendedActivities = function() {
        return request.get(calculationsURL + 'getRecomendedActivities');
    };


    /**
     * Gets the list of Process Registers form Server
     * @return {Object} [The list of Process Registers obtained]
     */
    this.getProcessRegisters = function(pProcessId) {
        return request.post(calculationsURL + 'getProcessRegisters', pProcessId);
    };

});