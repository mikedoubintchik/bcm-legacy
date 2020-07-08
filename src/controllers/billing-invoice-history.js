(function () {
  angular
    .module('blueconnect.mobile.controllers.billingInvoiceHistory', [])
    .controller('BillingInvoiceHistory', ['BillingInvoiceHistoryFactory', 'restService', '$rootScope', '$scope', 'adobeService', 'analyticConstants',
      function (BillingInvoiceHistoryFactory, restService, $rootScope, $scope, adobeService, analyticConstants) {
        $scope.loc = $rootScope.loc;

        $rootScope.showNav = true;
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK_TO_BILLING;
        $rootScope.pageTitle = $rootScope.loc.BP_TITLE_BILLING_HISTORY;
        $rootScope.showPolicySelect = true;

        $scope.filterSpan = BillingInvoiceHistoryFactory.getTimeSpan();

        $rootScope.$emit('pageLoading');
        restService.getPageData(
          restService.devices.MOBILE,
          'billing-invoice-history',
          $rootScope.language,
          {
            policyIndex: $rootScope.policyIndex,
            policyEffectiveDate : $rootScope.selectedPolicy.effectiveDate,
            policyExpirationDate : $rootScope.selectedPolicy.expirationDate,
            policyExternalId : $rootScope.selectedPolicy.externalId,
            searchFromDate: BillingInvoiceHistoryFactory.serviceFormattedSearchFromDate(),
            searchToDate: BillingInvoiceHistoryFactory.serviceFormattedSearchToDate(),
            transactionType: BillingInvoiceHistoryFactory.getHistoryType()
          })
          .then(function (response) {
            $rootScope.$emit('pageLoaded');
            if (response.account.accounts.length){
              BillingInvoiceHistoryFactory.setAccountToken(response.account.accounts[0].token);
              (response.policy.sourceSystem.toLowerCase() === 'amisys' && response.account.accounts[0].payIneligibleCode === 'S') ? BillingInvoiceHistoryFactory.setMedicareSSAValue(true) : BillingInvoiceHistoryFactory.setMedicareSSAValue(false);
            }
            $scope.serviceResponse = response;
            adobeService.trackState('billingInvoiceHistory', analyticConstants.BILLING_SECTION);
          }).catch(function (error) {
            $rootScope.$emit('pageLoaded');
            console.warn(error);
          });


      }]);
})();
