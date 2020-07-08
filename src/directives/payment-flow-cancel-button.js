(function() {
  angular.module('blueconnect.mobile.directives.paymentFlowCancelButton', [])
    .directive('paymentFlowCancelButton', function() {
      return {
        template: [
        '<cta-button-row>',
          '<cta-button ng-click="openModal()" class="white"><span ng-bind="::loc.CANCEL"></span></cta-button>',
        '</cta-button-row>',
        '<extendable-alert-modal open-modal-fn-alias="openModal" confirm-fn="goToBillingSummary"  ng-class="{show: showModal}" modal-info="cancelModalObj"></extendable-alert-modal>'
        ].join(''),
        controller: ['$rootScope', '$scope', 'PaymentFlowFactory',function($rootScope, $scope, PaymentFlowFactory) {
          $scope.loc = $rootScope.loc;
          $scope.goToBillingSummary = function() {
            PaymentFlowFactory.reset();
            $rootScope.gotoView('/billing');
          };

          $scope.cancelModalObj = {
            title: $scope.loc.BP_HEADER_ARE_YOU_SURE,
            body: $scope.loc.BP_ARE_YOU_SURE,
            cancelButton: {
              title: $scope.loc.BP_CONTINUE_TO_MAKE_PAYMENT
            },
            confirmButton: {
              color: 'red',
              title: $scope.loc.BP_CANCEL_PAYMENT
            }
          };
        }]
      };
    })
    .directive('editCreditDetailsButton', function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/edit-credit-details-button.html',
        scope: {
          paymentMethod: '<',
          cancelRoute: '@',
          buttonTitle: '<'
        },
        controller: ['$rootScope', '$scope', 'PaymentFlowFactory', function($rootScope, $scope, PaymentFlowFactory) {
          $scope.loc = $rootScope.loc;
          $scope.gotoView = $rootScope.gotoView;
          $scope.goToBillingSummary = function() {
            PaymentFlowFactory.resetCreditCardDetails();
            $rootScope.gotoView($scope.cancelRoute);
          };

          $scope.cancelModalObj = {
            title: $scope.loc.BP_HEADER_ARE_YOU_SURE,
            body: $scope.loc.BP_EDIT_PAYMENT_REENTER_DETAILS,
            cancelButton: {
              title: $scope.loc.BP_CONTINUE_TO_MAKE_PAYMENT
            },
            confirmButton: {
              color: 'blue',
              title: $scope.loc.BP_EDIT_PAYMENT_INFO
            }
          };
        }]
      };
    });
})();