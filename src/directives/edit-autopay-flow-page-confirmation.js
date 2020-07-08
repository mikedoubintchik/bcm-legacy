(function() {
  angular
    .module('blueconnect.mobile.directive.editAutopayFlowPageConfirmation', [])
    .directive('editAutopayFlowPageConfirmation', function() {
      return {
        scope: {
          serviceResponse: '<'
        },
        templateUrl: 'partials/edit-autopay-flow-page-confirmation.html',
        controller: ['PaymentFlowFactory', '$rootScope', '$scope', function(PaymentFlowFactory, $rootScope, $scope) {
          $scope.loc = $rootScope.loc;
          $scope.gotoView = $rootScope.gotoView;
          $scope.userSetData = PaymentFlowFactory.getUserSetData();

          $scope.localizedPaymentMethod = (
              PaymentFlowFactory.getPaymentMethod() === 'bankdraft' ?
                  $scope.loc.BP_BANK_DRAFT :
                  $scope.loc.BP_CREDIT_CARD
          );

          $scope.returnToAccountSummary = function() {
            PaymentFlowFactory.reset();
            $rootScope.gotoView('/billing');
          };

          $scope.trackerInfo = {
            step: 'CONFIRMATION'
          };
        }]
      }
    });
})();