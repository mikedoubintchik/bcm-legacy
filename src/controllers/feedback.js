/**
 * Controller for the feedback view.
 *
 * @namespace Controllers
 * @class FeedbackController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.feedback', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('FeedbackController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    '$window',
    'pageService',
    'adobeService',
    function($scope, $rootScope, $location, $timeout, $window, pageService, adobeService) {
      $rootScope.showNav = false;
      $rootScope.showPolicySelect = false;
      var languageAttempts = 0;
      var section = 'Feedback';
      $rootScope.startingView = section;

      // if(!$rootScope.loc){
        // $rootScope.getInternalLocale();
      // }
      /**
       * Retrieves the page HTML from the page service. Called on view load.
       *
       * @memberof FAQController
       * @method getPage
       */
       $scope.getPage = function() {
         /**
         * The directive HTML for the page.
         *
         * @memberof AboutController
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

        var pageName = 'feedback';
        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, {loggedIn : $rootScope.loggedIn}).then(function(pageHtml) {
          $rootScope.$emit('pageLoaded');
          $scope.pageHtml = pageHtml;
        }, function(error, status) {
          $rootScope.$emit('pageLoaded');
          if ($rootScope.loggedIn) {
            $rootScope.showNetworkErrorAlert();
          } else {
            $rootScope.showNetworkErrorUnautenticated();
          }
        });
      };

      $rootScope.verifyLocaleRetrieved();
      $scope.getPage();
    }
  ]);
}());
