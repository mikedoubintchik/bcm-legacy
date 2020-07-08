/**
 * Service for getting geo location.
 *
 * @namespace Services
 * @class geoLocationService
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.services.geoLocation', [])
    .service('geoLocationService', [
      '$q',
      '$rootScope',
      '$http',
      '$window',
      'config',
      function($q, $rootScope, $http, $window, config) {
        var url = $rootScope.loggedIn ? config.apiUrl : config.capraApiUrl;
        this.getLocation = function() {
          return $q(function(resolve, reject) {
            navigator.geolocation.getCurrentPosition(
              onGeoSuccess,
              onGeoErrorNotAvailable,
              { timeout: 15000, enableHighAccuracy: true }
            );

            // Function for user allowing location access.
            function onGeoSuccess(position) {
              $http
                .get(
                  url +
                    '/get-nearest-city?lat=' +
                    position.coords.latitude +
                    '&lng=' +
                    position.coords.longitude +
                    (
                      $rootScope.vitalsJWT && $rootScope.vitalsSignature ?
                        ('&signature=' + $rootScope.vitalsSignature.signature + '&jwt=' + $rootScope.vitalsJWT):
                        ''
                    )
                )
                .then(resolve)
                .catch(reject);
            }

            function onGeoErrorNotAvailable(error) {
              resolve('position not found');
            }
          });
        };

        this.openMaps = function(location) {
          if (device.platform == 'iOS') {
            $window.open('maps://?q=' + location, '_system');
          } else {
            $window.open('geo:0,0?q=' + location, '_system');
          }
        };

        // Function to get search area center zip code for search a doctor results Map View.
        this.getNearestCity = function (position) {
          return $http
            .get(
              url +
                '/get-nearest-city?lat=' +
                position.lat() +
                '&lng=' +
                position.lng()
            )
            .then(function(response) {
              var nearestCity = response.data;
              nearestCity.cityFullName = nearestCity.city + ', ' + nearestCity.state_code + ' - ' + nearestCity.zip;
              return nearestCity;
            })
            .catch(function(error) {
              return error;
            });
        };

        // Function to get search area center zip code for search a doctor results Map View.
        this.getNearestCityByZip = function (zipCode) {
          return $http.get(url + '/get-nearest-city-by-zip?zip=' + zipCode)
            .then(function(response) {
              var centerLatLng = {
                lat: +response.data.lat,
                lng: +response.data.lng
              };
              return centerLatLng;
            })
            .catch(function(error) {
              return error;
            });
        };
      },
    ]);
})();
