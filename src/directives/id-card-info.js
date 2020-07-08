/**
 * Directive for the info box on the id card details page.
 *
 * @namespace Directives
 * @class idCardInfo
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.idCardInfo', [])
  .directive('idCardInfo', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/id-card-info.html',
        scope: {
          /**
          * The id card information to display.
          *
          * @memberof idCardInfo
          * @member {Object} info
          */
          info: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
          }
        ]
      };
    }
  ]);
}());
