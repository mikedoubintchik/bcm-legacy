/**
 * Directive for the faq page.
 *
 * @namespace Directives
 * @class faq
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.faq', [])
    .directive('faq', [
      function () {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/faq.html',
          scope: {
            /**
            * Display information for the faq page.
            *
            * @memberof about
            * @member {Object} faqDetails
            */
            faqDetails: '='
          },
          controller: [
            '$rootScope',
            '$scope',
            '$window',
            '$timeout',
            'adobeService',
            '$location',
            'quickAlertService',
            'TransparencyFactory',
            'geoLocationService',
            function ($rootScope, $scope, $window, $timeout, adobeService, $location, quickAlertService, TransparencyFactory, geoLocationService) {
              $scope.openInBrowser = $rootScope.openInBrowser;
              $scope.openInSecureBrowser = $rootScope.openInSecureBrowser;
              $scope.gotoView = $rootScope.gotoView;
              $scope.loc = $rootScope.loc;
              $scope.policy = ($rootScope.loggedIn) ? $rootScope.policies[$rootScope.selectedPolicy.index] : null;

              $scope.checkBenefitsLink = function() {
                if ($scope.policy.sourceSystem.toLowerCase() === 'amisys') {
                 return $scope.gotoView('/medicare-benefits');
                }
                return $scope.gotoView('/benefits');
              };

              $scope.gotoNavigatedPage = function(url, searchTerm, planDetails) {
                $rootScope.openMapView = false;
                if ($rootScope.vitalsError) {
                  $scope.openAlertModal();
                  return;
                }
                $scope.urltoNavigate = url;
                $scope.searchTermPassed = searchTerm;
                $scope.planDetails = planDetails;
                if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip) {
                  $scope.gotoBrowseLevelPage(url, searchTerm, planDetails);
                } else {
                  TransparencyFactory.setZipRangeNC($scope.faqDetails.geoLocationDetails.distanceDetails.NCZipMin,$scope.faqDetails.geoLocationDetails.distanceDetails.NCZipMax);
                  if (navigator.geolocation) {
                    $rootScope.$emit('pageLoading');
                    $timeout(function(){
                      $rootScope.enableLocation = true;
                    }, 0)
                      .then(function(val) {
                        return geoLocationService.getLocation();
                      })
                      .then(function(response) {
                        $rootScope.$emit('pageLoaded');
                        if (response.data && response.data.zip) {
                          $rootScope.city = response.data;
                          $rootScope.city.cityFullName = $rootScope.city.city + $rootScope.city.state_code + ' - ' + $rootScope.city.zip;
                          $rootScope.currentCity = $rootScope.city;
                          $rootScope.vitalsGeoCoords = response.data.geo;
                          $rootScope.distance = 25; // TODO default value, figure out how this really should be set
                          TransparencyFactory.setDistance($rootScope.distance);
                          TransparencyFactory.setCity($rootScope.city);
                          TransparencyFactory.setCurrentLocationZipCode(response.data.zip);
                          TransparencyFactory.setGeoLocationStatus(true);
                          TransparencyFactory.setLocationBlocked(false);
                          $rootScope.city.cityFullName = $scope.faqDetails.geoLocationDetails.distanceDetails.currentLocation;
                          $scope.gotoBrowseLevelPage(url, searchTerm, planDetails);
                        } else if (response === 'position not found') {
                          TransparencyFactory.setLocationBlocked(true);
                          TransparencyFactory.setGeoLocationStatus(false);
                          TransparencyFactory.setLocationMsg($scope.faqDetails.geoLocationDetails.locationMsg);
                          $scope.modalObj.values.NCZipCheck = $rootScope.selectedPlan.isNorthCarolinaPlan;
                          $scope.openModal();
                        } else {
                          TransparencyFactory.setLocationBlocked(false);
                          TransparencyFactory.setGeoLocationStatus(false);
                          $rootScope.$emit('pageLoaded');
                          $scope.modalObj.values.locationNotFound = true;
                          $scope.openModal();
                        }
                      })
                      .catch(function(error) {
                        TransparencyFactory.setLocationBlocked(false);
                        $rootScope.$emit('pageLoaded');
                        $scope.modalObj.values.locationNotFound = true;
                        $scope.openModal();
                      });
                  } else {
                    $rootScope.$emit('pageLoaded');
                    TransparencyFactory.setLocationBlocked(true);
                    TransparencyFactory.setLocationMsg($scope.faqDetails.geoLocationDetails.locationMsg);
                    $scope.modalObj.values.NCZipCheck = $rootScope.selectedPlan.isNorthCarolinaPlan;
                    $scope.openModal();
                  }
                }
              }; 

              $scope.gotoBrowseLevelPage = function(url, searchTerm, planDetails) {
                $rootScope.city = (!$rootScope.city) ? $rootScope.newCity : $rootScope.city;
                $scope.queryString = 'searchTerm='+ searchTerm + '&planName='+ planDetails.planName + '&zipCode=' + TransparencyFactory.getCity().zip + '&distance=' + TransparencyFactory.getDistance() + '&planId=' + $rootScope.selectedPlan.id;
                TransparencyFactory.setSearchTerm(searchTerm);
                (url !== '/find-doctor-browser') ? $rootScope.gotoView(url + '?' + $scope.queryString) : $rootScope.gotoView('/fad-auth/find-doctor');
              };

              $scope.confirmFunc = function(data) {
                $rootScope.city = data.city;
                $rootScope.distance = data.distance;
                TransparencyFactory.setDistance($rootScope.distance);
                TransparencyFactory.setCity($rootScope.city);
                TransparencyFactory.setGeoLocationStatus(false);
                if ($rootScope.noMatchPlanFound){
                  $rootScope.gotoView('/find-care');
                } else if ($scope.urltoNavigate !== 'find-doctor-browser') {
                  $rootScope.gotoView($scope.urltoNavigate);
                } else {
                  $scope.gotoBrowseLevelPage($scope.urltoNavigate, $scope.searchTermPassed);
                }
              };
   
              $scope.modalObj = {
                locationMsg: $scope.faqDetails.geoLocationDetails.locationMsg,
                cancelButton: {
                  title: $scope.loc.CANCEL
                },
                confirmButton: {
                  title: $scope.loc.CONTINUE
                },
                values: {
                  distanceDetails: $scope.faqDetails.geoLocationDetails.distanceDetails,
                  distance : (TransparencyFactory.getDistance()) ? TransparencyFactory.getDistance().toString() : $scope.faqDetails.geoLocationDetails.distanceDetails.distance.toString(),
                  city: TransparencyFactory.getCity()
                }
              };
  
              /**
               * Expands the category by default based on the url params expand
               * $timeout helps to trigger after the document rendered.
               */
              $timeout(function () {
                var itemToExpand = $location.search().expand;
                if (itemToExpand) {
                  var categoryIndex = $scope.faqDetails.buttons[0].categories.findIndex(function(e) {
                    return e.categoryId === itemToExpand;
                  });
                  if (categoryIndex !== -1) {
                    $scope.faqDetails.buttons[0].categories[categoryIndex].expandedDiv = true;
                  }
                }
              }, 0);

              $scope.toggleItem = function (item, id, event) {
                if (!item.expandedDiv) {
                  for (var k = 0; k < $scope.faqDetails.buttons.length; k++) {
                    for (var i = 0; i < $scope.faqDetails.buttons[k].categories.length; i++) {
                      $scope.faqDetails.buttons[k].categories[i].expandedDiv = false;
                    }
                  }
                }
                item.expandedDiv = !item.expandedDiv;
              };

              $scope.toggleInnerItem = function (item, parentId, id, event) {
                if (!item.expandedDiv) {
                  for (var z = 0; z < $scope.faqDetails.buttons.length; z++) {
                    if ($scope.faqDetails.buttons[z].categories[parentId].questions) {
                      for (var w = 0; w < $scope.faqDetails.buttons[z].categories[parentId].questions.length; w++) {
                        $scope.faqDetails.buttons[z].categories[parentId].questions[w].expandedDiv = false;
                      }
                    }
                  }
                }
                item.expandedDiv = !item.expandedDiv;
              };

              $scope.alertModalObj = {
                title: $scope.faqDetails.alertModal && $scope.faqDetails.alertModal.title ? $scope.faqDetails.alertModal.title : '',
                message: $scope.faqDetails.alertModal && $scope.faqDetails.alertModal.message ? $scope.faqDetails.alertModal.message : '',
                confirmBtn: $scope.faqDetails.alertModal && $scope.faqDetails.alertModal.confirmBtn ? $scope.faqDetails.alertModal.confirmBtn : '',
              };

              /**
               * Toggles the quick-alert-modal for sent message if messageSent is true
               *
               * @memberof helpItemGroup
               */
              if ($location.search().messageSent) {
                $rootScope.sentMessage = true;
                $rootScope.sendFaqMessage = true;
                quickAlertService.showQuickAlert({ message: $rootScope.loc.MESSAGE_SENT, color: 'green' });
                $timeout(function () {
                  angular.element('.quick-alert-modal').hide();
                }, 2000);
                var search = angular.copy($location.search());
                delete search.messageSent;
                $location.search(search);
              }
            }
          ]
        };
      }
    ]);
}());
