/**
 * Controller for the Billing Preferences view.
 *
 * @namespace Controllers
 * @class BillingPreferencesController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.billing.preferences', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('BillingPreferencesController', [
          '$scope',
          '$rootScope',
          '$window',
          'adobeService',
          'pageService',
          'analyticConstants',
          function($scope, $rootScope, $window, adobeService, pageService, analyticConstants) {
            $rootScope.showNav = true;
            $rootScope.showPolicySelect = true;
            $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
            $rootScope.pageTitle = $rootScope.loc.BP_HEADER_BILLING_PREFERENCES;
            $scope.loc = $rootScope.loc;

            getPage();

            /**
             * Retrieves the page HTML from the page service. Called on view load and when a new policy is selected.
             *
             * @memberof PaymentDetailsController
             * @method getPage
             */
            function getPage() {
              /**
               * The directive HTML for the page.
               *
               * @memberof BillingPreferencesController
               * @member {String} pageHtml
               */
              $scope.pageHtml = '';

              /**
               * For basicNavbar, we have to pass this function
               * to handle the left click
               */
              $scope.basicNavbarLeftClick = function() {
                $window.history.back();
              };

              $rootScope.$emit('pageLoading');
              var query = {
                policyIndex: $rootScope.policyIndex,
                policyEffectiveDate : $rootScope.selectedPolicy.effectiveDate,
                policyExpirationDate : $rootScope.selectedPolicy.expirationDate,
                policyExternalId : $rootScope.selectedPolicy.externalId
              };

              pageService
                  .getPage(
                      pageService.devices.MOBILE,
                      'billing-preferences',
                      $rootScope.language,
                      query
                  )
                  .then(function(pageHtml) {
                    $scope.pageHtml = pageHtml;
                    $rootScope.$emit('pageLoaded');
                    adobeService.trackState('billingPreferences', analyticConstants.BILLING_SECTION);
                  })
                  .catch(function() {
                    $rootScope.$emit('pageLoaded');
                    $rootScope.showNetworkErrorAlert();
                  });
            }
          }
        ]);
}());
