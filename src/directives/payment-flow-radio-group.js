/**
 *
 * Directive for a general purpose radio group for use in the billing and payment flow. All radio
 * groups (even with one button) require the parent payment-flow-radio-group for passing data.
 *
 * @namespace Directives
 * @class paymentFlowTracker
 */
(function(){
  angular
    .module('blueconnect.mobile.directives.paymentFlowRadioGroup', [])
    .directive('paymentFlowRadioGroup', [
      function() {
        return {
          restrict: 'E',
          scope: {
            groupValue: '='
          },
          bindToController: true,
          controller: [
            function() {
              var vm = this;
            }
          ]
        };
      }
    ])
    .directive('paymentFlowRadioButton', [
      function() {
        return {
          restrict: 'E',
          templateUrl: 'partials/payment-flow-radio-button.html',
          controllerAs: 'radioCtrl',
          require: '^^paymentFlowRadioGroup',
          transclude: true,
          scope: {
            label: '@',
            value: '@',
            clickHandler: '&?'
          },
          controller: ['$scope',
            function($scope) {
              var vm = this;
            }
          ],
          link: function($scope, $elem, $attrs, groupCtrl) {
            $scope.getGroupValue = function() {
              return groupCtrl.groupValue;
            };
            $scope.makeSelection = function(incomingValue) {
              groupCtrl.groupValue = incomingValue;
              if ($scope.clickHandler) {
                $scope.clickHandler();
              }
            };
          }
        };
      }
    ]);

})();