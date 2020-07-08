/**
 * Controller for the billingHistoryUnderstandInvoice.
 *
 * @namespace Controllers
 * @class billingHistoryUnderstandInvoice
 */
(function () {
  'use strict';

  angular
      .module('blueconnect.mobile.controllers.billingHistoryUnderstandInvoice', [
        'bcbsnc.cloud.services.page'
      ])
      .controller('BillingHistoryUnderstandInvoice', [
            '$rootScope',
            '$scope',
            '$location',
            '$anchorScroll',
            'adobeService', 
            'analyticConstants',
            function ($rootScope, $scope, $location, $anchorScroll, adobeService, analyticConstants) {

              // hide the navbar
              $rootScope.showNav = false;
              $scope.gotoView = $rootScope.gotoView;

              // hide the policy select dropdown
              $rootScope.showPolicySelect = false;

              // default the loc object to avoid ReferenceErrors later
              $scope.loc = $rootScope.loc || {};

              // default the navbar details to avoid unref
              $scope.navbarDetails = {};

              $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;

              $scope.navbarDetails = {
                display: {
                  title: $rootScope.loc.BP_TITLE_UNDERSTANDING_INVOICE,
                  leftNavButton: {
                    icon: 'close'
                  }
                },
                onLeftClick: function () {
                  $scope.$broadcast('PAGE_BACK');
                }
              };

              $scope.gotoAnchor = function (divName) {
                // set the location.hash to the id of the element you wish to scroll to.
                $location.hash(divName);
                // call $anchorScroll()
                $anchorScroll();
              };

              adobeService.trackState('billingUnderstandingInvoice', analyticConstants.BILLING_SECTION);
            }]);
})();
