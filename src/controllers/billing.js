/**
 * Controller for the billing & payments page view.
 *
 * @namespace Controllers
 * @class BillingController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.billing', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('BillingController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    '$window',
    'pageService',
    'adobeService',
    function($scope, $rootScope, $location, $timeout, $window, pageService, adobeService) {
      $rootScope.showNav = true;
      $scope.loc = $rootScope.loc;
      $scope.showNav = $rootScope.showNav;
      $rootScope.showPolicySelect = true;
      var languageAttempts = 0;

      /**
       * Retrieves the page HTML from the page service. Called on view load.
       *
       * @memberof BillingController
       * @method getPage
       */
      $scope.getPage = function() {
        /**
        * The directive HTML for the page.
        *
        * @memberof BillingController
        * @member {String} pageHtml
        */
        $scope.pageHtml = '';

        if(!$rootScope.loc) {
          languageAttempts++;
          if(languageAttempts > 5) {
            $rootScope.$emit('pageLoaded');
            $rootScope.showNetworkErrorAlert();
            return;
          }

          $timeout($scope.getPage, 100);
          return;
        }

        var pageName = 'billing';
        $rootScope.pageTitle = $rootScope.loc.BILLING_PAYMENTS;
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;

          var query = $location.search();
          query.policyIndex = $rootScope.policyIndex;
          query.policyEffectiveDate = $rootScope.selectedPolicy.effectiveDate;
          query.policyExpirationDate = $rootScope.selectedPolicy.expirationDate;
          query.policyExternalId = $rootScope.selectedPolicy.externalId;


        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query).then(function(pageHtml) {
          $rootScope.$emit('pageLoaded');
          $scope.pageHtml = pageHtml;
        }, function(error, status) {
          $rootScope.$emit('pageLoaded');
          $rootScope.showNetworkErrorAlert();
        });
      };

      var billingUnregisterFunc = $rootScope.$on('policySelected', function() {
          $scope.getPage();
      });

      $rootScope.$on('LOGOUT', billingUnregisterFunc);

      $rootScope.verifyLocaleRetrieved();
      $scope.getPage();
    }
  ]);
}());
