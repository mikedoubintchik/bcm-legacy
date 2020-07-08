/**
 * Directive for the reusable alert modal.
 *
 * @namespace Directives
 * @class alertModal
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.alertModal', [])
    .directive('alertModal', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/alert-modal.html',
          scope: false,
          controller: [
            '$rootScope',
            function($rootScope) {
              $rootScope.$emit('onBackKeyDown');
            },
          ],
        };
      },
    ])
    /**
     *
     * @example
     * <extendableAlertModal
     *   modal-info="objectForModalContent"
     *   open-modal-fn-alias="nameInOuterScopeOfModalOpenFn"
     *   confirm-fn="functionCalledWhenModalConfirmed">
     * </extendableAlertModal>
     */
    .directive('extendableAlertModal', ['$rootScope', function($rootScope) {
      return {
        restrict: 'E',
        scope: {
          /**
           * @param {Object} modalInfo Properties to populate the modal with
           * @param {string} modalInfo.title
           * @param {string} modalInfo.body
           * @param {Function} modalInfo.result
           * @param {Object} modalInfo.confirmButton
           * @param {string} modalInfo.confirmButton.title
           * @param {string} modalInfo.confirmButton.color
           * @param {Object} modalInfo.cancelButton
           * @param {string} modalInfo.cancelButton.title
           * @param {string} modalInfo.cancelButton.color
           * @param {Function} openModalFn Used by the outer scope to have the modal open itself
           * @param {Function} confirmFunction Action to perform if the users selects the confirm button
           */
          alertModal: '<modalInfo',
          openModalFn: '=openModalFnAlias',
          confirmFn: '<',
        },
        templateUrl: 'partials/alert-modal.html',
        link: function(scope, elem, attr) {
          function toggleModalState(isModalOpen) {
            $rootScope.isModalOpen = isModalOpen;
          }

          scope.openModalFn = function() {
            elem.addClass('show');
            toggleModalState(true);
          };
          scope.alertModal.result = function(userAction) {
            if (!userAction) {
              elem.removeClass('show');
              return;
            }
            elem.removeClass('show');
            scope.confirmFn();
            scope.alertModal.values.city = { cityFullName: '' };
            toggleModalState(false);
          };
        },
      };
    }])

    /**
     *
     * @example
     * <findDoctorZipAlertModal
     *   modal-info="objectForModalContent"
     *   open-modal-fn-alias="nameInOuterScopeOfModalOpenFn"
     *   confirm-fn="functionCalledWhenModalConfirmed">
     * </findDoctorZipAlertModal>
     */
    .directive('findDoctorZipAlertModal', [
      '$rootScope',
      '$window',
      'TransparencyFactory',
      '$location',
      function($rootScope, $window, TransparencyFactory, $location) {
        return {
          restrict: 'E',
          scope: {
            /**
             * @param {Object} modalInfo Properties to populate the modal with
             * @param {Function} modalInfo.result
             * @param {Object} modalInfo.confirmButton
             * @param {string} modalInfo.confirmButton.title
             * @param {string} modalInfo.confirmButton.color
             * @param {Object} modalInfo.cancelButton
             * @param {string} modalInfo.cancelButton.title
             * @param {string} modalInfo.cancelButton.color
             * @param {Function} openModalFn Used by the outer scope to have the modal open itself
             * @param {Function} confirmFunction Action to perform if the users selects the confirm button
             */
            alertModal: '<modalInfo',
            openModalFn: '=openModalFnAlias',
            confirmFn: '<',
          },
          templateUrl: 'partials/find-doctor-zip-alert-modal.html',
          link: function(scope, elem, attr) {
            if (typeof scope.alertModal === "undefined") {
              return;
            }
            function toggleModalState(isModalOpen) {
              $rootScope.isModalOpen = isModalOpen;
            }


            scope.openModalFn = function() {
              // Toggle modal state.
              toggleModalState(true);
              elem.addClass('show');

              scope.alertModal.locationBlocked = TransparencyFactory.getLocationBlocked();
              if (scope.alertModal.values.locationNotFound) {
                scope.isZipValid = false;
                scope.errorText = scope.loc.ERROR_ENTER_CITY_COUNTY_OR_ZIP_CODE;
              } else {
                scope.errorText = '';
              }
            };
            scope.alertModal.result = function(userAction) {
              // User selected cancel.
              if (!userAction) {
                // Try and set city name.
                scope.alertModal.values.city = { cityFullName: '' };
                scope.alertModal.values.distance = TransparencyFactory.getDistance()
                  ? TransparencyFactory.getDistance().toString()
                  : scope.alertModal.values.distanceDetails.distance;
                $rootScope.city = { cityFullName: '' };
                TransparencyFactory.setCity({ cityFullName: '' });
                // Valid and hide modal.
                scope.isZipValid = true;
                scope.isZipDirty = false;
                elem.removeClass('show');

                // If we are logged in, go back.
                if ($location.path() == '/fad-auth/find-doctor') {
                  $window.history.back();
                }

                // Reset modalOpen state.
                toggleModalState(false);

                // Return.
                return;
              }

              // User selected confirm.
              $rootScope.city = scope.alertModal.values.city;
              TransparencyFactory.setCity(scope.alertModal.values.city);
              toggleModalState(false);
              elem.removeClass('show');
              scope.confirmFn(scope.alertModal.values);
            };
          },
          controller: [
            '$rootScope',
            '$scope',
            '$timeout',
            'TransparencyFactory',
            function($rootScope, $scope, $timeout, TransparencyFactory) {
              if (typeof $scope.alertModal === "undefined") {
                return;
              }
              $scope.loc = $rootScope.loc;
              $scope.isZipValid = true;
              $scope.errorText = '';
              $scope.pcp = $scope.alertModal.pcp;

              $scope.$on('validate city input', function() {
                $timeout(function() {
                  $scope.validateCity();
                });
              });

              $scope.validateCity = function() {
                const resp = TransparencyFactory.validateCity(
                  $scope.alertModal.values.city
                );

                // Set error message.
                $scope.isZipValid = resp.status;
                $scope.errorText = resp.message;

                return $scope.isZipValid;
              };

              $scope.detectClickElement = function(event) {
                if (!event.target.id || typeof event.target.id === 'undefined') {
                  $('#_cities').addClass("hidden");
                  $scope.validateCity();
                } else if (event.target.id === 'cancelButton' || event.target.id === 'closeButton') {
                  $('#city-input')[0].value = '';
                  $('#_cities').addClass("hidden");
                }
              };
            },
          ],
        };
      },
    ])
    .directive('findDoctorUnavailableAlertModal', [
      '$rootScope',
      '$window',
      '$location',
      function($rootScope) {
        return {
          restrict: 'E',
          scope: {
            alertModal: '<modalInfo',
            openModalFn: '=openModalFnAlias',
            confirmFn: '<',
          },
          templateUrl: 'partials/find-doctor-unavailable-alert-modal.html',
          link: function(scope, elem, attr) {
            function toggleModalState(isModalOpen) {
              $rootScope.isModalOpen = isModalOpen;
            }

            scope.openModalFn = function() {
              // Toggle modal state.
              toggleModalState(true);
              elem.addClass('show');
            };
            scope.alertModal.result = function() {
              // User selected confirm.
              toggleModalState(false);
              elem.removeClass('show');
            };
          },
        };
      },
    ])
    .directive('findDoctorSelectPcpAlertModal', [
      '$rootScope',
      '$window',
      '$location',
      function($rootScope) {
        return {
          restrict: 'E',
          scope: {
            alertModal: '<modalInfo',
            openModalFn: '=openModalFnAlias',
            confirmFn: '<',
          },
          templateUrl: 'partials/find-doctor-select-pcp-alert-modal.html',
          link: function(scope, elem, attr) {
            function toggleModalState(isModalOpen) {
              $rootScope.isModalOpen = isModalOpen;
            }

            scope.openModalFn = function() {
              // Toggle modal state.
              toggleModalState(true);
              elem.addClass('show');
            };
            scope.alertModal.result = function(userAction, members) {
              // User selected cancel.
              if (!userAction) {

                toggleModalState(false);
                elem.removeClass('show');

                return;
              }
              // User selected confirm.
              toggleModalState(false);
              elem.removeClass('show');
              scope.confirmFn(members);
            };

            scope.alertModal.toggleCheckbox = function(index) {
              scope.alertModal.members[index].SELECTED = !scope.alertModal.members[index].SELECTED;
            };
          },
        };
      },
    ])
    .directive('findDoctorChangePcpAlertModal', [
      '$rootScope',
      '$window',
      '$location',
      function($rootScope) {
        return {
          restrict: 'E',
          scope: {
            alertModal: '<modalInfo',
            openModalFn: '=openModalFnAlias',
            confirmFn: '<',
          },
          templateUrl: 'partials/find-doctor-change-pcp-alert-modal.html',
          link: function(scope, elem, attr) {
            if (typeof scope.alertModal === "undefined") {
              return;
            }
            function toggleModalState(isModalOpen) {
              $rootScope.isModalOpen = isModalOpen;
            }

            scope.openModalFn = function() {
              // Toggle modal state.
              toggleModalState(true);
              elem.addClass('show');
            };
            scope.alertModal.result = function(userAction) {
              // User selected cancel.
              if (!userAction) {

                toggleModalState(false);
                elem.removeClass('show');

                return;
              }
              // User selected confirm.
              toggleModalState(false);
              elem.removeClass('show');
              scope.confirmFn();
            };
          },
        };
      },
    ])
    .directive('findDoctorRefineSearchModal', [
      'TransparencyFactory',
      '$rootScope',
      function(TransparencyFactory, $rootScope) {
        return {
          restrict: 'E',
          scope: {
            /**
             * @param {Object} modalInfo Properties to populate the modal with
             * @param {Function} modalInfo.result
             * @param {Object} modalInfo.confirmButton
             * @param {string} modalInfo.confirmButton.title
             * @param {string} modalInfo.confirmButton.color
             * @param {Object} modalInfo.cancelButton
             * @param {string} modalInfo.cancelButton.title
             * @param {string} modalInfo.cancelButton.color
             * @param {Function} openModalFn Used by the outer scope to have the modal open itself
             * @param {Function} confirmFunction Action to perform if the users selects the confirm button
             */
            alertModal: '<modalInfo',
            openModalFn: '=openModalFnAlias',
            confirmFn: '<',
          },
          templateUrl: 'partials/find-doctor-refine-search-modal.html',
          link: function(scope, elem, attr) {
            function toggleModalState(isModalOpen) {
              $rootScope.isModalOpen = isModalOpen;
            }

            scope.openModalFn = function(query) {
              scope.query = query;
              elem.addClass('show');

              // Toggle modal state.
              toggleModalState(true);
            };

            scope.alertModal.result = function(userAction) {
              elem.removeClass('show');
              if (userAction) {
                scope.confirmFn(scope.alertModal.values, userAction);
              }

              // Toggle modal state.
              toggleModalState(false);
            };
          },
          controller: [
            '$rootScope',
            '$scope',
            'TransparencyFactory',
            function($rootScope, $scope, TransparencyFactory) {
              $scope.loggedIn = $rootScope.loggedIn;
              $scope.medicareUser = ($rootScope.loggedIn && $rootScope.selectedPolicy.sourceSystem === 'Amisys') ? true : false;
              $scope.loc = $rootScope.loc;
            },
          ],
        };
      },
    ])
    .directive('smartShopperConfirmTermsAlertModal', [
      '$rootScope',
      '$window',
      '$location',
      function($rootScope) {
        return {
          restrict: 'E',
          scope: {
            alertModal: '<modalInfo',
            openModalFn: '=openModalFnAlias',
            confirmFn: '<',
          },
          templateUrl: 'partials/smart-shopper-confirm-terms-alert-modal.html',
          link: function(scope, elem, attr) {
            if (typeof scope.alertModal === "undefined") {
              return;
            }
            function toggleModalState(isModalOpen) {
              $rootScope.isModalOpen = isModalOpen;
            }

            scope.openModalFn = function() {

              if ($rootScope.smartShopperTermsAccepted) {
                scope.confirmFn();
                return;
              }
              // Toggle modal state.
              toggleModalState(true);
              elem.addClass('show');
            };
            scope.alertModal.result = function(userAction) {
              // User selected cancel.
              if (!userAction) {

                toggleModalState(false);
                elem.removeClass('show');

                return;
              }
              // User selected confirm.
              toggleModalState(false);
              elem.removeClass('show');
              scope.confirmFn();
            };

          },
          controller: [
            '$rootScope',
            '$scope',
            'helpService',
            function($rootScope, $scope, helpService) {
              if (typeof $scope.alertModal === "undefined") {
                return;
              }
              $scope.loc = $rootScope.loc;
              $scope.alertModal.openTermsDetailsModal = function() {
                $rootScope.headerTerm = $scope.alertModal.termsDetailsModal.title;
                $scope.termsInfo = {
                  contents: {
                    content_1: $scope.alertModal.termsDetailsModal.content_1,
                    content_2: $scope.alertModal.termsDetailsModal.content_2,
                    content_3_1: $scope.alertModal.termsDetailsModal.content_3_1,
                    content_3_2: $scope.alertModal.termsDetailsModal.content_3_2,
                    content_4: $scope.alertModal.termsDetailsModal.content_4,
                    content_5: $scope.alertModal.termsDetailsModal.content_5,
                    content_6: $scope.alertModal.termsDetailsModal.content_6,
                    content_7: $scope.alertModal.termsDetailsModal.content_7,
                    content_8: $scope.alertModal.termsDetailsModal.content_8,
                    content_9: $scope.alertModal.termsDetailsModal.content_9,
                    content_10: $scope.alertModal.termsDetailsModal.content_10,
                    content_11: $scope.alertModal.termsDetailsModal.content_11,
                    content_12: $scope.alertModal.termsDetailsModal.content_12,
                    content_13: $scope.alertModal.termsDetailsModal.content_13,
                    content_14: $scope.alertModal.termsDetailsModal.content_14,
                    content_15: $scope.alertModal.termsDetailsModal.content_15,
                    content_16: $scope.alertModal.termsDetailsModal.content_16,
                    content_17: $scope.alertModal.termsDetailsModal.content_17,
                    content_18: $scope.alertModal.termsDetailsModal.content_18,
                    content_19: $scope.alertModal.termsDetailsModal.content_19,
                    content_20: $scope.alertModal.termsDetailsModal.content_20,
                    content_21: $scope.alertModal.termsDetailsModal.content_21,
                    content_22: $scope.alertModal.termsDetailsModal.content_22,
                    content_23: $scope.alertModal.termsDetailsModal.content_23,
                    content_24: $scope.alertModal.termsDetailsModal.content_24,
                    content_25: $scope.alertModal.termsDetailsModal.content_25,
                    content_26: $scope.alertModal.termsDetailsModal.content_26,
                    content_27: $scope.alertModal.termsDetailsModal.content_27,
                    content_28: $scope.alertModal.termsDetailsModal.content_28,
                    content_29: $scope.alertModal.termsDetailsModal.content_29,
                    content_30: $scope.alertModal.termsDetailsModal.content_30,
                    content_31: $scope.alertModal.termsDetailsModal.content_31,
                    content_32: $scope.alertModal.termsDetailsModal.content_32,
                    content_33: $scope.alertModal.termsDetailsModal.content_33,
                    content_34: $scope.alertModal.termsDetailsModal.content_34,
                    content_35: $scope.alertModal.termsDetailsModal.content_35,
                    content_36: $scope.alertModal.termsDetailsModal.content_36,
                    content_37: $scope.alertModal.termsDetailsModal.content_37,
                    content_38: $scope.alertModal.termsDetailsModal.content_38,
                    content_39: $scope.alertModal.termsDetailsModal.content_39,
                    content_40: $scope.alertModal.termsDetailsModal.content_40,
                    content_41: $scope.alertModal.termsDetailsModal.content_41,
                    content_42: $scope.alertModal.termsDetailsModal.content_42,
                    content_43: $scope.alertModal.termsDetailsModal.content_43,
                    content_44: $scope.alertModal.termsDetailsModal.content_44,
                    content_45: $scope.alertModal.termsDetailsModal.content_45,
                    content_46: $scope.alertModal.termsDetailsModal.content_46,
                    content_47: $scope.alertModal.termsDetailsModal.content_47,
                    content_48: $scope.alertModal.termsDetailsModal.content_48,
                    content_49: $scope.alertModal.termsDetailsModal.content_49,
                    content_50: $scope.alertModal.termsDetailsModal.content_50,
                    content_51: $scope.alertModal.termsDetailsModal.content_51,
                    content_52: $scope.alertModal.termsDetailsModal.content_52,
                    content_53: $scope.alertModal.termsDetailsModal.content_53,
                    content_54: $scope.alertModal.termsDetailsModal.content_54,
                    content_55: $scope.alertModal.termsDetailsModal.content_55,
                    content_56: $scope.alertModal.termsDetailsModal.content_56,
                    content_57: $scope.alertModal.termsDetailsModal.content_57,
                    content_58: $scope.alertModal.termsDetailsModal.content_58,
                    content_59: $scope.alertModal.termsDetailsModal.content_59,
                    content_60: $scope.alertModal.termsDetailsModal.content_60,
                    content_61: $scope.alertModal.termsDetailsModal.content_61,
                    content_62: $scope.alertModal.termsDetailsModal.content_62,
                    content_63: $scope.alertModal.termsDetailsModal.content_63,
                    content_64: $scope.alertModal.termsDetailsModal.content_64,
                    content_65: $scope.alertModal.termsDetailsModal.content_65,
                    content_66: $scope.alertModal.termsDetailsModal.content_66,
                    content_67: $scope.alertModal.termsDetailsModal.content_67,
                    content_68: $scope.alertModal.termsDetailsModal.content_68,
                    content_69: $scope.alertModal.termsDetailsModal.content_69,
                    content_70: $scope.alertModal.termsDetailsModal.content_70,
                    content_71: $scope.alertModal.termsDetailsModal.content_71,
                    content_72: $scope.alertModal.termsDetailsModal.content_72,
                    content_73: $scope.alertModal.termsDetailsModal.content_73,
                    content_74: $scope.alertModal.termsDetailsModal.content_74,
                    content_75: $scope.alertModal.termsDetailsModal.content_75,
                    content_76: $scope.alertModal.termsDetailsModal.content_76,
                    content_77: $scope.alertModal.termsDetailsModal.content_77,
                    content_78: $scope.alertModal.termsDetailsModal.content_78,
                    content_79: $scope.alertModal.termsDetailsModal.content_79,
                    content_80: $scope.alertModal.termsDetailsModal.content_80,
                    content_81: $scope.alertModal.termsDetailsModal.content_81,
                    content_82: $scope.alertModal.termsDetailsModal.content_82,
                    content_83: $scope.alertModal.termsDetailsModal.content_83,
                    content_84: $scope.alertModal.termsDetailsModal.content_84,
                    content_85: $scope.alertModal.termsDetailsModal.content_85,
                    content_86: $scope.alertModal.termsDetailsModal.content_86,
                    content_87: $scope.alertModal.termsDetailsModal.content_87,
                    content_88: $scope.alertModal.termsDetailsModal.content_88,
                    content_89: $scope.alertModal.termsDetailsModal.content_89,
                    content_90: $scope.alertModal.termsDetailsModal.content_90,
                    content_91: $scope.alertModal.termsDetailsModal.content_91,
                    content_92: $scope.alertModal.termsDetailsModal.content_92,
                    content_93: $scope.alertModal.termsDetailsModal.content_93,
                    content_94: $scope.alertModal.termsDetailsModal.content_94,
                    content_95: $scope.alertModal.termsDetailsModal.content_95,
                    content_96: $scope.alertModal.termsDetailsModal.content_96,
                    content_97: $scope.alertModal.termsDetailsModal.content_97,
                    content_98: $scope.alertModal.termsDetailsModal.content_98,
                    content_99: $scope.alertModal.termsDetailsModal.content_99,
                    content_100: $scope.alertModal.termsDetailsModal.content_100,
                    content_101: $scope.alertModal.termsDetailsModal.content_101,
                    content_102: $scope.alertModal.termsDetailsModal.content_102,
                    content_103: $scope.alertModal.termsDetailsModal.content_103,
                    content_104: $scope.alertModal.termsDetailsModal.content_104,
                    content_105: $scope.alertModal.termsDetailsModal.content_105,
                    content_106: $scope.alertModal.termsDetailsModal.content_106,
                    content_107: $scope.alertModal.termsDetailsModal.content_107,
                    content_108: $scope.alertModal.termsDetailsModal.content_108,
                    content_109: $scope.alertModal.termsDetailsModal.content_109,
                    content_110: $scope.alertModal.termsDetailsModal.content_110,
                    content_111: $scope.alertModal.termsDetailsModal.content_111,
                    content_112: $scope.alertModal.termsDetailsModal.content_112,
                    content_113: $scope.alertModal.termsDetailsModal.content_113,
                    content_114: $scope.alertModal.termsDetailsModal.content_114,
                  },
                };
                helpService.terms($scope.termsInfo);
              };
            },
          ],
        };
      },
    ]);
})();