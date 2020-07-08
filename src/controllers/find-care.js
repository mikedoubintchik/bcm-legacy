/**
 * Controller for the Find care view.
 *
 * @namespace Controllers
 * @class Find Care
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.findCare', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('FindCareController', [
            '$scope',
            '$rootScope',
            '$location',
            'pageService',
            '$window',
            function($scope, $rootScope, $location, pageService, $window) {
                if ($rootScope.loggedIn) {
                    $rootScope.pageTitle = $rootScope.loc.FIND_CARE;
                    $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
                    $rootScope.showNav = true;
                    $rootScope.showPolicySelect = false;
                  }
                /**
                 * Returns the current environment, if not PROD.
                 *
                 * @memberof findCareDetails
                 * @return {String} The environment name.
                 */
                /**
                 * Retrieves the page HTML from the page service. Called on view load.
                 *
                 * @memberof FindCareController
                 * @method getPage
                 */
                $scope.getPage = function() {
                    /**
                     * The directive HTML for the page.
                     *
                     * @memberof FindCareController
                     * @member {String} pageHtml
                     */
                    $scope.pageHtml = '';

                    $scope.basicNavbarLeftClick = function() {
                        $window.history.back();
                    };

                    var query = {};
                    query.loggedIn = $rootScope.loggedIn;
                    query.deviceType = $rootScope.device;
                    query.policyIndex = ($rootScope.loggedIn) ? $rootScope.policyIndex : null;
                    query.policyEffectiveDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null;
                    query.policyExpirationDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null;
                    query.policyExternalId = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null;

                    var pageName = 'find-care';
                    $rootScope.$emit('pageLoading');
                    pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query).then(function(pageHtml) {
                        $rootScope.$emit('pageLoaded');
                        $scope.pageHtml = pageHtml;
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
