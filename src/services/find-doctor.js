/**
 * Service to get the provider data from summary.json api call.
 *
 * @namespace Services
 * @class findDoctorService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.findDoctor', [])
    .service('findDoctorService', [
      '$rootScope',
      'config',
      '$http',
      function($rootScope, config, $http) {
        var url = $rootScope.loggedIn ? config.apiUrl : config.capraApiUrl;

        /**
         *  
         *
         * @memberof findDoctorService
         * @method getDoctorDetails
         */
        this.getDoctorDetails = function(params) {
          return $http.get(url + '/find-doctor-by-zipcode?network_id=' + params.network_id + '&accountId=' + params.accountId + '&planName=' + params.planName + '&locationName=' + params.locationName + '&zipCode=' + params.zipCode + '&name=' + params.doctorName, { cache: false })
            .then(function(response) {
              console.log(response.data);
              return response.data;
            })
            .catch(function(error) {
              console.log(error);
              return error;
            });
        };

        this.changePcp = function(changeReq) {
          const changeurl = url + '/change-pcp?';
          changeReq = Object.keys(changeReq)
            .map(function(key) {
              return key + '=' + changeReq[key];
            })
            .join('&');
          return $http.get(changeurl + changeReq)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return error;
            });
        };

        this.changeMultiPcp = function(changeReq) {
          const changeurl = url + '/change-multi-pcp?';
          return $http
            .post(changeurl, changeReq)
            .then(function(response) {
              const changeRes = response.data.map(function(eachMember) {
                return {
                  updateSucceedStatus: eachMember.successIndicator === 'true' ? true : false,
                  dependentNumber: eachMember.applicationMessageText.slice(-2)
                };
              });
              return changeRes;
            })
            .catch(function(error) {
              return error;
            });
        };
      }
    ]);
}());
