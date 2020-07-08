(function() {
  angular
    .module('blueconnect.mobile.controllers.editAutopayFlowPage', [])
    .controller('editAutopayFlow', ['restService', '$rootScope', '$window', '$routeParams', '$scope',
      function(restService, $rootScope, $window, $routeParams, $scope) {

        // hide the navbar
        $rootScope.showNav = false;

        // hide the policy select dropdown
        $rootScope.showPolicySelect = false;

        // default the loc object to avoid ReferenceErrors later
        $scope.loc = $rootScope.loc || {};

        // default the navbar details to avoid unref
        $scope.navbarDetails = {};

        // show the back button
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;

        $scope.flowStep = $routeParams.step;

        if ($scope.flowStep === 'confirmation') {
          $rootScope.showNav = true;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;
          $rootScope.pageTitle = $rootScope.loc.BP_HEADER_AUTOPAY_CONFIRMATION;
        } else {
          // hide the navbar
          $rootScope.showNav = false;
          $scope.navbarDetails = {
            display: {
              title: getNavbarHeader($routeParams.step),
              leftNavButton: {
                icon: 'back'
              }
            },
            onLeftClick: function() {
              $scope.$broadcast('PAGE_BACK');
            }
          };

        }


        /**
         *
         * @param {string} routeParam
         * @return {string}
         */
        function getNavbarHeader(routeParam) {
          if (!$rootScope.loc) {
            $rootScope.$emit('pageNeedsLocale');
            return '';
          }
          if (routeParam === 'method') {
            return $rootScope.loc.BP_HEADER_AUTOPAY_METHOD;
          }
          if (routeParam === 'details') {
            return $rootScope.loc.BP_HEADER_AUTOPAY_DETAILS;
          }
          if (routeParam === 'review') {
            return $rootScope.loc.BP_HEADER_AUTOPAY_REVIEW;
          }
          if (routeParam === 'confirmation') {
            return $rootScope.loc.BP_HEADER_AUTOPAY_CONFIRMATION;
          }
        }

      var query = {
        policyIndex: ($rootScope.loggedIn) ? $rootScope.policyIndex : null,
        policyEffectiveDate : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null,
        policyExpirationDate : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null,
        policyExternalId : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null
      };

      $rootScope.$emit('pageLoading');
      restService.getPageData(
        restService.devices.MOBILE,
        'edit-autopay-flow',
        $rootScope.language,
        query
      )
      .then(function(response) {
        $rootScope.$emit('pageLoaded');
        if (response && response[0]) {
          $scope.serviceResponse = response[0].values;
          $rootScope.billingTrackStates($scope.flowStep, $scope.serviceResponse.account);
        }
      }).catch(function(error) {
        $rootScope.$emit('pageLoaded');
        console.warn(error);
      });
    }]);
})();