/**
 * Directive for the reusable share modal.
 *
 * @namespace Directives
 * @class shareModal
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.shareModal', [])
  .directive('shareModal', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/share-modal.html',
        scope: false,
        controller: [
          '$scope',
          '$rootScope',
          'adobeService',
          function($scope, $rootScope, adobeService) {
          }
        ]
      };
    }
  ]);
}());
