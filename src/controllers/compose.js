/**
 * Controller for the compose page view.
 *
 * @namespace Controllers
 * @class ComposeController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.compose', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('ComposeController', [
    '$scope',
    '$rootScope',
    '$location',
    '$routeParams',
    '$timeout',
    '$window',
    'pageService',
    'alertService',
    'adobeService',
    function($scope, $rootScope, $location, $routeParams, $timeout, $window, pageService, alertService, adobeService) {
      $rootScope.showNav = false;
      $rootScope.showPolicySelect = false;

      var languageAttempts = 0;
      var identifier = "secureInboxMessageDetailsCompose";
      var section = "Secure Inbox";
      $rootScope.startingView = section;

      /**
       * Retrieves the page HTML from the page service. Called on view load.
       *
       * @memberof ComposeController
       * @method getPage
       */
      $scope.getPage = function() {
        /**
        * The directive HTML for the page.
        *
        * @memberof ComposeController
        * @member {String} pageHtml
        */
        $scope.pageHtml = '';

        /**
        * For basicNavbar, we have to pass these two functions
        * to handle the left and right button clicks
        */
        $scope.basicNavbarLeftClick = function() {
            $rootScope.deleteMessage();
        };

        $scope.basicNavbarRightClick = function() {
          /**
          * Since the function exists of outside of scope,
          * we need to include validation function in rootScope
          */
          $rootScope.onSendValidation();
        };

        if(!$rootScope.loc) {
          languageAttempts++;
          if(languageAttempts > 5) {
            $rootScope.$emit('pageLoaded');
            $rootScope.showNetworkErrorAlert();
            return;
          }

          $timeout($scope.getPage, 100);
          return;
        }

        var pageName = 'inbox-compose';

        var query = {};

        /* detect if option variable is set for compose page*/
        var parameters = $location.search();
        query.policyIndex = $rootScope.policyIndex;
        query.policyEffectiveDate = $rootScope.selectedPolicy.effectiveDate;
        query.policyExpirationDate = $rootScope.selectedPolicy.expirationDate;
        query.policyExternalId = $rootScope.selectedPolicy.externalId;
        query.option = parameters.option;
        query.claim = parameters.claim;

        if($routeParams.id) {
          query.replyId = $routeParams.id;
        }

        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query).then(function(pageHtml) {
          $rootScope.$emit('pageLoaded');
          $scope.pageHtml = pageHtml;
        }, function(error, status) {
          $rootScope.$emit('pageLoaded');
          $rootScope.showNetworkErrorAlert();
        });
      };

      $rootScope.verifyLocaleRetrieved();
      $scope.getPage();
    }
  ]);
}());
