/**
 * Directive for the network details box on the id card details page.
 *
 * @namespace Directives
 * @class idCardNetworkDetails
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.idCardNetworkDetails', [])
  .directive('idCardNetworkDetails', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/id-card-network-details.html',
        scope: {
          /**
          * The id card network details to display.
          *
          * @memberof idCardNetworkDetails
          * @member {Object} details
          */
          networkDetails: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.networkResponsibilities = [];
            $scope.noBenefits = true;
            var benefit = $scope.networkDetails[0].benefitOption;
            if (benefit.length === 0) {
              $scope.noBenefits = false;
            }
            for(var i=0; i< Object.keys(benefit).length; i++){
              var benefitItemShortDescriptionUpperCase = ($scope.networkDetails[0].benefitOption[i].benefitItemShortDescription).toUpperCase().replace('-','_').split(' ').join('_');
              $scope.networkResponsibilities.push({
                'benefitItemDescription': $scope.networkDetails[0].benefitOption[i].benefitItemDescription,
                'benefitItemShortDescriptionLocalization' : benefitItemShortDescriptionUpperCase,
                'benefitItemShortDescription': $scope.networkDetails[0].benefitOption[i].benefitItemShortDescription
              });
            }
          }
        ]
      };
    }
  ]);
}());
