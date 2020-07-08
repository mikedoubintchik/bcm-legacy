(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowReviewDetails', [])
    .directive('paymentFlowReviewDetails', function() {
      return {
        templateUrl: 'partials/payment-flow-review-details.html',
        controllerAs: 'paymentFlowReviewDetailsCtrl',
        scope: {
          reviewDetails: '='
        },
        controller: ['$rootScope', '$scope', '$filter', 'PaymentFlowFactory', function($rootScope, $scope, $filter, PaymentFlowFactory) {
          $scope.loc = $rootScope.loc;
          $scope.gotoView = $rootScope.gotoView;

          $scope.userData = PaymentFlowFactory.getUserSetData();

          $scope.localizedPaymentFrequency = (
              /autopay/.test(PaymentFlowFactory.getPaymentFrequency()) ?
                  $scope.loc.BP_AUTOPAY :
                  $scope.loc.BP_ONE_TIME_PAYMENT
          );

          $scope.localizedPaymentMethod = (
              PaymentFlowFactory.getPaymentMethod() === 'bankdraft' ?
                  $scope.loc.BP_BANK_DRAFT :
                  $scope.loc.BP_CREDIT_CARD
          );

          var billingMethod = PaymentFlowFactory.getBillingMethod();
          if (billingMethod === 'postal') {
            $scope.localizedBillingMethod = $scope.loc.BP_POSTAL_MAIL;
          }
          if (billingMethod === 'none') {
            $scope.localizedBillingMethod = $scope.loc.BP_DO_NOT_SEND_COPY_OF_BILL;
          }
          if (billingMethod === 'email') {
            $scope.localizedBillingMethod = $scope.loc.EMAIL;
          }

          $scope.localizedAccountType = (
              $scope.userData.accountType === 'Savings' ?
                  $scope.loc.SAVINGS :
                  $scope.loc.BP_CHECKING
          );

          $scope.selectedPaymentAmount = PaymentFlowFactory.getPaymentAmount();

        }]
      };
    })
})();
