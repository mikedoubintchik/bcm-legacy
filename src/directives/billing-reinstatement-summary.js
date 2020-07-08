(function() {
  angular
    .module('blueconnect.mobile.directives.reinstatementSummary', [])
    .directive('reinstatementSummary', function() {
      return {
        templateUrl: 'partials/billing-reinstatement-summary.html',
        scope: {
          reinstatementEligible: '<',
          reinstatementAmount: '<',
          onHomePage: '<',
          isPolicyTerminated: '<',
        },
        controller: [
          '$rootScope',
          '$scope',
          function($rootScope, $scope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
          },
        ],
      };
    })
    .directive('reinstatementAmount', function() {
      return {
        restrict: 'E',
        template: [
          '<h4 ng-bind="::loc.BP_TOTAL_REINSTATEMENT_AMOUNT"></h4>',
          '<h4 class="amount" ng-bind="::reinstatementAmount | currency"></h4>',
        ].join(''),
        scope: {
          reinstatementAmount: '<',
          reinstatementEligible: '<',
        },
        controller: [
          '$rootScope',
          '$scope',
          function($rootScope, $scope) {
            $scope.loc = $rootScope.loc;
          },
        ],
      };
    });
})();
