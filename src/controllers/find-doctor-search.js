/**
 * Controller for the Find A Doctor Search view.
 *
 * @namespace Controllers
 * @class FindDoctorSearchController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.findDoctorSearch', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('FindDoctorSearchController', [
            '$scope',
            '$rootScope',
            '$location',
            'pageService',
            'TransparencyFactory',
            function($scope, $rootScope, $location, pageService, TransparencyFactory) {
              if ($rootScope.loggedIn) {
                $rootScope.pageTitle = $rootScope.loc.FIND_CARE;
                $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;
                $rootScope.showNav = true;
                $rootScope.showPolicySelect = (!$rootScope.noMatchPlanFound) ? true : false;
              }
                /**
                 * Returns the current environment, if not PROD.
                 *
                 * @memberof findDoctorSearchDetails
                 * @return {String} The environment name.
                 */
                /**
                 * Retrieves the page HTML from the page service. Called on view load.
                 *
                 * @memberof FindDoctorSearchController
                 * @method getPage
                 */
                $scope.getPage = function() {
                    /**
                     * The directive HTML for the page.
                     *
                     * @memberof FindDoctorSearchController
                     * @member {String} pageHtml
                     */
                    $scope.pageHtml = '';

                    var query = {};
                    query.loggedIn = $rootScope.loggedIn;
                    query.planName = ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) ? $rootScope.selectedPlan.lobDesc : $rootScope.selectedPlan.name;
                    query.vitalsMatchedPlanName = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.vitalsMatchedPlanName : '';
                    query.planId = $rootScope.selectedPlan && $rootScope.selectedPlan.id;
                    if (query.planName !== 'Medicare Supplement') {
                      query.geo_location = TransparencyFactory.getCity() && TransparencyFactory.getCity().geo ? TransparencyFactory.getCity().geo : $rootScope.vitalsGeoCoords;
                      query.zipCode = TransparencyFactory.getCity().zip;
                    }
                    query.distance = TransparencyFactory.getDistance();
                    query.policyIndex = ($rootScope.loggedIn) ? $rootScope.policyIndex : null;
                    query.policyEffectiveDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null;
                    query.policyExpirationDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null;
                    query.policyExternalId = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null;
                    query.deviceType = $rootScope.device;                    

                    if ($rootScope.vitalsJWT && $rootScope.vitalsSignature && !$rootScope.noMatchPlanFound) {
                      query.jwt = $rootScope.vitalsJWT;
                      query.signature = $rootScope.vitalsSignature.signature;
                    }

                    var pageName = 'find-doctor-search';
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

              $rootScope.$on('policySelected', function() {
                $scope.getPage();
              });

                var findDoctorUnregisterFunc = $rootScope.$on('selectsPlan', function() {
                  if ($location.path() == '/find-doctor-search') { //We want to force the app back to the find-doctor-search view page if the plan is changed while on search page.
                    $location.path('/find-doctor-search');
                  }

                  $scope.getPage();
                });
                $scope.getPage();

            }
        ]);
}());
