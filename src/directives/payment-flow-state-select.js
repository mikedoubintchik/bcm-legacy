(function() {
  /**
   *
   * @param {string} placeholder
   * @example <payment-flow-state-select title="::loc.state" formLabel="myForm.state"></payment-flow-state-select>
   */
  angular
  .module('blueconnect.mobile.directives.paymentFlowStateSelect', [])
  .directive('paymentFlowStateSelect', function() {
    return {
      template: [
        '<payment-flow-input-label>{{title}}</payment-flow-input-label>',
        '<div class="arrow-row"><i class="fa fc-dropdown"></i></div>',
        '<select name="{{formLabel}}" ng-options="state.value as state.label for state in statesArray" ng-model="value" placeholder="{{placeholder}}" ng-required="required">',
        '</select>'
      ].join(''),
      scope: {
        title: '@?',
        placeholder: '@?',
        value: '=',
        formLabel: '@?',
        required: '=?',
      },
      controller: ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
        $scope.loc = $rootScope.loc;
        $scope.statesArray = [
          {label: $scope.loc.BP_SELECT, value: null},
          {label: $scope.loc.BP_AL, value: 'AL'},
          {label: $scope.loc.BP_AK, value: 'AK'},
          {label: $scope.loc.BP_AZ, value: 'AZ'},
          {label: $scope.loc.BP_AR, value: 'AR'},
          {label: $scope.loc.BP_CA, value: 'CA'},
          {label: $scope.loc.BP_CO, value: 'CO'},
          {label: $scope.loc.BP_CT, value: 'CT'},
          {label: $scope.loc.BP_DE, value: 'DE'},
          {label: $scope.loc.BP_FL, value: 'FL'},
          {label: $scope.loc.BP_GA, value: 'GA'},
          {label: $scope.loc.BP_HI, value: 'HI'},
          {label: $scope.loc.BP_ID, value: 'ID'},
          {label: $scope.loc.BP_IL, value: 'IL'},
          {label: $scope.loc.BP_IN, value: 'IN'},
          {label: $scope.loc.BP_IA, value: 'IA'},
          {label: $scope.loc.BP_KS, value: 'KS'},
          {label: $scope.loc.BP_KY, value: 'KY'},
          {label: $scope.loc.BP_LA, value: 'LA'},
          {label: $scope.loc.BP_ME, value: 'ME'},
          {label: $scope.loc.BP_MD, value: 'MD'},
          {label: $scope.loc.BP_MA, value: 'MA'},
          {label: $scope.loc.BP_MI, value: 'MI'},
          {label: $scope.loc.BP_MN, value: 'MN'},
          {label: $scope.loc.BP_MS, value: 'MS'},
          {label: $scope.loc.BP_MO, value: 'MO'},
          {label: $scope.loc.BP_MT, value: 'MT'},
          {label: $scope.loc.BP_NE, value: 'NE'},
          {label: $scope.loc.BP_NV, value: 'NV'},
          {label: $scope.loc.BP_NH, value: 'NH'},
          {label: $scope.loc.BP_NJ, value: 'NJ'},
          {label: $scope.loc.BP_NM, value: 'NM'},
          {label: $scope.loc.BP_NY, value: 'NY'},
          {label: $scope.loc.BP_NC, value: 'NC'},
          {label: $scope.loc.BP_ND, value: 'ND'},
          {label: $scope.loc.BP_OH, value: 'OH'},
          {label: $scope.loc.BP_OK, value: 'OK'},
          {label: $scope.loc.BP_OR, value: 'OR'},
          {label: $scope.loc.BP_PA, value: 'PA'},
          {label: $scope.loc.BP_RI, value: 'RI'},
          {label: $scope.loc.BP_SC, value: 'SC'},
          {label: $scope.loc.BP_SD, value: 'SD'},
          {label: $scope.loc.BP_TN, value: 'TN'},
          {label: $scope.loc.BP_TX, value: 'TX'},
          {label: $scope.loc.BP_UT, value: 'UT'},
          {label: $scope.loc.BP_VT, value: 'VT'},
          {label: $scope.loc.BP_VA, value: 'VA'},
          {label: $scope.loc.BP_WA, value: 'WA'},
          {label: $scope.loc.BP_WV, value: 'WV'},
          {label: $scope.loc.BP_WI, value: 'WI'},
          {label: $scope.loc.BP_WY, value: 'WY'}
        ];
        $timeout(function() {
          $scope.value = isFalsy($scope.value) ? $scope.statesArray[0].value: $scope.value;
        }, 100);

        function isFalsy(val) {
          if (!val || val === null) {
            return true;
          }
          if (typeof val === 'string' && !val.length) {
            return true;
          }
          return false;
        }

      }]
    };
  })
})();