/**
 * Controller for the Find A Doctor Browser view.
 *
 * @namespace Controllers
 * @class FindDoctorBrowserController
 */
(function () {
  'use strict';

  angular
    .module('blueconnect.mobile.controllers.findDoctorBrowser', [
      'bcbsnc.cloud.services.page'
    ])
    .controller('FindDoctorBrowserController', [
      '$scope',
      '$rootScope',
      '$location',
      'pageService',
      'TransparencyFactory',
      'analyticConstants',
      function ($scope, $rootScope, $location, pageService, TransparencyFactory, analyticConstants) {
        var pageName = 'find-doctor-browser';
        $rootScope.$emit('pageLoading');
        if ($rootScope.loggedIn) {
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
          $rootScope.showNav = false;
          $rootScope.showPolicySelect = false;
        }

        $rootScope.filterText = '';

        /**
         * The directive HTML for the page.
         *
         * @memberof FindDoctorBrowserController
         * @member {String} pageHtml
         */
        $scope.pageHtml = '';

        var query = $location.search();
        query.loggedIn = $rootScope.loggedIn;
        query.policyIndex = ($rootScope.loggedIn) ? $rootScope.policyIndex : null;
        query.vitalsMatchedPlanName = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.vitalsMatchedPlanName : '';
        query.policyEffectiveDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null;
        query.policyExpirationDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null;
        query.policyExternalId = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null;

        if (query.browseTerm) { // encoding this browseTerm - if the query string contains ampersand(&) its spliting up the string.
          query.browseTerm = encodeURIComponent(TransparencyFactory.getBrowseTerm());
        }
        if (query.browseLevel == '2') {
          query.browseLevelTwoTerm = encodeURIComponent(TransparencyFactory.getBrowseLevelTwoTerm());
        }
        if ($rootScope.vitalsJWT && $rootScope.vitalsSignature && !$rootScope.noMatchPlanFound) {
          query.jwt = $rootScope.vitalsJWT;
          query.signature = $rootScope.vitalsSignature.signature;
        }
        query.deviceType = $rootScope.device;                    

        pageService
          .getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query)
          .then(function(pageHtml) {
            $rootScope.$emit('pageLoaded');
            $rootScope.healthNavTrackStates(4, query, analyticConstants.HEALTHNAV_SECTION);
            $scope.pageHtml = pageHtml;
          })
          .catch(function() {
            $rootScope.$emit('pageLoaded');
            if ($rootScope.loggedIn) {
              $rootScope.showNetworkErrorAlert();
            } else {
              $rootScope.showNetworkErrorUnautenticated();
            }
          });
      }
    ]);
}());
