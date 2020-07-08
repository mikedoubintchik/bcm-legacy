/**
 * Controller for the about view.
 *
 * @namespace Controllers
 * @class AboutController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.billinghistory', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('BillingHistoryController', [
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
            
            var pageName      = 'billing-history';
        
            $rootScope.pageTitle = $rootScope.loc.BP_VIEW_BILLING_HISTORY;
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
