(function() {
  angular
  .module('blueconnect.mobile.directives.paperlessAgreement', [])
  .directive('paymentFlowPaperlessAgreement', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/payment-flow-paperless-agreement.html',
      scope: {
        billingInfo: '=',
        required: '=?'
      },
      controllerAs: 'paperlessCtrl',
      controller: ['$rootScope', '$scope', '$timeout', function($rootScope, $scope, $timeout) {
        var vm = this;
        $scope.loc = $rootScope.loc;
        $scope.checkboxValue = false;
        $scope.acceptPaperlessFn = function() {
          $scope.checkboxValue = true;
        };
        // queue this for later, sometimes billingMethodForm isn't there at time of evaluation
        $timeout(function() {
          if ($scope.$parent.paymentFlowBillingMethodForm && $scope.$parent.paymentFlowPageMethodForm.paymentFlowBillingMethodForm) {
            $scope.billingMethodSelected = $scope.$parent.paymentFlowPageMethodForm.paymentFlowBillingMethodForm.billingMethodSelected;
          }
        }, 0);
      }]
    };
  });
})();
