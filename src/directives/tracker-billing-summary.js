/**
 * Directive for the trackerBillingSummary in the payment flow.
 *
 * @namespace Directives
 * @class trackerBillingSummary
 */
(function () {
    'use strict';

    angular.module('blueconnect.mobile.directives.trackerBillingSummary', [])
        .directive('trackerBillingSummary', [
            function () {
                return {
                    restrict: 'AE',
                    replace: true,
                    templateUrl: 'partials/tracker-billing-summary.html',
                    scope: {
                        /**
                         * Display information for the trackerBillingSummary in the payment flow.
                         *
                         * @memberof trackerBillingSummary
                         * @member {Object} trackerBillingData
                         */
                        trackerBillingData: '='
                    },
                    controller: [
                        '$rootScope',
                        '$scope',
                        function ($rootScope, $scope) {
                            $scope.loc = $rootScope.loc;
                            $scope.gotoView = $rootScope.gotoView;

                          $scope.padAmt = function(amt) {
                            var amountDue = amt.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'});
                            return amountDue;
                          }

                            /**
                             * Toggle
                             *
                             */

                            $scope.toggleItem = function () {
                                if ($scope.expandedDiv) {
                                    $scope.expandedDiv = true;
                                }
                                $scope.expandedDiv = !$scope.expandedDiv;
                            };

                        }
                    ]
                };
            }
        ]);
}());
