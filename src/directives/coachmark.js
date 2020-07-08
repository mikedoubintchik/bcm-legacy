/**
 * @description Directive for the reusable coachmark.
 * @namespace Directives
 * @class coachmark
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.coachmark', [])
    .directive('coachmark', [
      '$q',
      '$rootScope',
      '$timeout',
      'cordovaService',
      'storageService',
      function($q, $rootScope, $timeout, cordovaService, storageService) {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/coachmark.html',
          scope: false,
          link: function ($scope, $element, $attrs) {
            $scope.close = close;
            $scope.show = show;
            $scope.prevPage = prevPage;
            $scope.nextPage = nextPage;
            var localCoachmarksSettings = {};

            function show(coachmarksDataForPage) {
              console.log('coachmarks requested for page %s', coachmarksDataForPage.identifier);
              return getCoachmarksSettings()
                .then(function(coachmarksData) {
                  // if we've already shown the coachmarks to this Member
                  if (coachmarksData[coachmarksDataForPage.identifier] === coachmarksDataForPage.version) {
                    return false;
                  }

                  return showCoachmarksElement(coachmarksDataForPage);
                })
                .then(function(setCoachmarks) {

                })
                .catch(showCoachmarksErrorHandler);
            }

            function showCoachmarksErrorHandler(error) {
              // if we're in the browser, still show coachmarks
              if (error === 'Cordova library not present.') {
                return showCoachmarksElement();
              }

              // if there were no settings related to coachmarks,
              // set those and then show the coachmarks
              if (error.code === 2) {
                return setCoachmarksSettings({})
                  .then(function(setCoachmarksSettingsSuccess) {
                    return show();
                  });
              }
            }

            function showCoachmarksElement(coachmarksDataForPage) {
              $scope.coachmark = coachmarksDataForPage;

              // each valid page must have a highlight object with a property
              // named "target", so we'll filter out the pages w/o this property
              // at the time that this runs, we will check for the presence of the element on the page,
              // and if it doesn't exist at time of execution, we'll skip that specific coachmark.
              $scope.coachmark.pages = $scope.coachmark.pages.filter(function(currentPage) {
                return angular.element(currentPage.highlight.target).length > 0;
              });

              if ($scope.coachmark.pages.length > 0) {
                angular.element('.coachmark').show();
                angular.element('#app-container').addClass('no-scroll');
                postNavigate();
              } else {
                console.log('No coachmark pages to show for page %s', coachmarksDataForPage.identifier, coachmarksDataForPage);
              }
            }

            function nextPage() {
              preNavigate();
              if ($scope.coachmark.currentPage < $scope.coachmark.pages.length - 1) {
                $scope.coachmark.currentPage = $scope.coachmark.currentPage + 1;
                postNavigate();
              }
            };

            function prevPage() {
              if ($scope.coachmark.currentPage > 0) {
                preNavigate();
                $scope.coachmark.currentPage = $scope.coachmark.currentPage - 1;
                postNavigate();
              }
            }

            function preNavigate() {
              if ($scope.coachmark && typeof $scope.coachmark.currentPage === 'undefined') {
                console.warn('No current page but scope is here', $scope.coachmark);
              }
              var currentPage = $scope.coachmark.pages[$scope.coachmark.currentPage];

              // Undo any triggers
              if (currentPage && currentPage.trigger) {
                // Get out of $apply cycle conflicts
                $timeout(function () {
                  angular.element(currentPage.trigger).triggerHandler('click');
                });
              } else {
                console.warn('Current page but no trigger', $scope.coachmark);
              }
            }

            function postNavigate() {
              var currentPage = $scope.coachmark.pages[$scope.coachmark.currentPage];

              if (currentPage && currentPage.trigger) {
                // Get out of $apply cycle conflicts
                $timeout(function () {
                  angular.element(currentPage.trigger).triggerHandler('click');
                });
              } else {
                console.warn('Current page has no trigger', currentPage);
              }

              // Avoid race condition of any triggers
              $timeout(function () {
                if (!currentPage) {
                  return console.warn('No current page but inside of $timeout', $scope);
                }
                var toHighlight = angular.element(currentPage.highlight.target)[0];
                var backdrop = angular.element('.coachmark-backdrop');

                try {
                  toHighlight.scrollIntoView();

                  var position = toHighlight.getBoundingClientRect();

                  backdrop
                    .css('top', position.top)
                    .css('left', position.left)
                    .css('height', position.height)
                    .css('width', position.width)
                    .attr('class', 'coachmark-backdrop')
                    .addClass(currentPage.highlight.style);
                }
                catch (e) {
                  backdrop
                    .css('top', 0)
                    .css('left', 0)
                    .css('height', 0)
                    .css('width', 0)
                    .attr('class', 'coachmark-backdrop');
                }
              }, 50);
            };

            function close() {
              getCoachmarksSettings()
                .then(function(coachmarksData) {
                  // once user has closed coachmarks, save their version
                  coachmarksData[$scope.coachmark.identifier] = $scope.coachmark.version;
                  hideCoachmarksDisplay();
                  return setCoachmarksSettings(coachmarksData);
                })
                .then(function(coachmarksSaved) {

                })
                .catch(function(setCoachmarksSettingsError) {

                });
            };

            function getCoachmarksSettings() {
              if (cordovaService.deviceIsBrowser()) {
                console.log('coachmarks setting', localCoachmarksSettings);
                return $q.resolve(localCoachmarksSettings);
              }
              return storageService.get('coachmarks:' + $rootScope.selectedPolicy.externalId);
            }

            function setCoachmarksSettings(incomingObj) {
              if (cordovaService.deviceIsBrowser()) {
                localCoachmarksSettings = incomingObj;
                console.log('coachmarks setting', localCoachmarksSettings);
                return $q.resolve(localCoachmarksSettings);
              }
              return storageService.set('coachmarks:' + $rootScope.selectedPolicy.externalId, incomingObj);
            }

            function hideCoachmarksDisplay() {
              angular.element('.coachmark').hide();
              angular.element('#app-container').removeClass('no-scroll');
            }
          }
        };
      }
    ]);
 }());
