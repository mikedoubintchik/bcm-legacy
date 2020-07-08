/**
 * Directive for the find doctor search bottom bar.
 *
 * @namespace Directives
 * @class findDoctorSearchBottomBar
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.findDoctorSearchBottomBar', [])
    .directive('findDoctorSearchBottomBar', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/find-doctor-search-bottom-bar.html',
          scope: {
            /**
             * Information for drawing the navbar.
             *
             * @memberof findDoctorSearchBottomBar
             * @member {Object} bottomBarDetails
             */
            bottomBarDetails: '=',
            pcpDetails: '=',
          },
          controller: [
            '$scope',
            '$rootScope',
            'TransparencyFactory',
            'languageService',
            'shareService',
            'alertService',
            'geoLocationService',
            function(
              $scope,
              $rootScope,
              TransparencyFactory,
              languageService,
              shareService,
              alertService,
              geoLocationService
            ) {
              $scope.gotoView = $rootScope.gotoView;
              $scope.trackState = $rootScope.trackState;
              $scope.trackAction = $rootScope.trackAction;
              $scope.language = $rootScope.language || 'en';
              $scope.loggedIn = $rootScope.loggedIn;

              var generateShareContent = function (data, estimatedCostInfo) {
                $scope.medicareUser = ($rootScope.loggedIn && $rootScope.selectedPolicy.sourceSystem === 'Amisys') ? true : false;
                // Add name.
                var shareContent = data.summary.name;

                // Add degree if there is one.
                shareContent += data.summary.degrees ? data.summary.degrees + '\n' : '\n';

                // Dr. details
                shareContent += data.summary.gender + data.summary.specialty_names+ '\n';

                // Accepting new patients.
                shareContent += data.summary.accepting_new_patients ? 'Accepting new patients \n': '';

                // Main address.
                shareContent += data.summary.location_name + '\n' + data.summary.addr_line1 + '\n';

                // Addr line 2.
                shareContent += data.summary.addr_line2 ? data.summary.addr_line2 + '\n' : ''; 
                  
                // City, state, zip.
                shareContent += data.summary.city + ', ' + data.summary.state + ' ' + data.summary.postal_code + '\n';

                // Phone number.
                shareContent += data.summary.phone_raw ? 'Phone: ' + data.summary.phone_raw + '\n': '';
                
                // Fax.
                shareContent += data.summary.fax_raw ? 'Fax: ' + data.summary.fax_raw + '\n' : '';

                // If authenticated and estimatedCostInfo provided, show procedure costs info.
                if ($rootScope.loggedIn && estimatedCostInfo && !$scope.medicareUser) {
                  //total estimated cost to you
                  shareContent += estimatedCostInfo.estimatedCostToYou ? estimatedCostInfo.estimatedCostToYou.name + ' ' + estimatedCostInfo.estimatedCostToYou.amount + '\n' : '';

                  // copay.
                  shareContent += estimatedCostInfo.copay ? estimatedCostInfo.copay.name + ': ' + estimatedCostInfo.copay.amount + '\n' : '';

                  // deductible.
                  shareContent += estimatedCostInfo.deductible ? estimatedCostInfo.deductible.name + ': ' + estimatedCostInfo.deductible.amount + '\n' : '';

                  // coinsurance.
                  shareContent += estimatedCostInfo.coinsurance ? estimatedCostInfo.coinsurance.name + ': ' + estimatedCostInfo.coinsurance.amount + '\n' : '';

                  // blueCrossContribution.
                  shareContent += estimatedCostInfo.blueCrossContribution ? estimatedCostInfo.blueCrossContribution.name + ': ' + estimatedCostInfo.blueCrossContribution.amount + '\n' : '';

                  // totalCost.
                  shareContent += estimatedCostInfo.totalCost ? estimatedCostInfo.totalCost.name + ': ' + estimatedCostInfo.totalCost.amount : '';
                }
                // Return.
                return shareContent;
              }

              languageService
                .getLocale($scope.language)
                .then(function(localeReturned) {
                  $scope.loc = localeReturned;
                })
                .catch(console.warn);

              /**
               * Go to the url
               * if index is 0 i.e new search button is selected it will remove the current page from history
               * to make back button functionality works correctly.
               *
               * @memberof findDoctorSearchBottomBar
               * @method bottomBarSelected
               */

              $scope.bottomBarSelected = function(url, title) {
                var data = TransparencyFactory.getResultsToShare();
                var transparencyInfo = {};

                transparencyInfo.searchTerm = TransparencyFactory.getResultsDetailsTerm();
                transparencyInfo.title = 'profile: ' + transparencyInfo.searchTerm;
                

                if (title === $scope.loc.GET_DIRECTION) {
                  transparencyInfo.title += ': get directions'; 
                  $rootScope.healthNavTrackActions(0, transparencyInfo);
                  $rootScope.nativeMap = true;

                  var location =
                    data.cardData.summary.addr_line1 +
                    ' ' +
                    data.cardData.summary.city +
                    ', ' +
                    data.cardData.summary.state +
                    ' ' +
                    data.cardData.summary.postal_code;

                  alertService
                    .showAlert(
                      $scope.loc.EXTERNAL_LINK,
                      $scope.loc.EXTERNAL_LINK_WARNING,
                      { title: $scope.loc.CONTINUE, color: 'blue' },
                      { title: $scope.loc.CANCEL }
                    )
                    .then(function() {
                      $rootScope.blurContent = false;
                      geoLocationService.openMaps(location);
                    });
                } else if (title === $scope.loc.FILTER_RESULTS) {
                  $rootScope.newFilter = true;
                }

                // Share button
                if (title === $scope.loc.SHARE) {
                  transparencyInfo.title += ': share'; 
                  $rootScope.healthNavTrackActions(0, transparencyInfo);
                  $rootScope.pausedForShare = true;
                  
                  // Create share content from card data.
                  var shareContent = generateShareContent(data.cardData, data.cardData.estimatedCostInfo);
                    
                  shareService.showSharing(
                    shareService.contentType.TEXT,
                    shareContent
                  );
                }
                if (title === $scope.loc.HELP) {
                  url += '?expand=FIND_CARE';
                  $rootScope.gotoView(url);
                } else if (url.length > 1) {
                  // Only route if the url is not root.
                  $rootScope.gotoView(url);
                }
              };
            },
          ],
        };
      },
    ]);
})();
