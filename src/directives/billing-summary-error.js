(function() {
  angular.module('blueconnect.mobile.directives.billingSummaryError', [])
  .directive('billingSummaryError', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'partials/billing-summary-error.html',
      controller: ['$rootScope', '$scope', function($rootScope, $scope) {
        $scope.loc = $rootScope.loc;
      }]
    };
  });
})();