/**
 * Controller for the Upgrade page view.
 *
 * @namespace Controllers
 * @class UpgradeController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.upgrade', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('UpgradeController', [
            '$rootScope',
            '$scope',
            function($rootScope, $scope) {
                $rootScope.showNav = false;
                $rootScope.showPolicySelect = false;

                $rootScope.verifyLocaleRetrieved();

                /**
                 * Pass through method to external links for app upgrade
                 *
                 * @memberof UpgradeController
                 * @method gotoStore
                 */
                $scope.gotoStore = function(device) {
                    if (device === 'iOS') {
                        return $rootScope.openInBrowser('https://itunes.apple.com/us/app/healthnav/id392607223?mt=8');
                    } else {
                        return $rootScope.openInBrowser('https://play.google.com/store/apps/details?id=com.bcbsnc.healthnav','_system');
                    }
                };
            }
        ]);
}());
