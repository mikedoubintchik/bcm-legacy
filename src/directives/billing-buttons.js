/**
 * Directive for the on billing buttons on billing landing page.
 *
 * @namespace Directives
 * @class billingButtons
 */
(function() {
    'use strict';
  
    angular.module('blueconnect.mobile.directives.billingButtons', [])
    .directive('billingButtons', [
      function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'partials/billing-buttons.html',
          scope: {
            /**
            * The billing buttons information to display.
            *
            * @memberof billingButtons
            * @member {Object} billingButtonsInfo
            */
            billingButtonsInfo: '='
          },
          controller: [
            '$scope',
            '$rootScope',
            function($scope, $rootScope) {
              $scope.loc = $rootScope.loc;
              $scope.selectedPolicy = $rootScope.selectedPolicy;
              $scope.gotoView = $rootScope.gotoView;
            }
          ]
        };
      }
    ]);
  }());
  