/**
 * Directive for the info box on the claim details page.
 *
 * @namespace Directives
 * @class claimInfo
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.claimInfo', [])
  .directive('claimInfo', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/claim-info.html',
        scope: {
          /**
          * The claim information to display.
          *
          * @memberof claimInfo
          * @member {Object} info
          */
          info: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'adobeService',
          '$location',
          'quickAlertService',
          '$timeout',
          function($scope, $rootScope, adobeService, $location, quickAlertService, $timeout) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
          }
        ]
      };
    }
  ]);
}());
