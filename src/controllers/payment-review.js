/**
 * Controller for the payment details page view.
 *
 * @namespace Controllers
 * @class PaymentReviewController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.payment.review', [

  ])
  .controller('PaymentReviewController', [
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
      $rootScope.pageTitle = $rootScope.loc.BP_HEADER_PAYMENT_REVIEW;

      $scope.getPage = getPage;
      $scope.getPage();
      $scope.loc = $rootScope.loc;

      /**
       * Retrieves the page HTML from the page service. Called on view load and when a new policy is selected.
       *
       * @memberof PaymentReviewController
       * @method getPage
       */
      function getPage() {
        /**
        * The directive HTML for the page.
        *
        * @memberof PaymentReviewController
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
            'payment-review',
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
