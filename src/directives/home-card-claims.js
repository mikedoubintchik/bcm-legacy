/**
 * Directive for the claims card on the home screen.
 *
 * @namespace Directives
 * @class homeCardClaims
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardClaims', [])
  .directive('homeCardClaims', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-claims.html',
        scope: {
          /**
          * Up to the 4 latest claims.
          *
          * @memberof homeCardClaims
          * @member {Array} claims
          */
          claims: '=',
          claimsTitle: '=',
          totalClaims: '=',
          policySelection: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'config',
          function($scope, $rootScope, config) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;

            /**
             * Generates the claim header string based on the policy type.
             *
             * @memberof homeCardClaims
             * @method getClaimsTitle
             */
            $scope.getClaimsTitle = function() {
              var titleString = "";

              switch ($scope.policySelection.choice) {
                  case "RX_ONLY":
                    titleString = $rootScope.loc.PRESCRIPTION_CLAIMS;
                    break;
                  case "BBTRX_ONLY":
                    titleString = $rootScope.loc.PRESCRIPTION_CLAIMS;
                    break;
                  case "DENTAL_ONLY":
                    titleString = $rootScope.loc.DENTAL_CLAIMS;
                    break;
                  case "VISION_ONLY":
                    titleString = $rootScope.loc.BLUE2020_CLAIMS_VISION_CLAIMS;
                    break;
                  default: //We will have some form of medical included.
                    if($scope.totalClaims === 1) {
                      titleString = '1 ' + $rootScope.loc.CLAIM;
                    }
                    else if($scope.totalClaims > 1) {
                      titleString = $scope.totalClaims + ' ' + $rootScope.loc.CLAIMS;
                    }
                    else if($scope.totalClaims === 0){
                      titleString = $scope.totalClaims + ' ' + $rootScope.loc.CLAIMS;
                    }
                    else {
                      titleString = $scope.claims.length + ' ' + $rootScope.loc.CLAIMS;
                    }

                    break;
              }

              return titleString;
            };

            /**
             * Pass through method to external links for dental claims
             *
             * @memberof homeCardClaims
             * @method gotoDentalClaims
             */
            $scope.gotoDentalClaims = function(ssoLink) {
              return $rootScope.openInSecureBrowser(ssoLink);
            };

            /**
             * Pass through method to external links for vision claims
             *
             * @memberof homeCardClaims
             * @method gotoVisionClaims
             */
            $scope.gotoVisionClaims = function(ssoLink) {
              return $rootScope.openInSecureBrowser(ssoLink);
            };

            /**
             * Pass through method to external links for drug claims
             *
             * @memberof homeCardClaims
             * @method gotoDrugClaims
             */
            $scope.gotoDrugClaims = function(ssoLink) {
              var data = {
                ssoLink : ssoLink,
                page : "RxClmDetl"
              };
              return $rootScope.openInSecureBrowser(data);
            };
          }
        ]
      };
    }
  ]);
}());
