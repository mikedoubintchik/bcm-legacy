(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowBankDetails', [])
    .directive('paymentFlowBankDetails', function() {
      return {
        templateUrl: 'partials/payment-flow-bank-details.html',
        controllerAs: 'bankDetailsCtrl',
        scope: {
          billingInfo: '=',
          userData: '='
        },
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc;
          if(!$scope.userData.accountHolderName &&
            $scope.billingInfo &&
            $scope.billingInfo.userIdentity) {
            $scope.userData.accountHolderName = normalizedName($scope.billingInfo.userIdentity.givenName) + ' ' + normalizedName($scope.billingInfo.userIdentity.familyName);
          }
          $scope.namePattern = /[a-zA-z0-9]/;
          $scope.routingNumberPattern = /^[0-9]{9}$/;
          $scope.accountNumberPattern = /^[0-9]{8,17}$/;

          /**
           * Takes a string and makes all except the first letter lower case
           * @param {string} name
           * @return {string}
           */
          function normalizedName(name) {
            if(!name) {
              return;
            }
            return name.replace(/\B[A-Z]+/, function(ending) { return ending.toLowerCase() })
          }
        }]
      };
    });
})();