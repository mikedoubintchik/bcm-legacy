(function() {
  angular
  .module('blueconnect.mobile.directives.termsConditions', [])
  .directive('paymentFlowTermsConditions', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/payment-flow-terms-conditions.html',
      scope: {
        termsConditions: '='
      },
      controllerAs: 'termsCtrl',
      controller: ['$rootScope', '$scope', function($rootScope, $scope) {
        var vm = this;
        $scope.loc = $rootScope.loc;
        $scope.checkboxValue = false;
        $scope.acceptTermsFn = function() {
          $scope.checkboxValue = true;
        };
      }]
    };
  });
})();
