/**
 * Service for google maps api.
 *
 * @namespace Services
 * @class googleMapsService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.googleMaps', [])
  .service('googleMapsService', [
    '$rootScope',
    'config',
    function($rootScope, config) {
      var url = $rootScope.loggedIn ? config.apiUrl : config.capraApiUrl;

      /**
       * load 
       *
       * @memberof googleMapsService
       * @method getGoogleMapsApi
       */
      this.getGoogleMapsApi = function() {
        $.get(url + '/get-google-maps')
          .done(function( response ) {
            var googleMapsScript = document.createElement("script");
            googleMapsScript.type = "text/javascript";
            googleMapsScript.innerHTML = response;
            $("head").append(googleMapsScript);
            $rootScope.mapsReady = true;
          })
          .fail(function( error ) {
            return error;
          });
      };
    }
  ]);
}());
