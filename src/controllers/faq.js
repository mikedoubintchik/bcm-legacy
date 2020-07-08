/**
 * Controller for the faq view.
 *
 * @namespace Controllers
 * @class FAQController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.faq', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('FAQController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    '$window',
    'pageService',
    'adobeService',
    'analyticConstants',
    function($scope, $rootScope, $location, $timeout, $window, pageService, adobeService, analyticConstants) {
      $rootScope.showNav = false;
      $rootScope.showPolicySelect = false;
      $scope.alertModal = $rootScope.alertModal;

      var languageAttempts = 0;

      /**
       *Display the alert window for external link to open the url in browser
       **/
      $scope.openInBrowser = $rootScope.openInBrowser;

      /**
       * Retrieves the page HTML from the page service. Called on view load.
       *
       * @memberof FAQController
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
         var query = {};

         if ($rootScope.loggedIn) {
           query.policyIndex = ($rootScope.loggedIn) ? $rootScope.policyIndex : null;
           query.policyEffectiveDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null;
           query.policyExpirationDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null;
           query.policyExternalId = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null;
         }
         query.loggedIn = $rootScope.loggedIn;
         query.deviceType = $rootScope.device;


        var pageName = 'faq';
        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query).then(function(pageHtml) {
          $rootScope.$emit('pageLoaded');
          $scope.pageHtml = pageHtml;
          adobeService.trackState(pageName, analyticConstants.FAQ_SECTION);
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
