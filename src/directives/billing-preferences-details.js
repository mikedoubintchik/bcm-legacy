/**
 * Directive for the billingPreferencesDetails in the payment flow.
 *
 * @namespace Directives
 * @class billingPreferencesDetails
 */
(function () {
    'use strict';

    angular.module('blueconnect.mobile.directives.billingPreferencesDetails', [])
        .directive('billingPreferencesDetails', [
            function () {
                return {
                    restrict: 'AE',
                    replace: true,
                    templateUrl: 'partials/billing-preferences-details.html',
                    scope: {
                        /**
                         * Display information for the billingPreferencesDetails.
                         *
                         * @memberof billingPreferencesDetails
                         * @member {Object} billingPreferencesData
                         */
                        billingPreferencesData: '=',
                        policy:'='
                    },
                    controller: [
                        '$routeParams',
                        '$rootScope',
                        '$scope',
                        '$timeout',
                        function ($routeParams, $rootScope, $scope, $timeout) {
                            $scope.loc = $rootScope.loc;
                            $scope.gotoView = $rootScope.gotoView;
                            $scope.preferencesSaveSuccess =  $routeParams.success;
                            $scope.billedAmount = $scope.billingPreferencesData.billedAmount ? $scope.billingPreferencesData.billedAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'}) : '';

                            $scope.getAmountDollars = function() {
                              return $scope.billedAmount.slice(1, $scope.billedAmount.indexOf('.') + 1) || 0;
                            };

                            $scope.getAmountCents = function() {
                              return $scope.billedAmount.slice($scope.billedAmount.indexOf('.') + 1);
                            };

                            if (
                              $scope.billingPreferencesData.payment.creditCardDetails &&
                              $scope.billingPreferencesData.payment.creditCardDetails.expiration
                            ) {
                              $timeout(function() {
                                $scope.billingPreferencesData.payment.creditCardDetails.expirationShortened = $scope.billingPreferencesData.payment.creditCardDetails.expiration
                                  .split('/')
                                  .map(function(str, index) {
                                    return index === 0 ? str : str.slice(2);
                                  })
                                  .join('/');
                              }, 0)
                            }
                        }
                    ]
                };
            }
        ])
        .directive('billingPreferencesSaveToast', function() {
            return {
                resrict: 'E',
                template: '<div class="content flex-row flex-center-center"><i class="fc-check dark-green mr2"></i><p class="mb0 dark-green" ng-bind="::loc.BP_BILLING_PREFERENCES_SAVED"></p></div>',
                controller: ['$rootScope', '$scope', '$timeout', function($rootScope, $scope, $timeout) {
                    $scope.loc = $rootScope.loc;
                    $scope.timeout = $timeout;
                }],
                link: function(scope, elem, attr, ctrl) {
                    scope.timeout(function() {
                        elem.addClass('hidden');
                    }, 2000)
                }
            };
        });
}());
