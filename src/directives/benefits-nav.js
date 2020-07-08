/**
 * Directive for the benefitsNav page.
 *
 * @namespace Directives
 * @class benefitsNav
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.benefitsNav', [])
  .directive('benefitsNav', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/benefits-nav.html',
        controller: [
          '$rootScope',
          '$scope',
          function($rootScope, $scope) {
            $scope.loc = $rootScope.loc;
            $scope.trackAction = $rootScope.trackAction;
          }
        ]
      };
    }
  ]);
}());
