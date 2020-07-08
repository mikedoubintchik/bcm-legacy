/**
 * Directive for a bottom button.
 *
 * @namespace Directives
 * @class bottomButton
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.bottomButton', [])
  .directive('bottomButton', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/bottom-button.html',
        scope: {
          /**
          * Display information for the bottom button.
          *
          * @memberof bottomButton
          * @member {Object} buttonDetails
          */
          buttonDetails: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;
          }
        ]
      };
    }
  ]);
}());
