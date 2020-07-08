/**
 * Controller for the Autopay Method flow view.
 *
 * @namespace Controllers
 * @class AutopayMethodController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.autopay.method', [

  ])
  .controller('AutopayMethodController', [
    '$scope',
    '$rootScope',
    '$window',
    'adobeService',
    'pageService',
    function($scope, $rootScope, $window, adobeService, pageService) {
      var vm = this;

      $rootScope.showNav = false;
      $rootScope.showPolicySelect = false;

      $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
      $rootScope.pageTitle = $rootScope.loc ? $rootScope.loc.BP_HEADER_AUTOPAY_METHOD : '';
      $scope.getPage = getPage;
      $scope.getPage();

      /**
       * Retrieves the page HTML from the page service. Called on view load and when a new policy is selected.
       *
       * @memberof AutopayMethodController
       * @method getPage
       */
      function getPage() {
        /**
        * The directive HTML for the page.
        *
        * @memberof AutopayMethodController
        * @member {String} pageHtml
        */
        $scope.pageHtml = '';

        $rootScope.$emit('pageLoading');

        /**
         * For basicNavbar, we have to pass this function
         * to handle the left click
         */
        $scope.basicNavbarLeftClick = function() {
            $window.history.back();
        };
        var query = {
          policyIndex: $rootScope.policyIndex,
          policyEffectiveDate : $rootScope.selectedPolicy.effectiveDate,
          policyExpirationDate : $rootScope.selectedPolicy.expirationDate,
          policyExternalId : $rootScope.selectedPolicy.externalId,
        }

        pageService
          .getPage(
            pageService.devices.MOBILE,
            'autopay-method',
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
