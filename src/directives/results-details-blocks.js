var MAX_AFFILIATIONS = 3;
var FIND_DOCTOR_RESULTS_DETAILS = 'findDoctorResultsDetails';
/**
 * Directive for the result details blocks.
 *
 * @namespace Directives
 * @class resultsDetailsBlocks
 */
(function() {
  'use strict';
  var pageName = 'find-doctor-results-details';
  angular
    .module('blueconnect.mobile.directives.resultsDetailsBlocks', [])
    .directive('findDoctorResultsDetailsNameCard', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/find-doctor-results-details-name-card.html',
          scope: {
            doctorNameCardInfo: '<doctorNameCardObj',
            viewPcpDetailsValue: '<viewPcpDetailsValue',
            recommendedFlowValue: '<recommendedFlowValue',
            dependentPcp: '<dependentPcp'
          },
          controller: [
            '$rootScope',
            '$scope',
            'TransparencyFactory',
            'helpService',
            function($rootScope, $scope, TransparencyFactory, helpService) {
              // Set the locale from the parent directive
              $scope.loc = $scope.$parent.loc;
              $scope.noMatchPlanFound = $rootScope.noMatchPlanFound;
              $scope.recommendedProviderData = ($scope.recommendedFlowValue && TransparencyFactory.getRecommendedPcpData()) ? TransparencyFactory.getRecommendedPcpData() : false;

              $scope.doctorNameCardOpen = true;
              $scope.tierDetails = TransparencyFactory.getResultsDetailsItemLabel();
              $scope.toggleCollapse = function() {
                $scope.doctorNameCardOpen = !$scope.doctorNameCardOpen;
                $rootScope.healthNavTrackToggleActions('profile', $scope.loc.RESULTS_DETAILS_NAME_CARD, $scope.doctorNameCardOpen);
              };

              $scope.openOutNetworkInformation = function() {
                $rootScope.headerTerm = $scope.loc.INFORMATION;
                $scope.helpInfo = {
                  makeMyPcpQuestion: $scope.loc.PCP_MEDICARE_DETAILS_OUTOFNETWORKPCP,
                  makeMyPcpAnswer: $scope.loc.PCP_MEDICARE_MODAL_OUTOFNETWORKPCP,
                  makePcpInfo: true
                };
                helpService.help($scope.helpInfo);

              };

              $scope.openTierInfoModal = function() {
                $rootScope.headerTerm = $scope.loc.INFORMATION;
                $scope.helpInfo = {
                  tierModalText: $scope.loc.CLEAR_PRICING_TIER_INFORMATION,
                  tierInfo: true
                };
                helpService.help($scope.helpInfo);
              };
            },
          ],
        };
      },
    ])

    .directive('findDoctorResultsDetailsOfficeLocationCard', function() {
      return {
        restrict: 'E',
        scope: {
          locationAndContactCardInfo: '<locationAndContactInfoCardObj',
        },
        templateUrl:
          'partials/find-doctor-results-details-office-location-card.html',
        controller: [
          '$rootScope',
          '$scope',
          'alertService',
          'geoLocationService',
          'restService',
          'TransparencyFactory',
          function(
            $rootScope,
            $scope,
            alertService,
            geoLocationService,
            restService,
            TransparencyFactory
          ) {
            // Set the locale from the parent directive
            $scope.loc = $scope.$parent.loc;

            // Default params.
            $scope.officeAndLocationCardOpen = true;
            $scope.expandedLocation = false;
            $scope.isLoadingMore = false;

            $scope.toggleItem = function() {
              $scope.officeAndLocationCardOpen = !$scope.officeAndLocationCardOpen;
              $rootScope.healthNavTrackToggleActions('profile', $scope.loc.OFFICE_LOCATION, $scope.officeAndLocationCardOpen);
            };

            $scope.locationsArray = $scope.locationAndContactCardInfo
              ? $scope.locationAndContactCardInfo.details
              : [];

            // Display other locations, if any
            $scope.displayOtherLocations = function(locationDetails) {
              $scope.expandedLocation = !$scope.expandedLocation;
            };

            $scope.getDirectionsClicked = function() {
              var location =
                $scope.locationAndContactCardInfo.summary.addr_line1 +
                ' ' +
                $scope.locationAndContactCardInfo.summary.city +
                ', ' +
                $scope.locationAndContactCardInfo.summary.state +
                ' ' +
                $scope.locationAndContactCardInfo.summary.postal_code;

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
            };

            // Handle go to details of location.
            $scope.viewDetailsOfLocation = function(selectedLocation) {
              $rootScope.detailsFromBackButton = false;
              // Set results details term/item.
              var resultsDetailsTerm = selectedLocation.name || selectedLocation.title;
              var resultsDetailsItem = { location_id: selectedLocation.location_id, provider_id: selectedLocation.provider_id };

              // Populate transparency factory.
              TransparencyFactory
                .setResultsDetailsTerm(resultsDetailsTerm)
                .setResultDetailsItem(resultsDetailsItem);

              // Construct url.
              var viewUrl = '/find-doctor-results-details?location=' + selectedLocation.location_id + '&provider=' + selectedLocation.provider_id;

              // Navigate.
              $rootScope.gotoView(viewUrl);
            };

            $scope.canLoadMore = function() {
              return $scope.locationAndContactCardInfo.other_locations._meta
                .pages.next;
            };

            $scope.loadMore = function() {
              // Construct query params.
              var query = {
                account_id:
                  $rootScope.selectedPlan && $rootScope.selectedPlan.accountId,
                card: 'location',
                distance: TransparencyFactory.getDistance(),
                lang: $rootScope.language,
                location_id: TransparencyFactory.getResultsDetailsItem()
                  .location_id,
                loggedIn: $rootScope.loggedIn,
                network_id:
                  $rootScope.selectedPlan && $rootScope.selectedPlan.id,
                page:
                  $scope.locationAndContactCardInfo.other_locations._meta.pages
                    .next,
                planName:
                  $rootScope.selectedPlan && $rootScope.selectedPlan.name,
                provider_id: TransparencyFactory.getResultsDetailsItem()
                  .provider_id,
                resultsTerm: TransparencyFactory.getResultsDetailsTerm(),
                zipCode: TransparencyFactory.getCity() ? TransparencyFactory.getCity().zip : null,
              };

              // Toggle loading more.
              $scope.isLoadingMore = true;

              // Call rest service.
              restService
                .getPageData(
                  restService.devices.MOBILE,
                  pageName,
                  $rootScope.language,
                  query
                )
                .then(function(res) {
                  // Toggle isLoadingMore
                  $scope.isLoadingMore = false;

                  // Select the appropriate data element.
                  var data = res.find(function(c) {
                    return c.name === FIND_DOCTOR_RESULTS_DETAILS;
                  }).values.findDoctorResultsDetails.cardData;

                  // Get new meta.
                  $scope.locationAndContactCardInfo.other_locations._meta =
                    data._meta;

                  // Concat results.
                  $scope.locationAndContactCardInfo.other_locations.other_provider_locations = $scope.locationAndContactCardInfo.other_locations.other_provider_locations.concat(
                    data.other_provider_locations
                  );
                });
            };
          },
        ],
      };
    })

    .directive('findDoctorResultsDetailsNetworksCard', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/find-doctor-results-details-networks-card.html',
        controller: [
          '$rootScope',
          '$scope',
          '$location',
          'restService',
          'TransparencyFactory',
          function(
            $rootScope,
            $scope,
            $location,
            restService,
            TransparencyFactory
          ) {
            // Set the locale from the parent directive
            $scope.loc = $scope.$parent.loc;

            // Card is initially collapsed
            $scope.networksCardOpen = false;

            var loadNetworks = function() {
              // if no data is saved, retrieve it
              var query = $location.search();
              query.loggedIn = $rootScope.loggedIn;
              query.planName = $rootScope.selectedPlan && $rootScope.selectedPlan.name;
              if (query.viewPcpDetails != 'true') {
                query.zipCode = TransparencyFactory.getCity().zip;
                query.distance = TransparencyFactory.getDistance();
              }
              query.resultsTerm = TransparencyFactory.getResultsDetailsTerm();
              query.card = 'networks';

              var pageName = 'find-doctor-results-details';
              $scope.$emit('networkCardLoading');

              // Retrieve the required provider networks data
              restService
                .getPageData(
                  restService.devices.MOBILE,
                  pageName,
                  $rootScope.language,
                  query
                )
                .then(
                  function(resultReceived) {
                    $scope.$emit('networkCardLoaded');

                    // Select the appropriate data element
                    resultReceived.forEach(function(component) {
                      if (component.name === FIND_DOCTOR_RESULTS_DETAILS) {
                        $scope.providerNetworks =
                          component.values.findDoctorResultsDetails.cardData.networks_accepted;
                        TransparencyFactory.setResultsDetailsNetworksAccepted(
                          $scope.providerNetworks
                        );
                      }
                    });
                  },
                  function(error, status) {
                    $scope.$emit('networkCardLoaded');
                    if ($rootScope.loggedIn) {
                      $rootScope.showNetworkErrorAlert();
                    } else {
                      $rootScope.showNetworkErrorUnautenticated();
                    }
                  }
                );
            };

            // Expand card on click
            $scope.toggleItem = function() {
              $rootScope.healthNavTrackToggleActions('profile', $scope.loc.RESULTS_DETAILS_NETWORKS_ACCEPTED_CARD, !$scope.networksCardOpen);
              // When card is being expanded
              if (!$scope.networksCardOpen) {
                var savedNetworks = TransparencyFactory.getResultsDetailsNetworksAccepted();

                // Check if networks data has already been obtained previously
                if (savedNetworks) {
                  $scope.providerNetworks = savedNetworks;
                } else {
                  // retrieve data.
                  loadNetworks();
                }
              }

              // Toggle card state
              $scope.networksCardOpen = !$scope.networksCardOpen;
            };

            // Show card loading spinner
            $scope.$on('networkCardLoading', function() {
              angular.element('.network-data').hide();
              angular.element('.network-card-loading-spinner').show();
            });

            // Hide card loading spinner
            $scope.$on('networkCardLoaded', function() {
              angular.element('.network-data').show();
              angular.element('.network-card-loading-spinner').hide();
            });

            // kick off load networks.
            loadNetworks();
          },
        ],
      };
    })

    .directive('findDoctorResultsDetailsSpecialtiesCard', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl:
          'partials/find-doctor-results-details-specialties-card.html',
        controller: [
          '$rootScope',
          '$scope',
          '$location',
          'restService',
          'TransparencyFactory',
          function(
            $rootScope,
            $scope,
            $location,
            restService,
            TransparencyFactory
          ) {
            // Set the locale from the parent directive
            $scope.loc = $scope.$parent.loc;

            // Card is initially collapsed
            $scope.specialtiesCardOpen = false;
            angular.element('.specialties-card-loading-spinner').hide();

            var loadSpecialties = function() {

              // if no data is saved, retrieve it
              var query = $location.search();
              query.loggedIn = $rootScope.loggedIn;
              query.planName =
                $rootScope.selectedPlan && $rootScope.selectedPlan.name;
              if (query.viewPcpDetails != 'true') {
                query.zipCode = TransparencyFactory.getCity().zip;
                query.distance = TransparencyFactory.getDistance();
              }
              query.resultsTerm = TransparencyFactory.getResultsDetailsTerm();
              query.card = 'specialties';

              var pageName = 'find-doctor-results-details';
              $scope.$emit('specialtiesCardLoading');

              // Retrieve the required provider specialties data
              restService
                .getPageData(
                  restService.devices.MOBILE,
                  pageName,
                  $rootScope.language,
                  query
                )
                .then(
                  function(resultReceived) {
                    $scope.$emit('specialtiesCardLoaded');

                    // Select the appropriate data element
                    resultReceived.forEach(function(component) {
                      if (component.name === FIND_DOCTOR_RESULTS_DETAILS) {
                        $scope.loggedIn = $rootScope.loggedIn;
                        $scope.providerSpecialties =
                          component.values.findDoctorResultsDetails.cardData.specialties;
                        $scope.providerInfo = {};
                        $scope.providerInfo.providerName =
                          component.values.findDoctorResultsDetails.cardData.providerName;
                        $scope.providerInfo.isPcp =
                          component.values.findDoctorResultsDetails.cardData.isPcp;
                        $scope.providerInfo.isProvider =
                          component.values.findDoctorResultsDetails.cardData.isProvider;
                        TransparencyFactory.setResultsDetailsSpecialties(
                          $scope.providerSpecialties
                        );
                      }
                    });
                  },
                  function(error, status) {
                    $scope.$emit('specialtiesCardLoaded');
                    if ($rootScope.loggedIn) {
                      $rootScope.showNetworkErrorAlert();
                    } else {
                      $rootScope.showNetworkErrorUnautenticated();
                    }
                  }
                );
            };

            // Expand card on click
            $scope.toggleItem = function() {
              $rootScope.healthNavTrackToggleActions('profile', $scope.loc.RESULTS_DETAILS_SPECIALTIES_CARD, !$scope.specialtiesCardOpen);
              // When card is being expanded
              if (!$scope.specialtiesCardOpen) {
                var savedSpecialties = TransparencyFactory.getResultsDetailsSpecialties();

                // Check if specialties data has already been obtained previously
                if (savedSpecialties) {
                  $scope.providerSpecialties = savedSpecialties;
                } else {
                  // load data.
                  loadSpecialties();
                }
              }

              // Toggle card state
              $scope.specialtiesCardOpen = !$scope.specialtiesCardOpen;


            };

            // Show card loading spinner
            $scope.$on('specialtiesCardLoading', function() {
              angular.element('.specialties-data').hide();
              angular.element('.specialties-card-loading-spinner').show();
            });

            // Hide card loading spinner
            $scope.$on('specialtiesCardLoaded', function() {
              angular.element('.specialties-data').show();
              angular.element('.specialties-card-loading-spinner').hide();
            });

            // Initialize data load.
            loadSpecialties();
          },
        ],
      };
    })

    .directive('findDoctorResultsDetailsCredentialCard', function() {
      return {
        restrict: 'E',
        scope: {
          providerType: '<providerType',
        },
        templateUrl:
          'partials/find-doctor-results-details-credential-card.html',
        controller: [
          '$rootScope',
          '$scope',
          '$location',
          'restService',
          'TransparencyFactory',
          function(
            $rootScope,
            $scope,
            $location,
            restService,
            TransparencyFactory
          ) {
            // Set the locale from the parent directive
            $scope.loc = $scope.$parent.loc;

            // Card is initially collapsed
            $scope.credentialCardOpen = false;
            angular.element('.credentials-card-loading-spinner').hide();

            // function to load data
            var loadCredentials = function() {
              var query = $location.search();
              query.loggedIn = $rootScope.loggedIn;
              query.planName =
                $rootScope.selectedPlan && $rootScope.selectedPlan.name;
              if (query.viewPcpDetails != 'true') {
                query.zipCode = TransparencyFactory.getCity().zip;
                query.distance = TransparencyFactory.getDistance();
              }
              query.resultsTerm = TransparencyFactory.getResultsDetailsTerm();
              query.card = 'credentials';

              var pageName = 'find-doctor-results-details';
              $scope.$emit('credentialsCardLoading');

              // Retrieve the required provider credentials data
              restService
                .getPageData(
                  restService.devices.MOBILE,
                  pageName,
                  $rootScope.language,
                  query
                )
                .then(
                  function(resultReceived) {
                    $scope.$emit('credentialsCardLoaded');

                    // Select the appropriate data element
                    resultReceived.forEach(function(component) {
                      if (component.name === FIND_DOCTOR_RESULTS_DETAILS) {
                        $scope.providerCredentials =
                          component.values.findDoctorResultsDetails.cardData;
                        TransparencyFactory.setResultsDetailsCredentials(
                          $scope.providerCredentials
                        );
                      }
                    });
                  },
                  function(error, status) {
                    $scope.$emit('credentialsCardLoaded');
                    if ($rootScope.loggedIn) {
                      $rootScope.showNetworkErrorAlert();
                    } else {
                      $rootScope.showNetworkErrorUnautenticated();
                    }
                  }
                );

            };

            // Expand card on click
            $scope.toggleItem = function() {
              $rootScope.healthNavTrackToggleActions('profile', $scope.loc.RESULTS_DETAILS_CREDENTIALS_CARD, !$scope.credentialCardOpen);
              // When card is being expanded
              if (!$scope.credentialCardOpen) {
                var savedCredentials = TransparencyFactory.getResultsDetailsCredentials();

                // Check if credentials data has already been obtained previously
                if (savedCredentials) {
                  $scope.providerCredentials = savedCredentials;
                } else {
                  // if no data is saved, retrieve it
                  loadCredentials();
                }
              }

              // Toggle card state
              $scope.credentialCardOpen = !$scope.credentialCardOpen;
            };

            // Show card loading spinner
            $scope.$on('credentialsCardLoading', function() {
              angular.element('.credentials-data').hide();
              angular.element('.credentials-card-loading-spinner').show();
            });

            // Hide card loading spinner
            $scope.$on('credentialsCardLoaded', function() {
              angular.element('.credentials-data').show();
              angular.element('.credentials-card-loading-spinner').hide();
            });

            // Initial data load.
            loadCredentials();
          },
        ],
      };
    })

    .directive('findDoctorResultsDetailsAwardsCard', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/find-doctor-results-details-awards-card.html',
        controller: [
          '$rootScope',
          '$scope',
          '$location',
          'restService',
          'TransparencyFactory',
          function(
            $rootScope,
            $scope,
            $location,
            restService,
            TransparencyFactory
          ) {
            // Set the locale from the parent directive
            $scope.loc = $scope.$parent.loc;

            // Card is initially collapsed
            $scope.awardsCardOpen = false;
            angular.element('.awards-card-loading-spinner').hide();

            var loadAwards = function() {
              var query = $location.search();
              query.loggedIn = $rootScope.loggedIn;
              query.planName =
                $rootScope.selectedPlan && $rootScope.selectedPlan.name;
              if (query.viewPcpDetails != 'true') {
                query.zipCode = TransparencyFactory.getCity().zip;
                query.distance = TransparencyFactory.getDistance();
              }
              query.resultsTerm = TransparencyFactory.getResultsDetailsTerm();
              query.card = 'awards';

              var pageName = 'find-doctor-results-details';
              $scope.$emit('awardsCardLoading');

              // Retrieve the required provider awards data
              restService
                .getPageData(
                  restService.devices.MOBILE,
                  pageName,
                  $rootScope.language,
                  query
                )
                .then(
                  function(resultReceived) {
                    $scope.$emit('awardsCardLoaded');

                    // Select the appropriate data element
                    resultReceived.forEach(function(component) {
                      if (component.name === FIND_DOCTOR_RESULTS_DETAILS) {
                        $scope.providerAwards =
                          component.values.findDoctorResultsDetails.cardData;
                        TransparencyFactory.setResultsDetailsAwards(
                          $scope.providerAwards
                        );
                      }
                    });
                  },
                  function(error, status) {
                    $scope.$emit('awardsCardLoaded');
                    if ($rootScope.loggedIn) {
                      $rootScope.showNetworkErrorAlert();
                    } else {
                      $rootScope.showNetworkErrorUnautenticated();
                    }
                  }
                );
            }

            // Expand card on click
            $scope.toggleItem = function() {
              $rootScope.healthNavTrackToggleActions('profile', $scope.loc.RESULTS_DETAILS_AWARDS_CARD, !$scope.awardsCardOpen);
              // When card is being expanded
              if (!$scope.awardsCardOpen) {
                var savedAwards = TransparencyFactory.getResultsDetailsAwards();

                // Check if awards data has already been obtained previously
                if (savedAwards) {
                  $scope.providerAwards = savedAwards;
                } else {
                  // if no data is saved, retrieve it
                  loadAwards()
                }
              }

              // Toggle card state
              $scope.awardsCardOpen = !$scope.awardsCardOpen;
            };

            // Show card loading spinner
            $scope.$on('awardsCardLoading', function() {
              angular.element('.awards-data').hide();
              angular.element('.awards-card-loading-spinner').show();
            });

            // Hide card loading spinner
            $scope.$on('awardsCardLoaded', function() {
              angular.element('.awards-data').show();
              angular.element('.awards-card-loading-spinner').hide();
            });

            loadAwards();
          },
        ],
      };
    })

    .directive('findDoctorResultsDetailsAffiliationCard', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl:
          'partials/find-doctor-results-details-affiliation-card.html',
        controller: [
          '$rootScope',
          '$scope',
          '$location',
          'restService',
          'TransparencyFactory',
          function(
            $rootScope,
            $scope,
            $location,
            restService,
            TransparencyFactory
          ) {
            // Default variables.
            $scope.loc = $scope.$parent.loc;
            $scope.affiliationsCardOpen = false;
            $scope.showOtherAffiliations = false;
            $scope.loadMoreAffiliationsMessage =
              $scope.loc.RESULTS_DETAILS_MORE_AFFILIATES;
            var query = $location.search();

            var loadAffiliations = function() {

              // Merge query and variables for card.
              query = Object.assign(query, {
                card: 'affiliations',
                distance: TransparencyFactory.getDistance(),
                loggedIn: $rootScope.loggedIn,
                planName:
                  $rootScope.selectedPlan && $rootScope.selectedPlan.name,
                resultsTerm: TransparencyFactory.getResultsTerm(),
                zipCode: query.viewPcpDetails != "true" ? TransparencyFactory.getCity().zip : null,
              });

              // Retrieve the required provider awards data
              $scope.$emit('affiliationsCardLoading');
              restService
                .getPageData(
                  restService.devices.MOBILE,
                  pageName,
                  $rootScope.language,
                  query
                )
                .then(
                  function(res) {
                    $scope.$emit('affiliationsCardLoaded');

                    // Select the appropriate data element.
                    var resultDetails = res.find(function(c) {
                      return c.name === FIND_DOCTOR_RESULTS_DETAILS;
                    });

                    // Scope affiliations.
                    $scope.affiliations =
                      resultDetails.values.findDoctorResultsDetails.cardData.topAffiliations;
                    $scope.otherAffiliations =
                      resultDetails.values.findDoctorResultsDetails.cardData.otherAffiliations;

                    // Set in factory.
                    TransparencyFactory.setResultsDetailsAffiliations(
                      $scope.affiliations
                    );
                  },
                  function(error, status) {
                    $scope.$emit('affiliationsCardLoaded');
                    if ($rootScope.loggedIn) {
                      $rootScope.showNetworkErrorAlert();
                    } else {
                      $rootScope.showNetworkErrorUnautenticated();
                    }
                  }
                );
            };

            // Function to toggle card.
            $scope.toggleItem = function() {
              $scope.affiliationsCardOpen = !$scope.affiliationsCardOpen;

              $rootScope.healthNavTrackToggleActions('profile', $scope.loc.RESULTS_DETAILS_AFFILIATIONS_CARD, $scope.affiliationsCardOpen);

              // Load affiliations from transparency factory.
              if (TransparencyFactory.hasResultsDetailsAffiliations()) {
                $scope.affiliations = TransparencyFactory.getResultsDetailsAffiliations();
              } else {
                // Load data.
                loadAffiliations();
              }
            };


            $scope.toggleOtherAffiliations = function() {
              // Toggle show other affiliations.
              $scope.showOtherAffiliations = !$scope.showOtherAffiliations;

              if ($scope.showOtherAffiliations) {
                // Set message.
                $scope.loadMoreAffiliationsMessage =
                  $scope.loc.RESULTS_DETAILS_SEE_LESS;

                // Concat array.
                $scope.affiliations = $scope.affiliations.concat(
                  $scope.otherAffiliations
                );
              } else {
                // Set message.
                $scope.loadMoreAffiliationsMessage =
                  $scope.loc.RESULTS_DETAILS_MORE_AFFILIATES;

                // Slice array.
                $scope.affiliations = $scope.affiliations.slice(
                  0,
                  MAX_AFFILIATIONS
                );
              }
            };

            $scope.canLoadMore = true;

            // Handle go to details of location.
            $scope.viewDetailsOfAffiliate = function(affiliate) {
              $rootScope.detailsFromBackButton = false;
              // Set results details term/item.
              var resultsDetailsTerm = affiliate.name;
              var resultsDetailsItem = { location_id: affiliate.location_id, provider_id: affiliate.provider_id };

              // Populate transparency factory.
              TransparencyFactory
                .setResultsDetailsTerm(resultsDetailsTerm)
                .setResultDetailsItem(resultsDetailsItem);

              // Construct url.
              var viewUrl = '/find-doctor-results-details?location=' + affiliate.location_id + '&provider=' + affiliate.provider_id;

              // Navigate.
              $rootScope.gotoView(viewUrl);
            };


            // Hide card loading spinner.
            $scope.$on('affiliationsCardLoaded', function() {
              angular.element('.affiliation-data').show();
              angular.element('.affiliation-card-loading-spinner').hide();
            });

            // Show card loading spinner.
            $scope.$on('affiliationsCardLoading', function() {
              angular.element('.affiliation-data').hide();
              angular.element('.affiliation-card-loading-spinner').show();
            });

            loadAffiliations();
          },
        ],
      };
    })

    .directive('findDoctorResultsDetailsLanguagesCard', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/find-doctor-results-details-languages-card.html',
        controller: [
          '$rootScope',
          '$scope',
          '$location',
          'restService',
          'TransparencyFactory',
          function(
            $rootScope,
            $scope,
            $location,
            restService,
            TransparencyFactory
          ) {
            // Set the locale from the parent directive
            $scope.loc = $scope.$parent.loc;
            $scope.languagesCardOpen = false;
            var query = $location.search();

            var loadLanguages = function() {
              // Merge query and variables for card.
              query = Object.assign(query, {
                card: 'languages',
                distance: TransparencyFactory.getDistance(),
                loggedIn: $rootScope.loggedIn,
                planName:
                  $rootScope.selectedPlan && $rootScope.selectedPlan.name,
                resultsTerm: TransparencyFactory.getResultsTerm(),
                zipCode: query.viewPcpDetails != "true" ? TransparencyFactory.getCity().zip : null,
              });

              // Retrieve the required provider awards data
              $scope.$emit('languagesCardLoading');
              restService
                .getPageData(
                  restService.devices.MOBILE,
                  pageName,
                  $rootScope.language,
                  query
                )
                .then(
                  function(res) {
                    $scope.$emit('languagesCardLoaded');

                    // Select the appropriate data element.
                    var resultDetails = res.find(function(c) {
                      return c.name === FIND_DOCTOR_RESULTS_DETAILS;
                    });

                    // Scope languages.
                    $scope.languages =
                      resultDetails.values.findDoctorResultsDetails.cardData;

                    // Set in factory.
                    TransparencyFactory.setResultsDetailsLanguages(
                      $scope.languages
                    );
                  },
                  function(error, status) {
                    $scope.$emit('languagesCardLoaded');
                    if ($rootScope.loggedIn) {
                      $rootScope.showNetworkErrorAlert();
                    } else {
                      $rootScope.showNetworkErrorUnautenticated();
                    }
                  }
                );
            };

            // Function to toggle card.
            $scope.toggleItem = function() {
              $scope.languagesCardOpen = !$scope.languagesCardOpen;

              $rootScope.healthNavTrackToggleActions('profile', $scope.loc.RESULTS_DETAILS_LANGUAGES_CARD, $scope.languagesCardOpen);

              // Load data from transparency factory.
              if (TransparencyFactory.hasResultsDetailsLanguages()) {
                $scope.languages = TransparencyFactory.getResultsDetailsLanguages();
              } else {
                loadLanguages();
              }
            };

            // Hide card loading spinner.
            $scope.$on('languagesCardLoaded', function() {
              angular.element('.language-data').show();
              angular.element('.language-card-loading-spinner').hide();
            });

            // Show card loading spinner.
            $scope.$on('languagesCardLoading', function() {
              angular.element('.language-data').hide();
              angular.element('.language-card-loading-spinner').show();
            });

            loadLanguages();
          },
        ],
      };
    })

    .directive('findDoctorResultsDetailsLimitationsCard', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl:
          'partials/find-doctor-results-details-limitations-card.html',
        controller: [
          '$rootScope',
          '$scope',
          '$location',
          'restService',
          'TransparencyFactory',
          function(
            $rootScope,
            $scope,
            $location,
            restService,
            TransparencyFactory
          ) {
            // Set the locale from the parent directive
            $scope.loc = $scope.$parent.loc;
            $scope.limitationsCardOpen = false;
            var query = $location.search();

            var loadLimitations = function() {
              // Merge query and variables for card.
              query = Object.assign(query, {
                card: 'limitations',
                distance: TransparencyFactory.getDistance(),
                loggedIn: $rootScope.loggedIn,
                planName:
                  $rootScope.selectedPlan && $rootScope.selectedPlan.name,
                resultsTerm: TransparencyFactory.getResultsTerm(),
                zipCode: query.viewPcpDetails != "true" ? TransparencyFactory.getCity().zip : null,
              });

              // Retrieve the required provider awards data
              $scope.$emit('limitationsCardLoading');
              restService
                .getPageData(
                  restService.devices.MOBILE,
                  pageName,
                  $rootScope.language,
                  query
                )
                .then(
                  function(res) {
                    $scope.$emit('limitationsCardLoaded');

                    // Select the appropriate data element.
                    var resultDetails = res.find(function(c) {
                      return c.name === FIND_DOCTOR_RESULTS_DETAILS;
                    });

                    // Scope limitations.
                    $scope.limitations =
                      resultDetails.values.findDoctorResultsDetails.cardData;

                    $scope.limitations = ($scope.limitations.length > 0 && $scope.limitations[0].type_code === 'toa') ? $scope.limitations.reverse() : $scope.limitations;

                    // Set in factory.
                    TransparencyFactory.setResultsDetailsLimitations(
                      $scope.limitations
                    );
                  },
                  function(error, status) {
                    $scope.$emit('limitationsCardLoaded');
                    if ($rootScope.loggedIn) {
                      $rootScope.showNetworkErrorAlert();
                    } else {
                      $rootScope.showNetworkErrorUnautenticated();
                    }
                  }
                );
            };

            // Function to toggle card.
            $scope.toggleItem = function() {
              $scope.limitationsCardOpen = !$scope.limitationsCardOpen;

              $rootScope.healthNavTrackToggleActions('profile', $scope.loc.RESULTS_DETAILS_LIMITATIONS_CARD, $scope.limitationsCardOpen);

              // Load data from transparency factory.
              if (TransparencyFactory.hasResultsDetailsLimitations()) {
                $scope.limitations = TransparencyFactory.getResultsDetailsLimitations();
              } else {
                loadLimitations();
              }
            };

            // Hide card loading spinner.
            $scope.$on('limitationsCardLoaded', function() {
              angular.element('.limitation-data').show();
              angular.element('.limitation-card-loading-spinner').hide();
            });

            // Show card loading spinner.
            $scope.$on('limitationsCardLoading', function() {
              angular.element('.limitation-data').hide();
              angular.element('.limitation-card-loading-spinner').show();
            });

            $scope.limits = { min: 0, max: 99 };

            loadLimitations();
          },
        ],
      };
    })

    .directive('findDoctorResultsDetailsLocationAmenitiesCard', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl:
          'partials/find-doctor-results-details-location-amenities-card.html',
        controller: [
          '$rootScope',
          '$scope',
          '$location',
          'restService',
          'TransparencyFactory',
          function(
            $rootScope,
            $scope,
            $location,
            restService,
            TransparencyFactory
          ) {
            // Set the locale from the parent directive
            $scope.loc = $scope.$parent.loc;
            $scope.amenitiesCardOpen = false;
            var query = $location.search();

            var loadLocationAmenties = function() {
              // Merge query and variables for card.
              query = Object.assign(query, {
                card: 'amenities',
                distance: TransparencyFactory.getDistance(),
                loggedIn: $rootScope.loggedIn,
                planName:
                  $rootScope.selectedPlan && $rootScope.selectedPlan.name,
                resultsTerm: TransparencyFactory.getResultsTerm(),
                zipCode: query.viewPcpDetails != "true" ? TransparencyFactory.getCity().zip : null,
              });

              // Retrieve the required provider awards data
              $scope.$emit('amenitiesCardLoading');
              restService
                .getPageData(
                  restService.devices.MOBILE,
                  pageName,
                  $rootScope.language,
                  query
                )
                .then(
                  function(res) {
                    $scope.$emit('amenitiesCardLoaded');

                    // Select the appropriate data element.
                    var resultDetails = res.find(function(c) {
                      return c.name === FIND_DOCTOR_RESULTS_DETAILS;
                    });

                    // Scope amenities.
                    $scope.amenities =
                      resultDetails.values.findDoctorResultsDetails.cardData;

                    // Set in factory.
                    TransparencyFactory.setResultsDetailsAmenities(
                      $scope.amenities
                    );
                  },
                  function(error, status) {
                    $scope.$emit('amenitiesCardLoaded');
                    if ($rootScope.loggedIn) {
                      $rootScope.showNetworkErrorAlert();
                    } else {
                      $rootScope.showNetworkErrorUnautenticated();
                    }
                  }
                );
            };

            // Function to toggle card.
            $scope.toggleItem = function() {
              $scope.amenitiesCardOpen = !$scope.amenitiesCardOpen;

              $rootScope.healthNavTrackToggleActions('profile', $scope.loc.RESULTS_DETAILS_AMENITIESS_CARD, $scope.amenitiesCardOpen);

              // Load data from transparency factory.
              if (TransparencyFactory.hasResultsDetailsAmenities()) {
                $scope.amenities = TransparencyFactory.getResultsDetailsAmenities();
              } else {
                loadLocationAmenties();
              }
            };

            // Hide card loading spinner.
            $scope.$on('amenitiesCardLoaded', function() {
              angular.element('.amenity-data').show();
              angular.element('.amenity-card-loading-spinner').hide();
            });

            // Show card loading spinner.
            $scope.$on('amenitiesCardLoading', function() {
              angular.element('.amenity-data').hide();
              angular.element('.amenity-card-loading-spinner').show();
            });

            loadLocationAmenties();
          },
        ],
      };
    })

    .directive('findDoctorResultsDetailsMoreProviderDetailsCard', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl:
          'partials/find-doctor-results-details-more-provider-details-card.html',
        controller: [
          '$rootScope',
          '$scope',
          '$location',
          'restService',
          'TransparencyFactory',
          function(
            $rootScope,
            $scope,
            $location,
            restService,
            TransparencyFactory
          ) {
            // Set the locale from the parent directive
            $scope.loc = $scope.$parent.loc;
            $scope.detailsCardOpen = false;
            var query = $location.search();

            var loadProviderDetails = function() {
              // Merge query and variables for card.
              query = Object.assign(query, {
                card: 'identifiers',
                distance: TransparencyFactory.getDistance(),
                loggedIn: $rootScope.loggedIn,
                planName:
                  $rootScope.selectedPlan && $rootScope.selectedPlan.name,
                resultsTerm: TransparencyFactory.getResultsTerm(),
                zipCode: query.viewPcpDetails != "true" ? TransparencyFactory.getCity().zip : null,
              });

              // Retrieve the required provider awards data
              $scope.$emit('detailsCardLoading');
              restService
                .getPageData(
                  restService.devices.MOBILE,
                  pageName,
                  $rootScope.language,
                  query
                )
                .then(
                  function(res) {
                    $scope.$emit('detailsCardLoaded');

                    // Select the appropriate data element.
                    var resultDetails = res.find(function(c) {
                      return c.name === FIND_DOCTOR_RESULTS_DETAILS;
                    });

                    // Scope identifiers.
                    $scope.identifiers =
                      resultDetails.values.findDoctorResultsDetails.cardData;

                    // Set in factory.
                    TransparencyFactory.setResultsDetailsIdentifiers(
                      $scope.identifiers
                    );
                  },
                  function(error, status) {
                    $scope.$emit('detailsCardLoaded');
                    if ($rootScope.loggedIn) {
                      $rootScope.showNetworkErrorAlert();
                    } else {
                      $rootScope.showNetworkErrorUnautenticated();
                    }
                  }
                );
            };

            // Function to toggle card.
            $scope.toggleItem = function() {
              $scope.detailsCardOpen = !$scope.detailsCardOpen;

              $rootScope.healthNavTrackToggleActions('profile', $scope.loc.RESULTS_DETAILS_MORE_INFO_CARD, $scope.detailsCardOpen);

              // Load data from transparency factory.
              if (TransparencyFactory.hasResultsDetailsIdentifiers()) {
                $scope.identifiers = TransparencyFactory.getResultsDetailsIdentifiers();
              } else {
                loadProviderDetails();
              }
            };

            // Hide card loading spinner.
            $scope.$on('detailsCardLoaded', function() {
              angular.element('.details-data').show();
              angular.element('.details-card-loading-spinner').hide();
            });

            // Show card loading spinner.
            $scope.$on('detailsCardLoading', function() {
              angular.element('.details-data').hide();
              angular.element('.details-card-loading-spinner').show();
            });

            loadProviderDetails();
          },
        ],
      };
    });
})();
