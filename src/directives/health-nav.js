/**
 * Directive for the healthNav page.
 *
 * @namespace Directives
 * @class healthNav
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.healthNav', [])
  .directive('healthNav', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/health-nav.html',
        scope: {
          /**
          * Display information for the healthNav page.
          *
          * @memberof about
          * @member {Object} healthNavDetails
          */
          healthNavDetails: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          'adobeService',
          'analyticConstants',
          '$timeout',
          function($rootScope, $scope, adobeService, analyticConstants, $timeout) {
            $scope.openInSecureBrowser = $rootScope.openInSecureBrowser;
            $scope.gotoView = $rootScope.gotoView;
            $scope.startingView = $rootScope.startingView;
            $scope.trackState = $rootScope.trackState;
            $scope.trackAction = $rootScope.trackAction;
            $scope.alertModal = $rootScope.alertModal;
            adobeService.trackState('memberResources', analyticConstants.HEALTHNAV_SECTION);
            
            $timeout(function() {
              if ($rootScope.vitalsDown) {
                $rootScope.vitalsDown = false;
                return $scope.openAlertModal();
              }
            });

            $scope.checkVitalsError = function() {
              if ($rootScope.vitalsError) {
                $scope.openAlertModal();
              } else {
                $scope.gotoView('/find-doctor');
              }
            };

            $scope.alertModalObj = {
              title: $scope.healthNavDetails.title ? $scope.healthNavDetails.title : '',
              message: $scope.healthNavDetails.message ? $scope.healthNavDetails.message : '',
              confirmBtn: $scope.healthNavDetails.confirmBtn ? $scope.healthNavDetails.confirmBtn : '',
            };
          }
        ]
      };
    }
  ]);
}());
