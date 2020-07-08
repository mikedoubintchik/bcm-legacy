/**
 * Directive for the billingPreferencesUpdate in the payment flow.
 *
 * @namespace Directives
 * @class billingPreferencesUpdate
 */
(function () {
    'use strict';

    angular.module('blueconnect.mobile.directives.stopAutopay', [])
        .directive('stopAutopay', [
            function () {
                return {
                    restrict: 'AE',
                    replace: true,
                    templateUrl: 'partials/stop-autopay.html',
                    scope: {
                        /**
                         * Display information for the billingPreferencesUpdate.
                         *
                         * @memberof billingPreferencesUpdate
                         * @member {Object} billingPreferencesUpdateData
                         */
                        stopAutopayData: '=',
                        policy: '=',
                        billingToken: '<token'
                    },
                    controller: [
                        'config',
                        '$http',
                        '$rootScope',
                        '$scope',
                        function (config, $http, $rootScope, $scope) {
                            $scope.loc = $rootScope.loc;
                            $scope.gotoView = $rootScope.gotoView;
                            $scope.stopAutopayError = false;
                            $scope.strictEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                            // Defaults to EMAIL to encourage email as a selection
                            $scope.billingMethodSelected = 'EMAIL';

                            // Building object to work with existing template
                            $scope.userData = {
                                preferences: $scope.stopAutopayData
                            };
                            $scope.checkboxValue = false;

                            $scope.acceptPaperlessFn = function () {
                                $scope.checkboxValue = true;
                            };

                            $scope.stopAutopay = function(formObj) {
                                if(formObj.memberEmail) {
                                    formObj.memberEmail.$setDirty();
                                }
                                if(formObj.paperlessAgreement) {
                                    formObj.paperlessAgreement.$setDirty();
                                }
                                if($scope.billingMethodSelected === 'POSTAL') {
                                    formObj.streetAddress.$setDirty();
                                    formObj.city.$setDirty();
                                    formObj.state.$setDirty();
                                    formObj.zipcode.$setDirty();
                                }
                                if(formObj.$invalid) {
                                    return;
                                }

                                // TODO this needs to be removed when services are updated Dec 28th, 2017
                                if($scope.userData.preferences.payment.bankDraftDetails) {
                                    $scope.userData.preferences.payment.bankDraftDetails.bankName = "BANK OF AMERICA";
                                }
                                $rootScope.$emit('pageLoading');
                                $http.post(config.apiUrl + '/setBillingPreferences', {
                                    account: {
                                        token: $scope.billingToken
                                      },
                                      preferences: {
                                        mailingAddress: $scope.userData.preferences.mailingAddress,
                                        emailAddress: $scope.userData.preferences.emailAddress,
                                        payment: $scope.userData.preferences.payment,
                                        updatedPreferences: {
                                          paymentMethod: $scope.userData.preferences.paymentMethod,
                                          billingMethod: ($scope.stopAutopayForm.billingMethodSelected && $scope.stopAutopayForm.billingMethodSelected.$modelValue) || $scope.stopAutopayData.billingMethod,
                                          paymentFrequency: 'DIRECTBILL'
                                        },
                                        priorBillingNotifPrefCode: $scope.userData.preferences.priorBillingNotifPrefCode
                                      },
                                      TIPData: $rootScope.getTIPData($scope.userData.preferences.paymentMethod.toLowerCase() === 'creditcard' ? 'TurnOffRcrCreditCard' : 'TurnOffRcrBankDraft', '/setBillingPreferences')
                                }).then(function() {
                                    $rootScope.$emit('pageLoaded');
                                    $rootScope.gotoView('/billing-preferences?success=true');
                                })
                                .catch(function() {
                                    $rootScope.$emit('pageLoaded');
                                    $scope.stopAutopayError = true;
                                });
                            };
                        }
                    ]
                };
            }
        ]);
}());
