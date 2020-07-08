/**
 * Directive for display when failed to load a page.
 *
 * @namespace Directives
 * @class errorLoadingPage
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.errorLoadingPage', [])
  .directive('errorLoadingPage', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/error-loading-page.html',
        scope: {},
        controller: [
          '$scope',
          '$rootScope',
          'helpService',
          function($scope, $rootScope, helpService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
          }
        ]
      };
    }
  ]);
}());
