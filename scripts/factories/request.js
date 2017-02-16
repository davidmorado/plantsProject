// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        2 Set 2016
// * Description: Config Factory file
//

'use strict';

bioPredictorApp.factory('request', ['$http', '$q', function($http, $q) {

    return {

        /**
         * Http post method wrapper
         * @param  {Sring} pUrl  [The url to pos the data ]
         * @param  {Object} pData [The request body to be sent]
         * @return {Object}       [The response from server]
         */
        post: function(pUrl, pData){

            var deferred = $q.defer();

            $http({
                url: pUrl,
                method: 'POST',
                data: pData,
                //withCredentials: true
            }).then(function(data) {
                deferred.resolve(data);
            }).error(function(data, status) {
                deferred.reject(data, status);
            });
            //return the pormise object
            return deferred.promise;
        },

        /**
         * Http get method wrapper
         * @param  {string} pUrl [The url to get from]
         * @return {Object}      [Result obtained from request]
         */
        get: function(pUrl) {
            var deferred = $q.defer();

            $http({
                url: pUrl,
                method: 'GET',
                //withCredentials: true
            }).then(function(data) {
                deferred.resolve(data);
            }).error(function(data, status) {
                deferred.reject(status, data);
            });
            //return the pormise object
            return deferred.promise;
        },

    };
}]);
