/**
 * Directive for the image types on the id card details page.
 *
 * @namespace Directives
 * @class idCardImageTypes
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.idCardImageTypes', [])
  .directive('idCardImageTypes', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/id-card-image-types.html',
        scope: {
          /**
          * The id card image types to display.
          *
          * @memberof idCardImageTypes
          * @member {Object} imageTypes
          */
          imageTypes: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.noImages = true;
            if ($scope.imageTypes[0].images.length === 0) {
              $scope.noImages = false;
            }
          }
        ]
      };
    }
  ]);
}());
