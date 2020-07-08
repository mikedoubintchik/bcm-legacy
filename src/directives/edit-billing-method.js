(function() {
  angular
  .module('blueconnect.mobile.directives.editBillingMethod', [])
  .directive('editBillingMethod', function() {
    return {
      restrict: 'E',
      scope: {
        preferences: '<',
        selectedPolicy: '<',
        billingToken: '<'
      },
      templateUrl: 'partials/edit-billing-method.html',
      controller: ['config', '$http', '$rootScope', '$scope', '$timeout', '$window', function(config, $http, $rootScope, $scope, $timeout, $window) {
        $scope.loc = $rootScope.loc;
        $scope.savePreferencesError = null;
        $scope.checkboxValue = false;

        // Object structure needed for address validation directive
        $scope.userData = {
          preferences: $scope.preferences.values.preferences
        };
        $scope.strictEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        // Sets the selected billing method defaulted to email
        $scope.userData.preferences.billingMethod ? $scope.billingMethodSelected = $scope.userData.preferences.billingMethod: $scope.billingMethodSelected = 'EMAIL'


        $scope.savePreferencesError = null;

        $scope.navDetails = {
          leftNavButton: {
            icon: 'back'
          },
          title: $rootScope.loc.BP_EDIT_BILLING_METHOD
        };
    
        $scope.historyBack = function() {
          $window.history.back();
        };

        $scope.acceptPaperlessFn = function() {
          $scope.checkboxValue = true;$scope.checkboxValue = true;
        };

        /**
         *
         * @param {Object} formObj
         */
        $scope.validateAndSubmitForm = function(formObj) {
          $scope.savePreferencesError = false;
          if (formObj.memberEmail) {
            formObj.memberEmail.$setDirty();
          }
          if (formObj.paperlessAgreement) {
            formObj.paperlessAgreement.$setDirty();
          }
          if ($scope.billingMethodSelected === 'POSTAL') {
            formObj.streetAddress.$setDirty();
            formObj.city.$setDirty();
            formObj.state.$setDirty();
            formObj.zipcode.$setDirty();
          }
          // return if the form is invalid
          if (formObj.$invalid) {
            return;
          }

          // post data if the form is valid
          $rootScope.$emit('pageLoading');

          $http.post(config.apiUrl + '/setBillingPreferences', {
            account: {
              token: $scope.billingToken
            },
            preferences: {
              mailingAddress: $scope.userData.preferences.mailingAddress,
              emailAddress: $scope.userData.preferences.emailAddress,
              payment: $scope.userData.preferences.payment,
              updatedPreferences: {
                paymentMethod: $scope.userData.preferences.paymentMethod,
                billingMethod: $scope.billingMethodSelected,
                paymentFrequency: $scope.userData.preferences.paymentFrequency
              },
              priorBillingNotifPrefCode: $scope.userData.preferences.priorBillingNotifPrefCode
            },
            TIPData: $rootScope.getTIPData('Chgbillstmtpref', '/setBillingPreferences')
          }).then(function(){
            $rootScope.$emit('pageLoaded');
            $rootScope.gotoView('/billing-preferences?success=true');
          }).catch(function() {
            $rootScope.$emit('pageLoaded');
            $scope.savePreferencesError = true;
          });
        };

      }]
    };

  });
})();