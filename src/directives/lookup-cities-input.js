(function () {
    'use strict';
    angular.module('blueconnect.mobile.directives.lookupCitiesInput', []).directive('lookupCitiesInput', function () {
        return {
            scope: {
                city: '='
            },
            controller: ['TransparencyFactory', '$http', '$rootScope', '$scope', 'config', '$timeout', function (TransparencyFactory, $http, $rootScope, $scope, config, $timeout) {
                var url = $rootScope.loggedIn ? config.apiUrl : config.capraApiUrl;
                $scope.data = {
                    cities: null,
                    displayCityName: $scope.city ? $scope.city.cityFullName : ''
                };
                $scope.$watch('city', function() {
                    $rootScope.useCurrentLocation = ($scope.city && $scope.city.cityFullName === 'Current Location');
                    if ($scope.city) {
                        $scope.data.displayCityName = $scope.city.cityFullName;
                    }
                });

                $scope.searchCities = function () {
                    $scope.city = {cityFullName: $scope.data.displayCityName};
                    $('#_cities').removeClass('hidden');
                    if ($scope.data.displayCityName) {
                        $timeout(function () {
                            $scope.getCities($scope.data.displayCityName);
                        });
                    } else {
                        $scope.$emit('validate input');
                    }
                };

                $scope.getCities = function (citySearchTerm) {

                    const isNorthCarolinaPlan = TransparencyFactory.getSelectedPlan().isNorthCarolinaPlan;
                    var requestUrl = url + '/cities?radius=' + TransparencyFactory.getDistance() + '&name=' + citySearchTerm + (isNaN(citySearchTerm) ? isNorthCarolinaPlan ? '+nc' : '' : '');

                    $http.get(requestUrl)
                        .then(function (result) {
                            if (result.data && result.data.length > 0) {
                                $scope.data.cities = result.data;
                            } else {
                                $scope.data.cities = [];
                                $scope.data.cities.push({
                                    errorMessage: $rootScope.loc.ERROR_LOCATION_NOT_FOUND
                                });
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                };

                $scope.setCity = function (selectedCity) {
                    $scope.city = selectedCity;
                    $scope.city.cityFullName = selectedCity.city + ", " + selectedCity.state_code + " - " + selectedCity.zip;
                    $scope.data.displayCityName = $scope.city.cityFullName;
                    $scope.$emit('validate input');
                    $scope.$emit('validate city input');
                    $scope.data.cities = [];
                };

            }],
            templateUrl: 'partials/lookup-cities-input.html'
        };
    });
})();