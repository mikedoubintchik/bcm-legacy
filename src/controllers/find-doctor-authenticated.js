/**
 * Controller for the Find A Doctor view for authenticated members.
 *
 * @namespace Controllers
 * @class Find A Doctor Authenticated
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.controllers.findDoctorAuthenticated', [
      'bcbsnc.cloud.services.page'
    ])
    .controller('FindDoctorAuthenticatedController', [
      '$scope',
      '$rootScope',
      '$location',
      'pageService',
      function($scope, $rootScope, $location, pageService) {
        $rootScope.openMapView = false;
        var pageName = 'find-doctor-authenticated';
        $scope.selectedPolicy = $rootScope.selectedPolicy;
        $scope.pageHtml = '';
        $rootScope.$emit('pageLoading');
        $rootScope.$emit('pageNeedsLocale');

        pageService
          .getPage(
            pageService.devices.MOBILE,
            pageName,
            $rootScope.language,
            {
              loggedIn : $rootScope.loggedIn,
              deviceType : $rootScope.device,
              planName: $scope.selectedPolicy.lobDesc,
              externalId: $scope.selectedPolicy.externalId,
              internalId: $scope.selectedPolicy.internalId,
              alphaPrefix: $scope.selectedPolicy.alphaPrefix,
              lobCode: $scope.selectedPolicy.lobCode
            }
          )
          .then(function(pageHtml) {
            $rootScope.$emit('pageLoaded');
            $scope.pageHtml = pageHtml;
          })
          .catch(function(error) {
            $rootScope.$emit('pageLoaded');
            $rootScope.showNetworkErrorAlert();
          });
      }
    ]);
}());
