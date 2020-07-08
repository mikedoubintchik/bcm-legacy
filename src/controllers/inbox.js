/**
 * Controller for the inbox page view.
 *
 * @namespace Controllers
 * @class InboxController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.inbox', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('InboxController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    '$routeParams',
    'pageService',
    'adobeService',
    'analyticConstants',
    function($scope, $rootScope, $location, $timeout, $routeParams, pageService, adobeService, analyticConstants) {
      $rootScope.showNav = true;
      $rootScope.showPolicySelect = false;

      var languageAttempts = 0;
      var identifier = "inbox";
  
      /**
       * Retrieves the page HTML from the page service. Called on view load.
       *
       * @memberof InboxController
       * @method getPage
       */
      $scope.getPage = function() {
        /**
        * The directive HTML for the page.
        *
        * @memberof InboxController
        * @member {String} pageHtml
        */
        $scope.pageHtml = '';

        if (!$rootScope.loc) {
          languageAttempts++;
          if (languageAttempts > 5) {
            $rootScope.$emit('pageLoaded');
            $rootScope.showNetworkErrorAlert();
            return;
          }

          $timeout($scope.getPage, 100);
          return;
        }

        $rootScope.pageTitle = $rootScope.loc.SECURE_INBOX;
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;

        var query = {};
        query.getEmailFromCpcFailed = $rootScope.getEmailFromCpcFailed || '';
        var pageName = 'inbox';
        if ($location.url().indexOf('/inbox/sent') > -1) {
          pageName = 'inbox-sent';
          identifier = 'inbox:sent';
        }
        else if ($location.url().indexOf('/inbox/bookmarked') > -1) {
          pageName = 'inbox-bookmarked';
          identifier = 'inbox:bookmarked';
        }
        if ($routeParams.id) {
          pageName = 'inbox-message/' + $routeParams.id;
          $rootScope.pageTitle = $rootScope.loc.MESSAGE_DETAILS;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.INBOX;
          identifier = 'inbox:messageDetails';
        }

        if (pageName === 'inbox') {
          Object.assign(query, $rootScope.getTIPData());
        }

        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query).then(function(pageHtml) {
          $rootScope.$emit('pageLoaded');
          $scope.pageHtml = pageHtml;
          adobeService.trackState(identifier, analyticConstants.INBOX_SECTION);
        }, function() {
          $rootScope.$emit('pageLoaded');
          $rootScope.showNetworkErrorAlert();
        });
      };

      $rootScope.verifyLocaleRetrieved();
      $scope.getPage();
    }
  ]);
}());
