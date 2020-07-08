/**
 * @description Service for managing member policy data as a logged in Member.
 * @namespace Services
 * @class policyService
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.services.policy', [])
    .factory('policyService', [
      '$rootScope',
      function($rootScope) {
        return {
          getSelectedPolicy: function() {
            return $rootScope.selectedPolicy;
          }
        };
      }
    ]);
}());
