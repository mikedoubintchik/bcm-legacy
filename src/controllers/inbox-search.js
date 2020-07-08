/**
 * Controller for the inbox search page view.
 *
 * @namespace Controllers
 * @class InboxSearchController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.inboxSearch', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('InboxSearchController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'pageService',
    'adobeService',
    'analyticConstants',
    function($scope, $rootScope, $location, $timeout, pageService, adobeService, analyticConstants) {
      $rootScope.showNav = false;
      $rootScope.showPolicySelect = false;

      var languageAttempts = 0;
      var identifier = 'inbox:search';

      /**
       * Retrieves the page HTML from the page service. Called on view load.
       *
       * @memberof InboxSearchController
       * @method getPage
       */
      $scope.getPage = function() {
        /**
        * The directive HTML for the page.
        *
        * @memberof InboxSearchController
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

        $scope.pageHtml = '';

        $scope.basicNavbarLeftClick = function() {
          $rootScope.gotoView('/inbox');
        };

        var query = {};
        if ($location.search().q) {
          query.q = $location.search().q;
          identifier = 'inbox:search:results';
        }
        if ($location.url().indexOf('/inbox/search/sent') > -1) {
          query.sent = true;
          identifier = 'inbox:search:sent';
        }
        else if ($location.url().indexOf('/inbox/search/bookmarked') > -1) {
          query.bookmarked = true;
          identifier = 'inbox:search:bookmarked';
        }

        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, 'inbox-search', $rootScope.language, query).then(function(pageHtml) {
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
