// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        23 Nov 2016
// * Description: Common functions file
//

'use strict';

bioPredictorApp.factory('commonFunctions', function() {

    return {
         /**
         * Gets the Date String with DB format
         * @param  {Date} pDate [The Date object to format]
         * @return {String}       [The string object to be used]
         */
        getStingFormatDate : function (pDate) {

          var registerDate = 'DD/MM/YYYY HH:MM';

          registerDate = registerDate.replace('DD',pDate.getDate());
          registerDate = registerDate.replace('MM',pDate.getMonth() + 1);
          registerDate = registerDate.replace('YYYY',pDate.getFullYear());
          registerDate = registerDate.replace('HH',pDate.getHours());
          registerDate = registerDate.replace('MM',pDate.getMinutes());

          return registerDate;
        },

        /**
         * Gets the string to store the register values on DB
         * @param  {[factor]} pRegisters [The list of factor with values from DB]
         * @return {String}            [The string format for DB insert]
         */
        getRegisterValuesString : function (pRegisters) {

            var result = '';

            for(var registerIndex = 0; registerIndex < pRegisters.length; registerIndex++) {
                var register = pRegisters[registerIndex];
                result += '({id},' + register.factorId + ',' + register.value + '),';
            }

            return result.slice(0, -1);
        }

    };
});

