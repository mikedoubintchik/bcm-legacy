/**
 * Directive for a list of claims.
 *
 * @namespace Directives
 * @class claimsList
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.claimsList', [])
  .directive('claimsList', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/claims-list.html',
        scope: {
          /**
          * The claims to display.
          *
          * @memberof claimsList
          * @member {Object} claims
          */
          claims: '=',
          showRibbon: '=',
          filterText: '=',
          policySelection: '=',
          hasCcr: '=',
        },
        controller: [
          '$scope',
          '$rootScope',
          'claimsService',
          'adobeService',
          'config',
          function($scope, $rootScope, claimsService, adobeService, config) {
            $scope.loc      = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;

            if ($scope.claims !== null) {
              $scope.claimsCountText  = claimsService.displayClaimsCount($scope.claims);
            }

            if ($scope.claims.length > 0) {
              $rootScope.hasClaims = true;
            }

            $scope.claimsFilterText = $scope.filterText;

            /**
             * Opens the individual claim view if no claim is swiped.
             *
             * @memberof claimsList
             * @method openClaim
             * @param  {Object} claim The claim to open.
             */
            $scope.openClaim = function(claim) {
              for(var i = 0; i < $scope.claims.length; i++) {
                if($scope.claims[i].swiped) {
                  $scope.claims[i].swiped = false;
                  return;
                }
              }

              $rootScope.gotoView('/claims/' + claim.claimId + '/' + claim.dependentNo);
            };

            /**
             * Opens the claim options when swiped left.
             *
             * @memberof claimsList
             * @method swipeClaim
             * @param  {Object} claim The claim swiped.
             */
            $scope.swipeClaim = function(claim) {
              for(var i = 0; i < $scope.claims.length; i++) {
                if($scope.claims[i].swiped) {
                  $scope.claims[i].swiped = false;
                }
              }
              claim.swiped = true;
            };

            /**
             * Closes the claim options when swiped right.
             *
             * @memberof claimsList
             * @method unswipeClaim
             * @param  {Object} claim The claim swiped.
             */
            $scope.unswipeClaim = function(claim) {
              if(claim.swiped) {
                claim.swiped = false;
              }
            };

            $scope.resetFilter = function() {
              $scope.claimsFilterText = claimsService.displayNoFilterText();
              $rootScope.gotoView('/claims/search');
            };

            /**
             * Generates the claim header string based on the policy type.
             *
             * @memberof claimsList
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
                  default:
                    break;
              }

              return titleString;
            };

            /**
             * Pass through method to external links for dental claims
             *
             * @memberof claimsList
             * @method gotoDentalClaims
             */
            $scope.gotoDentalClaims = function(ssoLink) {
              return $rootScope.openInSecureBrowser(ssoLink);
            };

            /**
             * Pass through method to external links for vision claims
             *
             * @memberof claimsList
             * @method gotoVisionClaims
             */
            $scope.gotoVisionClaims = function(ssoLink) {
              return $rootScope.openInSecureBrowser(ssoLink);
            };

            /**
             * Pass through method to external links for drug claims
             *
             * @memberof claimsList
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
