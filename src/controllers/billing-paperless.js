/**
 * Controller for the about view.
 *
 * @namespace Controllers
 * @class AboutController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.billingpaperless', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('BillingPaperlessController', [
        '$scope',
        '$rootScope',
        '$location',
        '$timeout',
        '$window',
        'pageService',
        'adobeService',
        function($scope, $rootScope, $location, $timeout, $window, pageService, adobeService) {
        $rootScope.showNav = true;
        $rootScope.showPolicySelect = false;

        /**
         * Retrieves the page HTML from the page service. Called on view load.
         *
         * @memberof HelpController
         * @method getPage
         */
        $scope.getPage = function() {
            /**
            * The directive HTML for the page.
            *
            * @memberof HelpController
            * @member {String} pageHtml
            */
           
            $scope.pageHtml = '';
            
            var pageName      = 'billing-paperless';
            $rootScope.pageTitle = $rootScope.loc.BP_SETUP_PAPERLESS_BILLING;
            $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;

            var query         = $location.search();
           
            $rootScope.$emit('pageLoading');
            pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language).then(function(pageHtml) {
            $rootScope.$emit('pageLoaded');
            $scope.pageHtml = pageHtml;
            }, function(error, status) {
            $rootScope.$emit('pageLoaded');
            $rootScope.showNetworkErrorAlert();
            });
        };

        $rootScope.verifyLocaleRetrieved();
        $scope.getPage();
        }
    ]);
}());
