/**
 * Directive for the payment flow billing method.
 *
 * @namespace Directives
 * @class paymentFlowBillingMethod
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.paymentFlowBillingMethod', [])
    .directive('addressValidation', [
      'config',
      '$http',
      '$q',
      function(config, $http, $q) {
        return {
          restrict: 'A',
          require: '^form',
          link: function($scope, $elem, $attrs, $ctrl) {
            var paymentInputCtrl = $ctrl[$attrs.formLabel];
            // set lastAddress to null to track once directive is rendered
            var lastAddress = null;

            $scope.$parent.$watch('userData.preferences.mailingAddress', function() {
              // re-validate this field if the mailing address changes
              paymentInputCtrl.$validate();
            }, true);
            paymentInputCtrl.$asyncValidators.cityStateZipMatch = function(oldValue, newValue) {
              // if the value isn't changing, don't launch the async function
              // we do check if the value is null for the first time the address is rendered
              // in this way, we always check the address at least once if it exists already
              if (angular.equals(lastAddress, $scope.$parent.userData.preferences.mailingAddress) && lastAddress !== null) {
                return $q.resolve();
              }

              // if the value is different than what we last checked, let's validate
              return $q(function(resolve, reject) {
                lastAddress = angular.copy($scope.$parent.userData.preferences.mailingAddress);
                paymentInputCtrl.$setDirty();
                $http.post(
                  config.apiUrl + '/address',
                  {
                    postalCode: paymentInputCtrl.$viewValue,
                    stateCode: $scope.$parent.userData.preferences.mailingAddress.stateCode,
                    cityName: $scope.$parent.userData.preferences.mailingAddress.cityName,
                  }
                )
                .then(function(response) {
                  if (response.data.addressError === true) {
                    reject();
                    // timing issue in AngularJS is causing us to have to set this
                    // programmatically instead of it being handled by $asyncValidators
                    if (paymentInputCtrl.$valid) {
                      paymentInputCtrl.$setValidity('cityStateZipMatch', false);
                    }
                  } else {
                    return resolve();
                  }

                })
                .catch(function(error) {
                  reject();
                });
              });
            }
          }
        }
      }
    ])
    .directive('paymentFlowBillingMethod', [
      function() {
        return {
          scope: {
            /**
             * @param {Object} userData
             * @param {Object} userData.preferences
             */
            balanceInfo: '=',
            userData: '='
          },
          restrict: 'E',
          templateUrl: 'partials/payment-flow-billing-method.html',
          controller: ['$rootScope', '$scope', 'PaymentFlowFactory', function($rootScope, $scope, PaymentFlowFactory) {
            $scope.loc = $rootScope.loc;
            $scope.strictEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            // $scope.userData = PaymentFlowFactory.getUserSetData();
            $scope.paymentFlow = PaymentFlowFactory.getPaymentFlow();

            var billingMethodSelected = PaymentFlowFactory.getBillingMethod();
            if (billingMethodSelected) {
              $scope.billingMethodSelected = billingMethodSelected;
            }
            if($scope.paymentFlow === 'otp') {
              $scope.billingMethodSelected = 'email';
            }

            if(
              (!$scope.userData.preferences ||
              !$scope.userData.preferences.emailAddress) &&
              $scope.balanceInfo.preferences &&
              $scope.balanceInfo.preferences.emailAddress
            ) {
              $scope.userData.preferences.emailAddress = $scope.balanceInfo.preferences.emailAddress;
            }

            if (
                (!$scope.userData.preferences ||
                !$scope.userData.preferences.mailingAddress.addressLine1) &&
                $scope.balanceInfo.preferences &&
                $scope.balanceInfo.preferences.mailingAddress &&
                Object.keys($scope.balanceInfo.preferences.mailingAddress).length
              ) {
                $scope.userData.preferences.mailingAddress = $scope.balanceInfo.preferences.mailingAddress;
              }

            var paymentFlowSelected = PaymentFlowFactory.getPaymentFlow();
            if (paymentFlowSelected === 'otp' &&
                $scope.preferences &&
                $scope.balanceInfo.preferences.isPaperless === false
              ) {
                $scope.billingMethodSelected = 'email';
              }
          }]
        };
      }
    ])
    .directive('paymentFlowBillingMethodMedicare', [
      function() {
        return {
          scope: {
            /**
             * @param {Object} userData
             * @param {Object} userData.preferences
             */
            balanceInfo: '=',
            userData: '='
          },
          restrict: 'E',
          templateUrl: 'partials/payment-flow-billing-method-medicare.html',
          controller: ['$rootScope', '$scope', 'PaymentFlowFactory', function($rootScope, $scope, PaymentFlowFactory) {
            var vm = this;
            $scope.loc = $rootScope.loc;
            $scope.strictEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            // $scope.userData = PaymentFlowFactory.getUserSetData();
            $scope.paymentFlow = PaymentFlowFactory.getPaymentFlow();

            var billingMethodSelected = PaymentFlowFactory.getBillingMethod();
            if (billingMethodSelected) {
              $scope.billingMethodSelected = billingMethodSelected;
            }
            if ($scope.paymentFlow === 'otp') {
              $scope.billingMethodSelected = 'postal';
            }

            if (
              (!$scope.userData.preferences ||
              !$scope.userData.preferences.emailAddress) &&
              $scope.balanceInfo.preferences &&
              $scope.balanceInfo.preferences.emailAddress
            ) {
              $scope.userData.preferences.emailAddress = $scope.balanceInfo.preferences.emailAddress;
            }

            if (
                (!$scope.userData.preferences ||
                !$scope.userData.preferences.mailingAddress.addressLine1) &&
                $scope.balanceInfo.preferences &&
                $scope.balanceInfo.preferences.mailingAddress &&
                Object.keys($scope.balanceInfo.preferences.mailingAddress).length
              ) {
                $scope.userData.preferences.mailingAddress = $scope.balanceInfo.preferences.mailingAddress;
              }

            var paymentFlowSelected = PaymentFlowFactory.getPaymentFlow();
            if (paymentFlowSelected === 'otp' &&
                $scope.preferences &&
                $scope.balanceInfo.preferences.isPaperless === false
              ) {
                $scope.billingMethodSelected = 'email';
              }
          }]
        };
      }
    ]);
}());