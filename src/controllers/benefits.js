/**
* Controller for the benefits page view.
*
* @namespace Controllers
* @class BenefitsController
*/
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.benefits', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('BenefitsController', [
    '$scope',
    '$rootScope',
    '$location',
    'coachmarkService',
    'pageService',
    'adobeService',
    'analyticConstants',
    function($scope, $rootScope, $location, coachmarkService, pageService, adobeService, analyticConstants) {
      $rootScope.showNav = true;
      $rootScope.showPolicySelect = true;
      $rootScope.pageTitle = $rootScope.loc.BENEFITS;
      $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;

      $scope.getPage = function() {
        $scope.pageHtml = '';
        var pageName = 'benefits-main';
        var cachePage = true;

        /**
        * The directive HTML for the page.
        *
        * @memberof BenefitsController
        * @member {String} pageHtml
        */
        $scope.pageHtml = '';
        var query = $location.search();
        query.benefitPage = '';

        // check current page url
        var currentUrl = $location.url();
        // when toggle language in settings page, check previous url
        var previousUrl = $location.url().indexOf('/settings') > -1 ? $rootScope.routes.previous : '';

        //Tiered plan
        if (currentUrl.indexOf('/benefits/tier1') > -1)
        {
          query.benefitPage = 'tier1network';
        }

        if (currentUrl.indexOf('/benefits/tier2') > -1)
        {
          query.benefitPage = 'tier2network';
        }

        if (currentUrl.indexOf('/benefits/tieroon') > -1)
        {
          query.benefitPage = 'tieroonetwork';
        }

        if (currentUrl.indexOf('/benefits/out-of-network') > -1)
        {
          query.benefitPage = 'outnetwork';
        }

        if (currentUrl.indexOf('/benefits/preferinnetwork') > -1)
        {
          query.benefitPage = 'preferinnetwork';
        }

        if (currentUrl.indexOf('/benefits/otherinnetwork') > -1)
        {
          query.benefitPage = 'otherinnetwork';
        }

        if (currentUrl.indexOf('/benefits/otheroutofnetwork') > -1)
        {
          query.benefitPage = 'otheroutofnetwork';
        }

        //
        if (currentUrl.indexOf('/benefits/benefitsselectinnetwork') > -1)
        {
          query.benefitPage = 'planselectinnetwork';
        }

        if (currentUrl.indexOf('/benefits/benefitsselectoutnetwork') > -1)
        {
          query.benefitPage = 'planselectoutnetwork';
        }

        if (currentUrl.indexOf('/medicare-benefits') > -1) {
          pageName = "medicare-benefits";
        }

        if (currentUrl.indexOf('/benefits/viewcoverage') > -1 || previousUrl.indexOf('/benefits/viewcoverage') > -1) {
          $rootScope.showNav = true;
          $rootScope.showPolicySelect = false;

          $rootScope.pageTitle = $rootScope.loc.BENEFITS_COVERAGE_DETAILS;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
          pageName = "benefits-coverage";
        }

        if (currentUrl.indexOf('/benefits/dental-only') > -1 || previousUrl.indexOf('/benefits/dental-only') > -1) {
          $rootScope.showPolicySelect = false;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
          pageName = "benefits-dental-only";
        }

        if (currentUrl.indexOf('/benefits/low-cost-dental-only') > -1 || previousUrl.indexOf('/benefits/low-cost-dental-only') > -1) {
          $rootScope.showPolicySelect = false;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;
          pageName = "benefits-low-cost-dental-only";
        }

        if (currentUrl.indexOf('/benefits/bbt-only') > -1 || previousUrl.indexOf('/benefits/bbt-only') > -1) {
          $rootScope.showPolicySelect = false;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;
          pageName = "benefits-bbt-only";
        }

        if (currentUrl.indexOf('/benefits/vision-only') > -1 || previousUrl.indexOf('/benefits/vision-only') > -1) {
          $rootScope.showPolicySelect = false;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;
          pageName = "benefits-vision-only";
        }
        
        if (currentUrl.indexOf('/benefits/contraceptive-only') > -1 || previousUrl.indexOf('/benefits/contraceptive-only') > -1) {
          $rootScope.showPolicySelect = true;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;
          pageName = "benefits-contraceptive-only";
        }

        query.policyIndex = $rootScope.policyIndex;
        query.policyEffectiveDate = $rootScope.selectedPolicy.effectiveDate;
        query.policyExpirationDate = $rootScope.selectedPolicy.expirationDate;
        query.policyExternalId = $rootScope.selectedPolicy.externalId;
        query.url = $location.path();
        query.deviceType = $rootScope.device;
        if ($rootScope.selectedPolicy.isVision) {
          query.visionPlan = $rootScope.selectedPolicy.visionPlan;
        }

        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query, cachePage).then(function(pageHtml) {
          $rootScope.$emit('pageLoaded');
          console.log(pageHtml)
            $scope.pageHtml = pageHtml;
            adobeService.trackState(query.url.substring(1), analyticConstants.BENEFITS_SECTION);
            return coachmarkService.showCoachmarks('benefits');
        }, function() {
          $rootScope.$emit('pageLoaded');
          $rootScope.showNetworkErrorAlert();
        });
      };

      // once Member logs out, unregister the event listener for refreshing benefits page;
      $rootScope.$on(
        'LOGOUT',
        $rootScope.$on('policySelected', function() {
          $scope.getPage();
        })
      );

      $rootScope.verifyLocaleRetrieved();
      $scope.getPage();
    }
  ]);
}());
