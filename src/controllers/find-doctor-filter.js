/**
 * Controller for the Find A Doctor filter view.
 *
 * @namespace Controllers
 * @class FindDoctorFilterController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.findDoctorFilter', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('FindDoctorFilterController', [
            '$scope',
            '$rootScope',
            '$location',
            'pageService',
            '$window',
            'TransparencyFactory',
            function($scope, $rootScope, $location, pageService, $window, TransparencyFactory) {
                /**
                 * Retrieves the page HTML from the page service. Called on view load.
                 *
                 * @memberof FindDoctorFilterController
                 * @method getPage
                 */
                $scope.getPage = function() {
                    /**
                     * The directive HTML for the page.
                     *
                     * @memberof FindDoctorFilterController
                     * @member {String} pageHtml
                     */
                    $scope.pageHtml = '';

                    /**
                    * For basicNavbar, we have to pass this function
                    * to handle the left click
                    */
                    $scope.basicNavbarLeftClick = function() {

                      $rootScope.fromBackButton = true;

                      // use the first element from filtersData array to set transparency factory
                      var filtersData = $rootScope.filtersDataArr[0] || '';
                      TransparencyFactory.setFilterTierSelectedTerm(filtersData.tierData || '');
                      TransparencyFactory.setFilterSpecialtySelectedTerm(filtersData.specialty || '');
                      TransparencyFactory.setFilterGenderSelectedTerm(filtersData.gender || '');

                      $window.history.back();
                    };

                    var query = $location.search();
                    query.loggedIn = $rootScope.loggedIn;
                    if (!query.zipCode) {
                        query.zipCode = TransparencyFactory.getCity().zip;
                    }
                    if (!query.distance) {
                        query.distance = TransparencyFactory.getDistance();
                    }
                    
                    query.planName = ($rootScope.loggedIn) ? $rootScope.selectedPlan.lobDesc : $rootScope.selectedPlan.name;
                    query.accountId = TransparencyFactory.getSelectedPlan().accountId;
                    query.policyIndex = ($rootScope.loggedIn) ? $rootScope.policyIndex : null;
                    query.policyEffectiveDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null;
                    query.policyExpirationDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null;
                    query.policyExternalId = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null;
                    query.vitalsMatchedPlanName = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.vitalsMatchedPlanName : '';
                    query.deviceType = $rootScope.device;                    

                    if ($rootScope.loggedIn) {
                      $rootScope.showNav = false;
                      query.jwt = $rootScope.vitalsJWT;
                    }

                    var pageName = 'find-doctor-filter';
                    $rootScope.$emit('pageLoading');
                    pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query).then(function(pageHtml) {
                        $rootScope.$emit('pageLoaded');
                        $scope.pageHtml = pageHtml;
                    }, function(error, status) {
                        $rootScope.$emit('pageLoaded');
                        if ($rootScope.loggedIn) {
                          $rootScope.showNetworkErrorAlert();
                        } else {
                          $rootScope.showNetworkErrorUnautenticated();
                        }
                    });
                };
                $scope.getPage();

            }
        ]);
}());
