/**
 * @description Service for showing an alert modal.
 * @namespace Services
 * @class alertService
 */
(function() {
  'use strict';

  angular
  .module('blueconnect.mobile.services.coachmark', [])
  .factory('coachmarkService', [
    '$rootScope',
    '$timeout',
    'restService',
    function($rootScope, $timeout, restService) {
      var coachmarksData = {};
      return {
        getCoachmarkData: function (page) {
          var queryString = "show=" + page + '&policyIndex=' + $rootScope.policyIndex
                            + '&policyExternalId=' + $rootScope.selectedPolicy.externalId +
                            "&policyEffectiveDate=" + $rootScope.selectedPolicy.effectiveDate + "&policyExpirationDate=" + $rootScope.selectedPolicy.expirationDate;

          return restService
            .getData('coachmarks?' + queryString, $rootScope.language || 'en')
            .then(function(result) {
              if (result.data && result.data.pages) {
                coachmarksData[page] = result.data;
              }
              return result;
            });
        },
        /**
         * @description Displays a coachmark for the specified page.
         * @memberof MainController
         * @method showCoachmark
         */
        showCoachmarks: function(page) {
          return this
            .getCoachmarkData(page)
            .then(function(result) {
              return $timeout(function() {
                angular
                  .element('.coachmark')
                  .scope()
                  .show(result);
              }, result.delay || 250);
          });
        }

      };
    }
  ]);
}());