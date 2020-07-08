/**
 * Controller for the home page view.
 *
 * @namespace Controllers
 * @class HomeController
 */
(function() {
  "use strict";

  angular
    .module("blueconnect.mobile.controllers.home", [
      "bcbsnc.cloud.services.page"
    ])
    .controller("HomeController", [
      '$scope',
      '$rootScope',
      '$timeout',
      '$location',
      'pageService',
      'adobeService',
      'coachmarkService',
      'analyticConstants',
      '$anchorScroll',
      'livechatService',
      function($scope, $rootScope, $timeout, $location, pageService, adobeService, coachmarkService, analyticConstants, $anchorScroll, livechatService) {
        $rootScope.showNav = true;
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.HELP;
        $rootScope.showPolicySelect = true;

        var languageAttempts = 0;
        var section = "Home";

        $rootScope.startingView = section;

        if ($rootScope.selectedPolicy) {
          $rootScope.pageTitle =
          $rootScope.selectedPolicy.state === true
            ? '<div style="margin-top: -.5rem"><img src="images/shp-logo.svg" style="max-width: 11rem"></img></div>'
            : '<div style="margin-top: -.5rem"><img src="images/logo.svg" style="max-width: 11rem"></img></div>';

          if (
            $rootScope.signature &&
            $rootScope.signature.get($rootScope.policyIndex).isSignatureService
          ) {
            $rootScope.pageTitle =
              '<div style="margin-top: -.5rem"><img src="images/logo-signature-services.svg" style="max-width: 11rem"></img></div>';
          } else if ($rootScope.selectedPolicy.state === true) {
            //state with signature will have signature logo
            $rootScope.pageTitle =
              '<div style="margin-top: -.5rem"><img src="images/shp-logo.svg" style="max-width: 11rem"></img></div>';
          } else {
            $rootScope.pageTitle =
              '<div style="margin-top: -.5rem"><img src="images/logo.svg" style="max-width: 11rem"></img></div>';
          }
        }

        /**
         * Retrieves the page HTML from the page service. Called on view load and when a new policy is selected.
         *
         * @memberof HomeController
         * @method getPage
         */
        $scope.getPage = function() {
          if (!$rootScope.selectedPolicy && !!$rootScope.loggedIn === false) {
            return $rootScope.gotoView('/login');
          }
          $scope.pageHtml = '';

          $rootScope.$emit("pageLoading");

          if (!$rootScope.loc || !$rootScope.policies) {
            languageAttempts++;
            if (languageAttempts > 5) {
              $rootScope.$emit("pageLoaded");
              $rootScope.showNetworkErrorAlert();
              return;
            }

            $timeout($scope.getPage, 100);
            return;
          }

          var query = {
            policyIndex: $rootScope.loggedIn ? $rootScope.policyIndex : null,
            policyEffectiveDate: $rootScope.loggedIn
              ? $rootScope.selectedPolicy.effectiveDate
              : null,
            policyExpirationDate: $rootScope.loggedIn
              ? $rootScope.selectedPolicy.expirationDate
              : null,
            policyExternalId: $rootScope.loggedIn
              ? $rootScope.selectedPolicy.externalId
              : null,
            planId: $rootScope.loggedIn ? $rootScope.selectedPolicy.id : null,
            vitalsMatchedPlanName: $rootScope.loggedIn
              ? $rootScope.selectedPolicy.vitalsMatchedPlanName
              : null,
            deviceType: $rootScope.device
          };

          pageService
            .getPage(
              pageService.devices.MOBILE,
              "home",
              $rootScope.language,
              query
            )
            .then(
              function(pageHtml) {
                $rootScope.$emit("pageLoaded");
                if ($rootScope.liveChatIntialized && window.liveagent){
                  livechatService.disconnectLiveChat();
                }
                $scope.pageHtml = pageHtml;
                coachmarkService.showCoachmarks("home");
                if ($location.url().indexOf('/home') > -1) {
                  if ($rootScope.elapsedTimeNeeded) {
                    var timeElapsed = (Date.now() - $rootScope.timeElapsed) / 1000; // in seconds
                    adobeService.trackAction('homeCardLoaded', analyticConstants.HOME_SECTION, {homeCardElapsedTime: timeElapsed});
                    $rootScope.elapsedTimeNeeded = false;
                  }
                  adobeService.trackState('members:app:home', analyticConstants.HOME_SECTION);
                }
              },
              function() {
                $rootScope.$emit("pageLoaded");
                $rootScope.showNetworkErrorAlert();
              }
            );
        };

        var homeCardUnregisterFunc = $rootScope.$on(
          "policySelected",
          function() {
            $scope.getPage();
          }
        );
        $rootScope.$on("LOGOUT", homeCardUnregisterFunc);
        $rootScope.verifyLocaleRetrieved();
        $rootScope.refreshNavbar();
        $scope.getPage();
      }
    ]);
})();
