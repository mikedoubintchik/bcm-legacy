/**
 * Directive for the payment flow container component.
 *
 * @namespace Directives
 * @class paymentFlow
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.paymentFlow', [
      'bcbsnc.cloud.services.page'
    ])
    .directive('paymentFlowPage', function() {
      return {
        restrict: 'E',
        scope: {
          loc: '=localization',
          step: '=',
          billingInfo: '=',
          trackerInfo: '=',
          validateForm: '=',
          navbarDetails: '='
        },
        templateUrl: function($elem, $attrs) {
          var url = 'views/payment-flow-page-' + $attrs.step.toLowerCase() + '.html';
          return url;
        },
        controller: ['$rootScope', '$scope', '$routeParams', 'PaymentFlowFactory', function($rootScope, $scope, $routeParams, PaymentFlowFactory) {
          $scope.selectedPolicy = $rootScope.selectedPolicy;
          $scope.userData = PaymentFlowFactory.getUserSetData();
          $scope.gotoView = $rootScope.gotoView;
          $scope.trackerInfo = {
            step: $routeParams.step.toUpperCase()
          };
        }]
      };
    })
    .directive('paymentFlow', [
      function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'views/payment-flow.html',
          controller: 'PaymentFlowController',
          link: function($scope, $elem, $attrs) {

          }
        };
      }
    ]);
}());
