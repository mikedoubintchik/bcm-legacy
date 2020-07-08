(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowCreditCardDetails', [])
    .directive('mobileCreditCards', function() {
      return {
        restrict: 'E',
        template: [
          '<div class="card-logos">',
            '<img src="images/visa-logo.svg" alt="">',
            '<img src="images/mastercard-logo.svg" alt="">',
            '<img src="images/discover-logo.svg" alt="">',
            '<img src="images/amex-logo.svg" alt="">',
          '</div>'
        ].join('')
      };
    })
    .directive('paymentFlowCreditCardDetails', function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/payment-flow-credit-card-details.html',
        scope: {
          billingInfo: '=',
          userData: '='
        },
        controller: ['$rootScope', '$scope', '$timeout', 'PaymentFlowFactory', function($rootScope, $scope, $timeout, PaymentFlowFactory) {
          $scope.loc = $rootScope.loc;
          $scope.language = $rootScope.language;
          $scope.moment = moment;

          $scope.scanCreditCard = function() {
            CardIO.scan({
              requireExpiry: true,
              scanExpiry: false,
              requirePostalCode: false,
              hideCardIOLogo: true,
              suppressScan: false,
              keepApplicationTheme: true
            }, onScanComplete, angular.noop);
            function onScanComplete(cardInfoObj) {
              $timeout(function() {
                // this happens outside of angular, so we need to use an angular construct
                // to let angular know to update the view
                var expiryMonth = cardInfoObj.expiryMonth.toString();
                if (expiryMonth.length === 1) {
                  expiryMonth = '0' + expiryMonth;
                }
                $scope.userData.creditCardDetails = {
                  firstName: cardInfoObj.cardholderName,
                  lastFour: cardInfoObj.cardNumber,
                  year: cardInfoObj.expiryYear.toString().slice(2) - 0,
                  month: expiryMonth,
                  cvn: cardInfoObj.cvv
                };
              }, 0);
            }

          };
          /*
          * @namespace Regular Expressions
          * @name cardRegex
          * @author Seth Rhodes <seth.rhodes@bcbsnc.com>
          *
          * @description
          * Use this to validate the cards which we accept. MasterCard, VISA, and Discover
          * are accepted. Length validation is handled here for 16-digit cards and 19-digit VISA
          * cards. Please refer to BCB-508 for validation rules used at the time of creation.
          */
          var cardRegex = /^(4((.{12}?)|(.{15}?)|(.{18}?)|(.{19}?))|6(011(0[0-9]|[2-4]|7(4|[7-9])(.{10})|8[6-9]|9)((\d{10})|(\d{11})?)|(4[4-9](\d{13})|5(\d{14})))|5[1-5](\d{14})|3[47][0-9]{13}|222[1-9](\d{12})|2720(\d{12}))$/
          $scope.cardRegex = cardRegex;

          var currentDate = new Date();
          var currentMonth = currentDate.getMonth() + 1;
          var currentYear = currentDate.getFullYear();
          var currentYearShort = currentYear.toString().slice(2);

          $scope.validateExpirationDate = function(month, year) {
            if (month === currentMonth && year === currentYearShort) {
              $scope.userData.creditCardDetails.month = null;
            }
            if (year === currentYearShort && month < currentMonth) {
              $scope.userData.creditCardDetails.month = null;
            }
          };

          var numberOfAvailableYears = 20;
          $scope.yearsArr = [];
          for (var i = 0; i < numberOfAvailableYears; i++) {
            var yearValue = (currentYear + i).toString();
            $scope.yearsArr.push({
              value: yearValue.slice(2),
              label: yearValue
            });
          }

          $scope.$watch('userData.creditCardDetails.year', function(n) {
            $scope
              .validateExpirationDate(
                $scope.userData.creditCardDetails.month,
                $scope.userData.creditCardDetails.year
              )
          });

          var numberOfAvailableMonths = 12;
          $scope.monthArr = [];
          for (var i = 0; i < numberOfAvailableMonths; i++) {
            var monthValue = (currentMonth + i).toString();
            $scope.monthArr.push({
              value: monthValue.slice(2),
              label: monthValue
            });
          }
          $scope.$watch('userData.creditCardDetails.month', function(n) {
            $scope
              .validateExpirationDate(
                $scope.userData.creditCardDetails.month,
                $scope.userData.creditCardDetails.year
              );
          });
        }]
      };
    });
})();
