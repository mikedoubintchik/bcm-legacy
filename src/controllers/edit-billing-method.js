/**
 * The controller used for transitioning page views and retrieving data for the
 * edit-billing-methdo page
 */
(function() {
  angular
    .module('blueconnect.mobile.controllers.editBillingMethodPage', [])
    .controller('EditBillingMethodPage', ['$rootScope',
      '$scope', 'restService', 'adobeService', 'analyticConstants',
      function($rootScope, $scope, restService, adobeService, analyticConstants) {

      $rootScope.showPolicySelect = false;
      $rootScope.$emit('pageLoading');
      var query = {
        policyIndex: ($rootScope.loggedIn) ? $rootScope.policyIndex : null,
        policyEffectiveDate : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null,
        policyExpirationDate : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null,
        policyExternalId : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null
      };
      restService.getPageData(
        restService.devices.MOBILE,
        'edit-billing-method',
        $rootScope.language,
        query
      )
      .then(function(prefResponse) {
        $scope.preferences = prefResponse[0];

        // To be available to policy-header-gray
        $scope.selectedPolicy = prefResponse[0].values.policyInfo;
        $scope.token = prefResponse[0].values.token;

        $rootScope.$emit('pageLoaded');
        adobeService.trackState('editBillingMethod', analyticConstants.BILLING_SECTION);
      })
      .catch(function(errorReturned) {
        $rootScope.$emit('pageLoaded');
        $rootScope.showNetworkErrorAlert();
        console.warn('Failed to load data for edit-billing-method\t' + errorReturned.error.code + '\t' + errorReturned.error.message);
      });

    }]);
})();
