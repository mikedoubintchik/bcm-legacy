(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowInputs', [])
    /**
     * @description
     * Mostly used in parallel with the input field directive
     * @param infoModal {string} takes the name of the modal that it will activate
     */
    .directive('paymentFlowInputLabel', function() {
      return {
        scope: {
          infoModal: '@'
        },
        transclude: true,
        template: '<span class="label-title" ng-transclude></span><i ng-show="infoModal" pf-modal-open="{{infoModal}}" class="fa fc-outlined-help"></i>'
      };
    })
    /**
     *
     * @param {string} placeholder
     * @example <payment-flow-input modal-name="namePassedIntopPfModalDirective"></payment-flow-input>
     */
    .directive('paymentFlowInput', function() {
      return {
        template: [
          '<payment-flow-input-label info-modal="{{modalName}}">{{title}}</payment-flow-input-label>',
          '<input max-length="maxLength" ng-pattern="pattern" match-model match-input="matchInput" ng-model-options="{debounce: 500}" name="{{formLabel}}" ng-model="value" placeholder="{{placeholder}}" type="{{type}}" ng-required="required" ng-disabled="disabled"/>'].join(''),
        scope: {
          title: '@?',
          placeholder: '@?',
          modalName: '@?',
          value: '=',
          pattern: '=?',
          matchInput: '=?',
          formLabel: '@?',
          required: '=?',
          disabled: '=?',
          type: '@?',
          number: '=?',
          maxLength: '=?',
          ngModel: '='
        },
        link: function(scope, elem) {
          elem.find('input').on("keyup", function(ev) {
            //if the input is longer than the max length 
            //if it is not 'Delete', 'Backspace', 'Tab', 'ArrowRight', 'ArrowLeft'
            var input = elem.find('input');
            var value = input.val();
            if (input.val().length > scope.maxLength) {
                input.val(value.substr(0,value.length-1));
                scope.$apply();
                ev.preventDefault();
            } 
          });

          elem.on('cut copy paste', function(event) {
            event.preventDefault();
          });
        }
      };
    })
    .directive('routing', ['config', '$http', '$q', function(config, $http, $q) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, attr, elem, parentCtrl) {
          parentCtrl.$asyncValidators.validRouting = function(modelValue, viewValue) {
            var def = $q.defer();
            if(!scope.required) {
              def.resolve();
            }
            if(scope.required) {
              $http.get(config.apiUrl + '/validate-routing?routingNumber=' + modelValue)
                .then(function(response) {
                  scope.bankName = response.data.bankName;
                  def.resolve();
                })
                .catch(function(error) {
                  console.warn(error.data.error);
                  def.reject();
                });
            }
            return def.promise;
          };
        }
      };
    }])
     /**
     *
     * @param {string} placeholder
     * @example <payment-flow-input modal-name="namePassedIntopPfModalDirective"></payment-flow-input>
     */
    .directive('routingNumberInput', function() {
      return {
        template: [
          '<payment-flow-input-label info-modal="{{modalName}}">{{title}}</payment-flow-input-label>',
          '<input ng-pattern="pattern" routing bank-name="bankName" ng-model-options="{debounce: 500}" name="{{formLabel}}" ng-model="value" placeholder="{{placeholder}}" type="{{type}}" ng-required="required"/>'].join(''),
        scope: {
          title: '@?',
          placeholder: '@?',
          modalName: '@?',
          value: '=',
          pattern: '=?',
          formLabel: '@?',
          required: '=?',
          type: '@?',
          number: '=?',
          bankName: '=?'
        },
        link: function(scope, elem, attr, parentCtrl) {
          var oneKeyCode = 48;
          var zeroKeyCode = 58;
          var backspaceKeyCode = 8;
          var tabKeyCode = 9;
          elem.on('cut copy paste', function(event) {
            event.preventDefault();
          });
          if(scope.number === true) {
            elem.on('keydown', function(event) {
              if((event.keyCode < oneKeyCode || event.keyCode > zeroKeyCode) && event.keyCode != backspaceKeyCode && event.keyCode != tabKeyCode) {
                event.preventDefault();
              }
            });
          }
        }
      };
    })
    /**
     * @description
     * An atttribute to go onto a form input that makes the input valid only if the passed in value
     * matches the viewValue.
     * @example
     * <input match-model match-input="formInputToMatchAgainst" ng-model="someValueOnScope"/>
     */
    .directive('matchModel', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          matchInput: '=?'
        },
        link: function(scope, elem, attr, inputCtrl) {
          inputCtrl.$validators.match = function(modelValue, viewValue) {
            if(scope.matchInput && scope.matchInput.$viewValue) {
              if(scope.matchInput.$viewValue !== inputCtrl.$viewValue) {
               return false;
              }
              return true
            }
            return true;
          };
          if(scope.matchInput) {
            scope.$watch(function() {
              return scope.matchInput.$modelValue;
            }, function() {
              inputCtrl.$validate();
            });
          }

        }
      };
    })
    /**
     * @example
     * <payment-flow-select value="someValueOnScope">
     *   <option value="'checking'" ng-selected="someValueOnScope === 'checking'"></option>
     *   <option value="'savings'" ng-selected="someValueOnScope === 'savings'"></option>
     * </payment-flow-select>
     * @param {string} title
     * @param
     */
    .directive('paymentFlowSelect', function() {
      return {
        transclude: true,
        templateUrl: 'partials/payment-flow-select.html',
        scope: {
          title: '@?',
          modalName: '@?',
          value:"=",
          formLabel: '@?',
          required: '=?'
        },
        controller: ['$scope', '$rootScope', function($scope, $rootScope) {
          $scope.loc = $rootScope.loc;
        }]
      };
    });
})();