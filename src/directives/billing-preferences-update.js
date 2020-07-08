/**
 * Directive for the billingPreferencesUpdate in the payment flow.
 *
 * @namespace Directives
 * @class billingPreferencesUpdate
 */
(function () {
    'use strict';

    angular.module('blueconnect.mobile.directives.billingPreferencesUpdate', [])
        .directive('billingPreferencesUpdate', [
            function () {
                return {
                    restrict: 'AE',
                    replace: true,
                    templateUrl: 'partials/billing-preferences-update.html',
                    scope: {
                        /**
                         * Display information for the billingPreferencesUpdate.
                         *
                         * @memberof billingPreferencesUpdate
                         * @member {Object} billingPreferencesUpdateData
                         */
                        billingPreferencesUpdateData: '=',
                        policy: '='
                    },
                    controller: [
                        '$rootScope',
                        '$scope',
                        function ($rootScope, $scope) {
                            $scope.loc = $rootScope.loc;
                            $scope.gotoView = $rootScope.gotoView;
                        }
                    ]
                };
            }
        ]);
}());
