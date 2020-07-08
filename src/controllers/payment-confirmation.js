/**
 * @description Controller for payment confirmation in payment flow
 * @namespace Controllers
 * @class PaymentConfirmationController
 */
(function() {
  angular
    .module('blueconnect.mobile.controllers.payment.confirmation', [])
    .controller('PaymentConfirmationController', [
      '$rootScope',
      '$scope',
      '$window',
      'adobeService',
      'pageService',
      'paymentFlowFactory',
      function($rootScope, $scope, $window, adobeService, pageService, paymentFlowFactory) {
        var vm = this;

        $rootScope.showNav = true;
        $rootScope.showPolicySelect = false;
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;
        $rootScope.pageTitle = $rootScope.loc.BP_HEADER_PAYMENT_CONFIRMATION;

        $scope.getPage = getPage;
        $scope.getPage();
        $scope.loc = $rootScope.loc;

         /**
         * Retrieves the page HTML from the page service. Called on view load and when a new policy is selected.
         *
         * @memberof PaymentConfirmationController
         * @method getPage
         */
        function getPage() {
          /**
          * The directive HTML for the page.
          *
          * @memberof PaymentConfirmationController
          * @member {String} pageHtml
          */
          $scope.pageHtml = '';

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
              'payment-confirmation',
              $rootScope.language,
              query
            )
            .then(function(pageHtml) {
              $scope.pageHtml = pageHtml;
              $rootScope.$emit('pageLoaded');
            })
            .catch(function(error) {
              $rootScope.$emit('pageLoaded');
              $rootScope.showNetworkErrorAlert();
            });
        }
      }
    ]);

})();
