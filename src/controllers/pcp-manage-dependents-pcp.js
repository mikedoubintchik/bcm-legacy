/**
 * Controller for the managing the Member's dependent(s)' PCP
 *
 * @namespace Controllers
 * @class ManageDependentsPcpController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.pcp.ManageDependentsPcpController', [

  ])
    .controller('ManageDependentsPcpController', [
      '$scope',
      '$rootScope',
      '$window',
      'pageService',
      function($scope, $rootScope, $window, pageService) {
        $rootScope.showNav = false;
        $rootScope.showPolicySelect = false;
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
        $rootScope.pageTitle = $rootScope.loc.BP_HEADER_PAYMENT_REVIEW;

        getPage();
        $scope.loc = $rootScope.loc;

        /**
         * Retrieves the page HTML from the page service. Called on view load and when a new policy is selected.
         *
         * @memberof ManageDependentsPcpController
         * @method getPage
         */
        function getPage() {
          /**
          * The directive HTML for the page.
          *
          * @memberof ManageDependentsPcpController
          * @member {String} pageHtml
          */
          $scope.pageHtml = '';

          $rootScope.showNav = true;
          $rootScope.showPolicySelect = false;
          $rootScope.pageTitle = $rootScope.loc.PCP_COMMERCIAL_MY_DEPENDENT_PCPS;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;

          $rootScope.$emit('pageLoading');

          var query = {
            policyIndex: $rootScope.policyIndex,
            policyEffectiveDate: $rootScope.selectedPolicy.effectiveDate,
            policyExpirationDate: $rootScope.selectedPolicy.expirationDate,
            policyExternalId: $rootScope.selectedPolicy.externalId
          };

          pageService
            .getPage(
              pageService.devices.MOBILE,
              'pcp-manage-dependents-pcp',
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
