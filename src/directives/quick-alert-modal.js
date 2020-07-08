/**
 * Directive for the reusable quick alert modal.
 *
 * @namespace Directives
 * @class quickAlertModal
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.quickAlertModal', [])
  .directive('quickAlertModal', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/quick-alert-modal.html',
        scope: false,
        controller: [
          '$rootScope',
          '$scope',
          function($rootScope, $scope) {

          }
        ]
      };
    }
  ]);
}());
