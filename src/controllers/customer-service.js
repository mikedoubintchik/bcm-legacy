/*
* Controller for the customer service view.
*
* @namespace Controllers
* @class CustomerServiceController
*/
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.customerService', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('CustomerServiceController', [
    '$scope',
    '$rootScope',
    'pageService',
    '$window',
    'adobeService',
    'analyticConstants',
    function($scope, $rootScope, pageService, $window, adobeService, analyticConstants) {
      if ($rootScope.loggedIn) {
        $rootScope.showNav = true;
        $rootScope.showPolicySelect = true;
      } else {
        $rootScope.showNav = false;
        $rootScope.showPolicySelect = false;
      }
      $rootScope.pageTitle = $rootScope.loc.CALL_CUSTOMER_SERVICE;
      $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;

      /**
       * Retrieves the page HTML from the page service. Called on view load.
       *
       * @memberof CustomerServiceController
       * @method getPage
       */
      $scope.getPage = function() {
        /**
        * The directive HTML for the page.
        *
        * @memberof CustomerServiceController
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

        var pageName = 'customer-service';
        var query;
        //based on the $rootScope.loggedIn we are passing the query to pageService to get the page
        if ($rootScope.loggedIn) {
          query = {
            policyIndex: ($rootScope.loggedIn) ? $rootScope.policyIndex : null,
            policyEffectiveDate : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null,
            policyExpirationDate : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null,
            policyExternalId : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null,
            loggedIn : $rootScope.loggedIn
          };
        } else {
          query = {
            loggedIn : $rootScope.loggedIn
          };
        }

        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query).then(function(pageHtml) {
          $rootScope.$emit('pageLoaded');
          $scope.pageHtml = pageHtml;
          adobeService.trackState('customerService', analyticConstants.HELP_SECTION);
        }, function() {
          $rootScope.$emit('pageLoaded');
          if ($rootScope.loggedIn) {
            $rootScope.showNetworkErrorAlert();
          } else {
            $rootScope.showNetworkErrorUnautenticated();
          }
        });
      };
      if ($rootScope.loggedIn) {
        var customerServiceUnsubscribeFunc = $rootScope.$on('policySelected', function() {
          $scope.getPage();
        });
        $rootScope.$on('LOGOUT', customerServiceUnsubscribeFunc);
      }

      $rootScope.verifyLocaleRetrieved();
      $scope.getPage();
    }
  ]);
}());
