/**
 * Controller for the Update Auto Pay view.
 *
 * @namespace Controllers
 * @class stopAutoPayController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.stop.autopay', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('StopAutoPayController', [
          '$scope',
          '$rootScope',
          '$window',
          'adobeService',
          'pageService',
          function($scope, $rootScope, $window, adobeService, pageService) {
            var vm = this;

            $rootScope.showNav = true;
            $rootScope.showPolicySelect = false;
            $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
            $rootScope.pageTitle = $rootScope.loc.BP_STOP_AUTOPAY;
            $scope.loc = $rootScope.loc;

            getPage();

            /**
             * Retrieves the page HTML from the page service. Called on view load and when a new policy is selected.
             *
             * @memberof StopAutoPayController
             * @method getPage
             */
            function getPage() {
              /**
               * The directive HTML for the page.
               *
               * @memberof StopAutoPayController
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
                      'stop-autopay',
                      $rootScope.language,
                      query
                  )
                  .then(function(pageHtml) {
                    $scope.pageHtml = pageHtml;
                    $rootScope.$emit('pageLoaded');
                  })
                  .catch(function(error, status) {
                    $rootScope.$emit('pageLoaded');
                    $rootScope.showNetworkErrorAlert();
                  });
            }
          }
        ]);
}());
