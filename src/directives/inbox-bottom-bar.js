/**
 * Directive for the message list bottom bar.
 *
 * @namespace Directives
 * @class inboxBottomBar
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.inboxBottomBar', [])
  .directive('inboxBottomBar', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/inbox-bottom-bar.html',
        scope: false,
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          'adobeService',
          function($scope, $rootScope, $location, adobeService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;

            $scope.returnPath = $location.$$path;
          }
        ]
      };
    }
  ]);
}());
