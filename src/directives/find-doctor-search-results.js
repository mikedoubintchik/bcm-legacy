/**
 * Directive for the findDoctorBrowser.
 *
 * @namespace Directives
 * @class findDoctorBrowser
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.findDoctorSearchResults', [])
    .directive('findDoctorSearchResults', [
      function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'partials/find-doctor-search-results.html',
          scope: {
            searchResultsDetails: '=',
          },
          controller: [
            '$scope',
            '$rootScope',
            '$element',
            '$location',
            '$timeout',
            '$compile',
            'restService',
            'languageService',
            'TransparencyFactory',
            'helpService',
            'geoLocationService',
            'alertService',
            '$route',
            'adobeService',
            'analyticConstants',
            'findDoctorService',
            function (
              $scope,
              $rootScope,
              $element,
              $location,
              $timeout,
              $compile,
              restService,
              languageService,
              TransparencyFactory,
              helpService,
              geoLocationService,
              alertService,
              $route,
              adobeService,
              analyticConstants,
              findDoctorService
            ) {
              $scope.loc = $rootScope.loc;
              $scope.gotoView = $rootScope.gotoView;
              $scope.noMatchPlanFound = $rootScope.noMatchPlanFound;
              $scope.noResultsFound = false;
              $scope.noResultsFoundMapView = false;
              $scope.mustBeNCZipError = false;
              $scope.loadMoreResults = false;
              $scope.language = $rootScope.language || 'en';
              $scope.openInBrowser = $rootScope.openInBrowser;
              $scope.googleMapsResults = null;
              $scope.displayResult = null;
              $scope.contentString = null;
              $scope.estimatedAmount = null;
              $scope.lastWindowOpened = null;
              $rootScope.OpenDetailsPageFromMapView = 'list';
              var infowindow = new google.maps.InfoWindow({});
              $scope.selectedProviderResult = null;
              $scope.backProviderString = null;
              $rootScope.latlon = null;
              $scope.searchAgain = false;
              $scope.outOfNC = false;
              $scope.pcpError = false;
              $scope.isSmartShopperEligible = $rootScope.isSmartShopperEligible;

              if ($scope.searchResultsDetails.metadata.pages.next !== null) {
                $scope.loadMoreResults = true;
              }

              // initialize active tab to list view by default or to map view when navigate to details page from mapview.
              $scope.activeTab = $rootScope.openMapView ? 'map' : 'list';

              $scope.generateMapView = function() {
                // restrict map elements to first 30 results
                var results = $scope.googleMapsResults
                  ? $scope.googleMapsResults
                  : $scope.searchResultsDetails.results;

                //creating a newResultArray to get the locations list.
                var coordsArray = results.map(function(location) {
                  return (
                    String(location.longitude) + ',' + String(location.latitude)
                  );
                });

                var nonDuplicateCoords = coordsArray.filter(function(
                  coordsPair,
                  index
                ) {
                  return coordsArray.lastIndexOf(coordsPair) === index;
                });

                var newResultsArray = nonDuplicateCoords.map(function(
                  coordsPair
                ) {
                  return results.filter(function(provider) {
                    return (
                      String(provider.longitude) +
                      ',' +
                      String(provider.latitude) ===
                      coordsPair
                    );
                  });
                });

                var div = $element.find('#find-doctor-search-results-map-view');
                var initialZoomLevel =
                  $rootScope.currentZoom && $rootScope.currentZoom < 15
                    ? $rootScope.currentZoom
                    : 15;
                var map = null;
                if (results.length !== 0) {
                  // calculate bounds of initial map display
                  var bounds = new google.maps.LatLngBounds();
                  for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    result.index = i;
                    var myLatLng = new google.maps.LatLng(
                      result.latitude,
                      result.longitude
                    );
                    bounds.extend(myLatLng);
                  }

                  // Create a Google Maps display initialize to fit the markers that are on display
                  map = new google.maps.Map(div[0], {
                    disableDefaultUI: true,
                    clickableIcons: false,
                    zoom: initialZoomLevel,
                    center: bounds.getCenter(),
                  });
                  map.fitBounds(bounds, 10);
                  // reset zoom when bounds change
                  google.maps.event.addListenerOnce(
                    map,
                    'bounds_changed',
                    function(event) {
                      if (map.getZoom() > 20) {
                        map.setZoom(initialZoomLevel);
                      }
                    }
                  );
                } else {
                  // load map without markers when no results found
                  geoLocationService
                    .getNearestCityByZip(
                      $rootScope.searchAreaNearestCity
                        ? $rootScope.searchAreaNearestCity.zip
                        : TransparencyFactory.getCity().zip
                    )
                    .then(function(nearestPosition) {
                      map = new google.maps.Map(div[0], {
                        disableDefaultUI: true,
                        clickableIcons: false,
                        zoom: initialZoomLevel,
                        center: nearestPosition,
                      });
                      $scope.map = map;
                      map.addListener('dragend', $scope.onMapMove);
                      map.addListener('zoom_changed', $scope.onMapZoomChange);
                    })
                    .catch(function(error) {
                      return error;
                    });
                  return 0;
                }
                $scope.map = map;
                $timeout(
                  function() {
                    $scope.map.addListener('dragend', $scope.onMapMove);
                    $scope.map.addListener(
                      'zoom_changed',
                      $scope.onMapZoomChange
                    );
                    infowindow.close();
                  },
                  100,
                  false
                );

                google.maps.event.addListener($scope.map, 'click', function(
                  event
                ) {
                  if (infowindow && $scope.activeMarker) {
                    $scope.closeInfoWindow();
                    $('#_search-button').removeClass('hidden');
                  }
                });

                $scope.closeInfoWindow = function() {
                  infowindow.close();
                  $scope.activeMarker.setIcon('images/Map Pin - Default.png');
                  $scope.activeMarker = null;
                };

                //reset currentZoom to null
                $rootScope.currentZoom = null;
                return newResultsArray;
              };

              /**
               * Handles toggeling between list view and map view
               *
               * @memberof FindDoctorSearchResultsController
               * @method switchTab
               */
              $scope.switchTab = function(tabName) {
                $scope.activeTab = tabName;
                $scope.activeMarker = null;

                if (tabName == 'map') {
                  if (!$scope.noResultsFoundMapView) {
                    $scope.searchAgain = false;
                  }
                  if ($scope.noResultsFound || $scope.outOfNC) {
                    $scope.searchAgain = true;
                  }
                  $rootScope.openMapView = true;
                  if ($rootScope.mapsReady) {
                    $timeout(
                      function() {
                        $scope.generateMarkers();
                      },
                      1,
                      false
                    );
                  }
                } else {
                  $rootScope.openMapView = false;

                  if ($scope.outOfNC) {
                    $scope.searchResultsDetails.summary =
                      '0 ' + $scope.loc.RESULTS;
                    $scope.searchResultsDetails.results = [];
                    $scope.searchResultsDetails.metadata = null;
                    $scope.loadMoreResults = false;
                  }
                }
              };

              $scope.generateMarkers = function() {
                var newResultsArray = $scope.generateMapView();
                if (newResultsArray.length === 0) {
                  return;
                }
                for (var i = 0; i < newResultsArray.length; i++) {
                  var resultValue = newResultsArray[i];
                  var resultIn = null;
                  $scope.lastWindow = null;
                  resultIn = newResultsArray[i][0];
                  var marker = null;

                  var position = {
                    lat: resultIn.latitude,
                    lng: resultIn.longitude,
                  };
                  if (resultValue.length > 1) {
                    var markerLabel = resultValue.length;
                    marker = new google.maps.Marker({
                      position: position,
                      map: $scope.map,
                      result: resultValue,
                      title: resultIn.title,
                      animation: google.maps.Animation.DROP,
                      icon: 'images/Map Pin - Default.png',
                      label: {
                        text: markerLabel.toString(),
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold',
                      },
                    });
                  } else {
                    marker = new google.maps.Marker({
                      position: position,
                      map: $scope.map,
                      result: resultValue,
                      title: resultIn.title,
                      animation: google.maps.Animation.DROP,
                      icon: 'images/Map Pin - Default.png',
                    });
                  }

                  // open info window when user clicks on marker
                  marker.addListener(
                    'click',
                    (function(marker) {
                      return function() {
                        $scope.activeMarker = marker;
                        $scope.displayResult = null;
                        $('#_search-button').addClass('hidden');
                        if (marker.result.length > 1) {
                          //multiple providers in the same location
                          $scope.displayResult = marker.result;

                          $scope.contentString =
                            '<div class="browser-item-card">';
                          $scope.contentString +=
                            '<div class="card-description maps-name-display">' +
                            $scope.displayResult[0].title +
                            '<br></div>';
                            if($scope.displayResult[0].label){
                              $scope.contentString +=
                              '<div><span class="tier p1 blue">'+
                              $scope.displayResult[0].label +
                              '</span></div>';
                            }

                          $scope.contentString +=
                            '<div class="card-description address-font-size maps-address-display">' +
                            $scope.displayResult[0].address1 +
                            '</div>' +
                            '<div class="card-description address-font-size maps-address-display">' +
                            $scope.displayResult[0].address2 +
                            '</div>' +
                            '<div class="card-description distance-font-size maps-address-display">' +
                            '(' +
                            $scope.displayResult[0].distance +
                            $scope.displayResult[0].distanceLabel +
                            ')' +
                            '</div>';

                          $scope.contentString +=
                            '<div class="view-details-buttons"><br>' +
                            '<button class = "google-maps-info-window-buttons google-left-button view-details" type="button" ng-click="onMapItemDirectionsClick(' +
                            $scope.displayResult[0].index +
                            ')">' +
                            $scope.loc.FIND_CARE_OPEN_IN_MAPS +
                            '</button> ' +
                            '</div>';

                          $scope.contentString +=
                            "<hr class='providers-line provider-line-top-border'><div class='providers-font-size providers-list card-bottom' ng-click= 'viewAllProvidersLocation()'><span class='med-light-blue'>" +
                            $scope.loc
                              .FIND_CARE_MAPS_VIEW_ALL_PROVIDERS_AT_LOCATION +
                            "</span><i class='fc-right-caret go-next'></i></div>";

                          $scope.contentString += '</div>';
                        } else {
                          $scope.displayResult = marker.result[0];
                          $scope.estimatedAmount = $scope.displayResult
                            .costToMember
                            ? $scope.displayResult.costToMember.toLocaleString(
                              'en-US',
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: 'USD',
                              }
                            )
                            : null;

                          $scope.contentString =
                            '<div class="browser-item-card">';
                          if (
                            $scope.displayResult.providerName !==
                            $scope.displayResult.title
                          ) {
                            $scope.contentString +=
                              '<div class="card-description maps-name-display"><span>' +
                              $scope.displayResult.providerName +
                              $scope.displayResult.degrees +
                              '</span><br></div>' +
                              '<div class="card-description address-font-size maps-address-display">' +
                              $scope.displayResult.title +
                              '<br></div>';
                          } else {
                            $scope.contentString +=
                              '<div class="card-description maps-name-display">' +
                              $scope.displayResult.title +
                              '<br></div>';
                          }
                          if($scope.displayResult.label){
                            $scope.contentString +=
                            '<div><span class="tier p1 blue">'+
                            $scope.displayResult.label +
                            '</span></div>';
                          }
                          $scope.contentString +=
                            '<div class="card-description address-font-size maps-address-display">' +
                            $scope.displayResult.address1 +
                            '</div>' +
                            '<div class="card-description address-font-size maps-address-display">' +
                            $scope.displayResult.address2 +
                            '</div>' +
                            '<div class="card-description distance-font-size maps-address-display">' +
                            '(' +
                            $scope.displayResult.distance +
                            $scope.displayResult.distanceLabel +
                            ')' +
                            '</div>';
                          if ($scope.estimatedAmount) {
                            $scope.contentString +=
                              '<div class="med-blue mt2">' +
                              $scope.loc
                                .SEARCH_RESULTS_ESTIMATE_TO_YOU_UPPER_CASE +
                              '<b>' +
                              $scope.estimatedAmount +
                              '</b></div>';
                          }

                          $scope.contentString +=
                            '<div class="view-details-buttons single-provider-buttons"><br>' +
                            '<button class = "google-maps-info-window-buttons google-right-button view-details" type="button" ng-click="onMapItemDetailsClick(' +
                            $scope.displayResult.index +
                            ')">' +
                            $scope.loc.FIND_CARE_VIEW_DETAILS +
                            '</button> ' +
                            '<button class = "google-maps-info-window-buttons google-left-button view-details" type="button" ng-click="onMapItemDirectionsClick(' +
                            $scope.displayResult.index +
                            ')">' +
                            $scope.loc.FIND_CARE_OPEN_IN_MAPS +
                            '</button> ' +
                            '</div>';

                          $scope.contentString += '</div>';
                        }

                        var compiled = $compile($scope.contentString)(
                          $scope
                        )[0];

                        infowindow.setContent(compiled);
                        infowindow.open($scope.map, marker);

                        $scope.viewAllProvidersLocation = function() {
                          $scope.viewAllProvidersContentString =
                            '<div class="browser-item-card">' +
                            '<div class="provider-location-text" >' +
                            $scope.loc.FIND_CARE_PROVIDERS_AT_THIS_LOCATION +
                            '</div>' +
                            '<hr class="providers-line provider-line-bottom-border"><div class="provider-location-list">';
                          $scope.viewAllProvidersContentString =
                            $scope.viewAllProvidersContentString +
                            $scope.displayResult
                              .map(function(result) {
                                $scope.resultSelected = JSON.stringify(result);
                                return (
                                  "<div class='med-light-blue providers-font-size translate-x' ng-click='selectProvider(" +
                                  $scope.resultSelected +
                                  ")'><span>" +
                                  result.providerName +
                                  '</span><br></div>'
                                );
                              })
                              .join('') +
                            '</div></div>';

                          $scope.backProviderString =
                            $scope.viewAllProvidersContentString;

                          infowindow.setContent(
                            $compile($scope.viewAllProvidersContentString)(
                              $scope
                            )[0]
                          );
                        };

                        $scope.selectProvider = function(res) {
                          $scope.estimatedAmount = res.costToMember
                            ? res.costToMember.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                              style: 'currency',
                              currency: 'USD',
                            })
                            : null;

                          $scope.providerContentString =
                            '<div class="browser-item-card">';
                          if (res.providerName !== res.title) {
                            $scope.providerContentString +=
                              '<div class="card-description maps-name-display"><span>' +
                              res.providerName +
                              res.degrees +
                              '</span><br></div>';
                          }
                          $scope.providerContentString +=
                            '<div class="card-description maps-address-display">' +
                            res.title +
                            '<br></div>' +
                            '<div class="card-description maps-address-display">' +
                            res.address1 +
                            '</div>' +
                            '<div class="card-description maps-address-display">' +
                            res.address2 +
                            '</div>' +
                            '<div class="card-description maps-address-display distance-font-size">' +
                            '(' +
                            res.distance +
                            res.distanceLabel +
                            ')' +
                            '</div>';
                          if ($scope.estimatedAmount) {
                            $scope.providerContentString +=
                              '<div class="med-blue mt2">' +
                              $scope.loc
                                .SEARCH_RESULTS_ESTIMATE_TO_YOU_UPPER_CASE +
                              '<b>' +
                              $scope.estimatedAmount +
                              '</b></div>';
                          }

                          $scope.providerContentString +=
                            '<div class="view-details-buttons"><br>' +
                            '<button class = "google-maps-info-window-buttons google-right-button view-details" type="button" ng-click="onMapItemDetailsClick(' +
                            res.index +
                            ')">' +
                            $scope.loc.FIND_CARE_VIEW_DETAILS +
                            '</button> ' +
                            '<button class = "google-maps-info-window-buttons google-left-button view-details" type="button" ng-click="onMapItemDirectionsClick(' +
                            res.index +
                            ')">' +
                            $scope.loc.FIND_CARE_OPEN_IN_MAPS +
                            '</button> ' +
                            '</div>';

                          $scope.providerContentString +=
                            "<hr class='providers-line provider-line-top-border'><div class='providers-font-size pb3 providers-list card-bottom' ng-click= 'backToProviders()'><i class='fc-left go-previous'></i><span class='med-light-blue'>" +
                            $scope.loc
                              .FIND_CARE_MAPS_BACK_TO_PROVIDERS_AT_LOCATION +
                            '</span></div>';

                          $scope.providerContentString += '</div>';

                          infowindow.setContent(
                            $compile($scope.providerContentString)($scope)[0]
                          );
                        };

                        $scope.backToProviders = function() {
                          infowindow.setContent(
                            $compile($scope.backProviderString)($scope)[0]
                          );
                        };

                        if ($scope.lastWindow) {
                          $scope.lastWindow.setIcon(
                            'images/Map Pin - Default.png'
                          );
                        }

                        marker.setIcon('images/Map Pin - Selected.png');
                        $scope.lastWindow = marker;
                        $scope.lastWindowOpened = marker;
                      };
                    })(marker, i)
                  );
                } //end of for
              };

              $scope.onMapZoomChange = function() {
                $scope.onMapMove();

                var bounds = $scope.map.getBounds();
                var center = $scope.map.getCenter();
                $rootScope.currentZoom = $scope.map.getZoom();
                var conversionFactor = 0.000621371192;
                if (bounds && center) {
                  var eastBoundLng = bounds.getNorthEast().lng();
                  var eastBoundPosition = new google.maps.LatLng(
                    center.lat(),
                    eastBoundLng
                  );
                  // Calculate radius (in meters).
                  var radius = google.maps.geometry.spherical.computeDistanceBetween(
                    center,
                    eastBoundPosition
                  );
                  $rootScope.currentRadius = Math.round(
                    radius * conversionFactor
                  );
                  $rootScope.currentRadius =
                    $rootScope.currentRadius === 0
                      ? 1
                      : $rootScope.currentRadius;
                }
              };

              $scope.onMapMove = function() {
                $scope.searchAgain = true;
                $scope.noResultsFoundMapView = false;
                $scope.mustBeNCZipError = false;
                infowindow.close();
                $scope.newCenterGeo = $scope.map.getCenter();
                if ($scope.lastWindowOpened) {
                  $scope.lastWindowOpened.setIcon(
                    'images/Map Pin - Default.png'
                  );
                }
                $scope.$apply();
              };

              // Back to mapview from details page when navigate to details page from mapview
              if ($rootScope.openMapView) {
                $scope.switchTab('map');
              }

              $scope.onMapItemDetailsClick = function(idx) {
                var result = $scope.searchResultsDetails.results[idx];
                $rootScope.OpenDetailsPageFromMapView = 'map';
                $scope.resultsDetailsPage(
                  idx,
                  result.procedureName || result.providerName,
                  result.preposition,
                  {
                    label: result.label,
                    style: result.style,
                  },
                  result,
                  (result.smartShopperIncentiveAmount) ? result.smartShopperIncentiveAmount : null
                );
              };

              $scope.onMapItemDirectionsClick = function(idx) {
                const mapResult = $scope.searchResultsDetails.results[idx];
                const mapLocation =
                  mapResult.address1 + ' ' + mapResult.address2;

                adobeService.trackAction(
                  'healthNavOpenInMaps',
                  analyticConstants.HEALTHNAV_SECTION
                );
                alertService
                  .showAlert(
                    $scope.loc.EXTERNAL_LINK,
                    $scope.loc.EXTERNAL_LINK_WARNING,
                    {
                      title: $scope.loc.CONTINUE,
                      color: 'blue',
                    },
                    {
                      title: $scope.loc.CANCEL,
                    }
                  )
                  .then(function() {
                    $rootScope.blurContent = false;
                    geoLocationService.openMaps(mapLocation);
                  });
              };

              TransparencyFactory.setResultsToShare(
                $scope.searchResultsDetails
              );
              TransparencyFactory.setExistingSearchResults(
                $scope.searchResultsDetails
              );

              if (!$rootScope.loggedIn) {
                languageService
                  .getLocale($scope.language)
                  .then(function(localeReturned) {
                    $scope.loc = localeReturned;
                  })
                  .catch(console.warn);
              }

              if (
                $scope.searchResultsDetails.results.length === 0 &&
                !$scope.mustBeNCZipError
              ) {
                $scope.noResultsFound = true;
                $scope.noResultsFoundMapView = true;
              }
              var geo_location = TransparencyFactory.getCity().geo
                  ? TransparencyFactory.getCity().geo
                  : $rootScope.vitalsGeoCoords;

              $scope.resultsDetailsPage = function(
                selectedIndex,
                selectedItem,
                selectedPreposition,
                selectedItemLabel,
                itemData,
                smartShopperIncentiveAmount
              ) {
                $rootScope.detailsFromBackButton = false;

                if (smartShopperIncentiveAmount) {
                  TransparencyFactory.setSmartShopperTerm(selectedItem, selectedPreposition);
                  TransparencyFactory.setSmartShopperResultItem(smartShopperIncentiveAmount);
                }


                TransparencyFactory.setResultsDetailsIndex(selectedIndex)
                  .setResultsDetailsTerm(selectedItem)
                  .setResultsDetailsItemLabel(selectedItemLabel)
                  .setResultDetailsItem(itemData);


                $rootScope.healthNavTrackActions(2, {});

                // if procedure
                if (itemData.costToMember) {
                  TransparencyFactory.setResultsProcedureId(
                    itemData.procedure_id
                  );
                }

                // View url.
                var viewUrl =
                  '/find-doctor-results-details?searchTerm=' +
                  $location.search().searchTerm +
                  '&location=' +
                  itemData.location_id +
                  '&provider=' +
                  itemData.provider_id +
                  '&geo_location=' +
                  geo_location +
                  (itemData.costToMember
                    ? '&procedure_id=' + itemData.procedure_id
                    : '') +
                  '&resultsProviderName=' + itemData.name +
                  '&isPcpFlow=' +
                  itemData.isPcpFlow;

                // Go to view.
                $rootScope.gotoView(viewUrl);
              };

              $scope.gotoDetailsPage = function(providerList) {
                var requestParms = null;
                  if (providerList.vendorSource === 'Nuna'){
                    providerList.fullName = providerList.firstName + ' ' + providerList.middleInitial + ' ' + providerList.lastName;
                    providerList.zipCode = providerList.fullAddress.substring(providerList.fullAddress.length - 5);
                  }
                  TransparencyFactory.setResultsDetailsTerm(providerList.fullName);
                  requestParms = {
                    network_id: $rootScope.selectedPlan && $rootScope.selectedPlan.id,
                    accountId: $rootScope.selectedPlan && $rootScope.selectedPlan.accountId,
                    planName: ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) ? $rootScope.selectedPlan.lobDesc : $rootScope.selectedPlan.name,
                    zipCode: providerList.zipCode,
                    locationName: encodeURIComponent(providerList.practiceName),
                    doctorName: providerList.fullName
                  };
                $rootScope.$emit('pageLoading');

                findDoctorService.getDoctorDetails(requestParms)
                  .then(function(doctorResult) {
                    console.log(doctorResult);
                    if (doctorResult.results && doctorResult.results.length) {
                      var viewUrl = '/find-doctor-results-details?searchTerm=' +
                      $location.search().searchTerm +
                        '&location=' + doctorResult.results[0].location_id +
                        '&provider=' + doctorResult.results[0].provider_id +
                        '&geo_location=' +
                        geo_location +
                        '&isPcpFlow=' +
                        providerList.isPcpFlow;
                      // Go to view.
                      $rootScope.gotoView(viewUrl);
                    } else {
                      $rootScope.$emit('pageLoaded');
                      $scope.pcpError = true;
                      return;
                    }
                  }).catch(function(error) {
                    $rootScope.$emit('pageLoaded');
                    $scope.pcpError = true;
                    return error;
                  });
              };

              $scope.searchThisArea = function () {
                $rootScope.openMapView = true;

                // var bounds = $scope.map.getBounds();
                var center = $scope.map.getCenter();

                // get new center city
                geoLocationService
                  .getNearestCity(center)
                  .then(function(result) {
                    $rootScope.searchAreaNearestCity = result;
                    $rootScope.searchAreaNearestCity.cityFullName =
                      result.city +
                      ', ' +
                      result.state_code +
                      ' - ' +
                      result.zip;

                    // validate NC zip code
                    if (
                      TransparencyFactory.validateZipCode(result.zip).status
                    ) {
                      $rootScope.newCity = $rootScope.city;
                      $rootScope.city = false;
                      $scope.getSearchAgainResults();
                      if ($rootScope.mapsReady) {
                        $timeout(
                          function() {
                            $scope.generateMarkers();
                          },
                          1,
                          false
                        );
                      }
                    } else {
                      $scope.outOfNC = true;
                      $scope.mustBeNCZipError = true;
                      $scope.searchAgain = false;
                    }
                  })
                  .catch(function(error) {
                    return error;
                  });
              };

              /**
               * Retrieves additional find a doctor search results.
               * Called when the "Load More Results" button is clicked.
               */
              $scope.fetchAdditionalResults = function() {
                // Use the query created inside the controller
                var query = $scope.$parent.query;

                // Increment the requested page
                query.page = $scope.searchResultsDetails.metadata.pages.next;

                //Add locale so localization will work in node layer
                query.lang = $rootScope.language;

                // Get the data for the next page
                var pageName = 'find-doctor-search-results';
                $rootScope.$emit('pageLoading');
                restService
                  .getPageData(
                    restService.devices.MOBILE,
                    pageName,
                    $rootScope.language,
                    query
                  )
                  .then(function(resultReceived) {
                    $rootScope.$emit('pageLoaded');

                    // Select the appropriate data element
                    var searchResults = null;
                    resultReceived.forEach(function(component) {
                      if (component.name === 'findDoctorSearchResults') {
                        searchResults = component.values.searchResultsDetails;
                      }
                    });

                    // Update the page metadata returned
                    $scope.searchResultsDetails.metadata =
                      searchResults.metadata;

                    // Hide "Load More Results" button if next page is 'null'
                    if (
                      $scope.searchResultsDetails.metadata.pages.next === null
                    ) {
                      $scope.loadMoreResults = false;
                    }

                    $scope.googleMapsResults = searchResults.results;

                    // Concatenate additional results to existing results array
                    $scope.searchResultsDetails.results = $scope.searchResultsDetails.results.concat(
                      searchResults.results
                    );

                    // Update TransparencyFactory existingSearchResults field
                    TransparencyFactory.setExistingSearchResults(
                      $scope.searchResultsDetails
                    );

                    $rootScope.healthNavTrackStates(1, query);
                  })
                  .catch(function(error) {
                    if ($rootScope.loggedIn) {
                      $rootScope.showNetworkErrorAlert();
                    } else {
                      $rootScope.showNetworkErrorUnautenticated();
                    }
                  });
              };

              /**
               * Retrieves search again find a doctor search results.
               * Called when the "Search this area" button is clicked.
               */
              $scope.getSearchAgainResults = function() {
                var lat = $scope.newCenterGeo.lat();
                var lng = $scope.newCenterGeo.lng();
                $rootScope.latlon = lat + ',' + lng;
                $route.updateParams({
                  latlon: $rootScope.latlon,
                  zipCode: $rootScope.searchAreaNearestCity.zip,
                  distance: $rootScope.currentRadius,
                  cityFullName: $rootScope.searchAreaNearestCity.cityFullName,
                });
              };

              $scope.openModal = function(e) {
                e.stopPropagation();
                $rootScope.headerTerm = $scope.searchResultsDetails.tierInformation.modalHeader;
                $scope.helpInfo = {
                  tierModalText: $scope.searchResultsDetails.tierInformation.modalText,
                  tierInfo: true
                };
                helpService.help($scope.helpInfo);
            };
            },
          ],
        };
      },
    ]);
})();
