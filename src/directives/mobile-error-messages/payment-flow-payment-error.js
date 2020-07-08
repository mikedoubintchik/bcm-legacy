(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowPaymentError', [])
    .directive('detailsPagePaymentError', function() {
      return {
        restrict: 'E',
        template: '<p><span ng-bind="::loc.BP_PAYMENT_DETAILS_NOT_ACCEPTED"></span></p>',
        controller: ['$rootScope', '$scope', function($rootScope, $scope){
          $scope.loc = $rootScope.loc;
        }]
      };
    })
    .directive('reviewPagePaymentError', function() {
      return {
        restrict: 'E',
        template: [
          '<unsuccessful-header class="mb4"></unsuccessful-header>',
          '<p ng-bind="::loc.BP_TECHNICAL_DIFFICULTIES"></p>',
          '<p ng-bind="::loc.BP_TECHNICAL_DIFFICULTIES_LINE2"></p>'
        ].join(''),
        controller: ['$rootScope', '$scope', function($rootScope, $scope){
          $scope.loc = $rootScope.loc;
        }]
      };
    })
    .directive('confirmationPagePaymentError', function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/confirmation-page-payment-error.html',
        controller: [ '$rootScope', '$scope', 'PaymentFlowFactory', function($rootScope, $scope, PaymentFlowFactory){
          $scope.loc = $rootScope.loc;
          $scope.paymentAmount = PaymentFlowFactory.getUserSetData().paymentAmount;
          $scope.paymentDate = moment().format('MMMM Do YYYY');
          $scope.gotoView = $rootScope.gotoView;
        }]
      };
    })
    .directive('mobileErrorMessage', function() {
      return {
        restrict: 'E',
        transclude: true,
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc;
        }],
        template: '<div ng-transclude></div>'
      };
    });
})();