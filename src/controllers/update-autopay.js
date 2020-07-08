/**
 * Controller for the Update Auto Pay view.
 *
 * @namespace Controllers
 * @class UpdateAutoPayController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.update.autopay', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('UpdateAutoPayController', [
          '$scope',
          '$rootScope',
          '$window',
          'adobeService',
          'pageService',
          'analyticConstants',
          function($scope, $rootScope, $window, adobeService, pageService, analyticConstants) {
            $rootScope.showNav = true;
            $rootScope.showPolicySelect = false;
            $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
            $rootScope.pageTitle = $rootScope.loc.BP_UPDATE_AUTOPAY_DETAILS;
            $scope.loc = $rootScope.loc;
            getPage();

            /**
             * Retrieves the page HTML from the page service. Called on view load and when a new policy is selected.
             *
             * @memberof UpdateAutoPayController
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
                      'update-autopay',
                      $rootScope.language,
                      query
                  )
                  .then(function(pageHtml) {
                    $scope.pageHtml = pageHtml;
                    $rootScope.$emit('pageLoaded');
                    adobeService.trackState('updateAutopay', analyticConstants.BILLING_SECTION);
                  })
                  .catch(function() {
                    $rootScope.$emit('pageLoaded');
                    $rootScope.showNetworkErrorAlert();
                  });
            }
          }
        ]);
}());
