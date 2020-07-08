(function() {
  angular
    .module('blueconnect.mobile.directives.paymentUnsuccessful', [])
    .directive('unsuccessfulHeader', function() {
      return {
        scope: {
          headerContent: '<?'
        },
        template: [
          '<h3 class="flex-row flex-center-center">',
            '<div class="icon-halo mr2">',
              '<i class="fa fa-2x fc-warning" aria-hidden="true"></i>',
            '</div>',
            '<span class="text-center pt2" ng-bind="::headerContent || loc.BP_UNSUCCESSFUL"></span>',
          '</h3>'
        ].join(''),
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc;
        }],
        restrict: 'E'
      };
    })
    .directive('paymentUnsuccessful', function() {
      return {
        templateUrl: 'partials/payment-unsuccessful.html',
        scope: {
          paymentAmount: '<',
          paymentDate: '<'
        },
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc;
          $scope.moment = moment;
        }]
      };
    });
})();