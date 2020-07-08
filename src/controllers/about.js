/**
 * Controller for the about view.
 *
 * @namespace Controllers
 * @class AboutController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.about', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('AboutController', [
            '$scope',
            '$rootScope',
            '$timeout',
            '$window',
            'config',
            'adobeService',
            'pageService',
            'analyticConstants',
            function($scope, $rootScope, $timeout, $window, config, adobeService, pageService, analyticConstants) {
                $rootScope.showNav = false;
                $rootScope.showPolicySelect = false;
                $scope.alertModal = $rootScope.alertModal;

                /**
                 *Display the alert window for external link to open the url in browser
                 **/
                $scope.openInBrowser = $rootScope.openInBrowser;
                /**
                 * Toggles the expansion of an accordion item.
                 *
                 * @memberof aboutDetails
                 * @method toggleItem
                 */
                $scope.toggleItem = function(item, id) {
                    for (var i = 0; i < $scope.aboutDetails.content.length; i++) {
                        if (i != id) {
                            $scope.aboutDetails.content[i].expandedDiv = false;
                        }
                    }
                    item.expandedDiv = !item.expandedDiv;
                };

                /**
                 * Opens the default mail application
                 */
                $scope.openMail = $rootScope.openMail;

                /**
                 * Returns the current environment, if not PROD.
                 *
                 * @memberof aboutDetails
                 * @method getEnvironment
                 * @return {String} The environment name.
                 */
                $scope.getEnvironment = function() {
                  if (config.env === 'PROD') {
                    return '';
                  }

                  return config.env;
                };

                var languageAttempts = 0;

                /**
                 * Retrieves the page HTML from the page service. Called on view load.
                 *
                 * @memberof AboutController
                 * @method getPage
                 */
                $scope.getPage = function() {
                    /**
                     * The directive HTML for the page.
                     *
                     * @memberof AboutController
                     * @member {String} pageHtml
                     */
                    $scope.pageHtml = '';

                    /**
                     * For basicNavbar, we have to pass this function
                     * to handle the left click
                     */
                    $scope.basicNavbarLeftClick = function() {
                        $rootScope.fromBackButton = true;
                        $rootScope.detailsFromBackButton = true;
                        $window.history.back();
                    };

                    if (!$rootScope.loc) {
                        languageAttempts++;
                        if (languageAttempts > 5) {
                            $rootScope.$emit('pageLoaded');
                            $rootScope.showNetworkErrorAlert();
                            return;
                        }

                        $timeout($scope.getPage, 100);
                        return;
                    }

                    var pageName = 'about';
                    $rootScope.$emit('pageLoading');
                    pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, {loggedIn : $rootScope.loggedIn}).then(function(pageHtml) {
                        $rootScope.$emit('pageLoaded');
                        $scope.pageHtml = pageHtml;
                        adobeService.trackState(pageName, analyticConstants.HELP_SECTION);
                    }, function() {
                        $rootScope.$emit('pageLoaded');
                        if ($rootScope.loggedIn) {
                          $rootScope.showNetworkErrorAlert();
                        } else {
                          $rootScope.showNetworkErrorUnautenticated();
                        }
                    });
                };

                $rootScope.verifyLocaleRetrieved();
                $scope.getPage();
            }
        ]);
}());
