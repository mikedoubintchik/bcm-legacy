/**
 * Directive for the id card bottom bar.
 *
 * @namespace Directives
 * @class idCardBottomBar
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.idCardBottomBar', [])
  .directive('idCardBottomBar', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/id-card-bottom-bar.html',
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          function($scope, $rootScope, $location) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;

            $scope.shareIdCard = function() {
              $rootScope.shareIdCard();
            };
          }
        ]
      };
    }
  ]);
}());
