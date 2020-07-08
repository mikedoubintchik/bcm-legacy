/**
 * Controller for the Find A Doctor view.
 *
 * @namespace Controllers
 * @class Find A Doctor
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.findDoctor', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('FindDoctorController', [
            '$scope',
            '$rootScope',
            '$location',
            'pageService',
            function($scope, $rootScope, $location, pageService) {
                /**
                 * Returns the current environment, if not PROD.
                 *
                 * @memberof findDoctorDetails
                 * @return {String} The environment name.
                 */
                /**
                 * Retrieves the page HTML from the page service. Called on view load.
                 *
                 * @memberof FindDoctorController
                 * @method getPage
                 */
                $scope.getPage = function() {
                    /**
                     * The directive HTML for the page.
                     *
                     * @memberof FindDoctorController
                     * @member {String} pageHtml
                     */
                    $scope.pageHtml = '';
                    var query = {};
                    query.loggedIn = $rootScope.loggedIn;
                    query.deviceType = $rootScope.device;
                    query.policyIndex = ($rootScope.loggedIn) ? $rootScope.policyIndex : null;
                    query.policyEffectiveDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null;
                    query.policyExpirationDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null;
                    query.policyExternalId = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null;


                    var pageName = 'find-doctor';
                    $rootScope.$emit('pageLoading');
                    pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, {loggedIn : $rootScope.loggedIn, deviceType : $rootScope.device}).then(function(pageHtml) {
                        $rootScope.$emit('pageLoaded');
                        $scope.pageHtml = pageHtml;
                        $rootScope.healthNavTrackStates(0, {title:'select network'});
                    }, function(error, status) {
                        $rootScope.$emit('pageLoaded');
                        if ($rootScope.loggedIn) {
                          $rootScope.showNetworkErrorAlert();
                        } else {
                          $rootScope.showNetworkErrorUnautenticated();
                        }
                    });
                };
                $rootScope.$emit('pageNeedsLocale');
                $scope.getPage();

            }
        ]);
}());
