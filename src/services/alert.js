/**
 * Service for showing an alert modal.
 *
 * @namespace Services
 * @class alertService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.alert', [])
    .service('alertService', [
      '$q',
      '$rootScope',
      '$sce',
      function($q, $rootScope, $sce) {
        /**
         * Shows an alert modal. It has a manditory confirm button and an optional cancel button.
         *
         * @memberof alertService
         * @method showAlert
         * @param  {String}  title          The text to display in the alert modal header.
         * @param  {String}  body           The text to display in the alert modal body.
         * @param  {Object} [confirmButton] Confirm button settings. It has two variables, title and color ('red','blue' or 'green').
         * @param  {Object} [cancelButton]  Cancel button settings. Uses the same variables as the confirm button.
         * @return {Promise} A promise that resolves or rejects, based on whether the alert was accepted or cancelled.
         */
        this.showAlert = function(title, body, confirmButton, cancelButton, style) {
          var deferred = $q.defer();

          $rootScope.alertModal = {
            title: title,
            body: $sce.trustAsHtml(body),
            confirmButton: confirmButton,
            cancelButton: cancelButton,
            style: style,
            result: function(confirm) {
              if (confirm) {
                angular.element('.alert-modal').modal('hide');
                $rootScope.blurContent = false;
                deferred.resolve();
              }
              else {
                angular.element('.alert-modal').modal('hide');
                $rootScope.blurContent = false;
                deferred.reject();
              }
              toggleModalState(false);
            }
          };


          $rootScope.blurContent = true;
          angular.element('.alert-modal').modal('show');
          toggleModalState(true);
          return deferred.promise;
        };
        /* Hides an alert modal before loading the login page
         *
         * @method closeAlert
         */
        this.closeAlert = function() {
          angular.element('.alert-modal').modal('hide');
          angular.element('.help-modal').modal('hide');
          angular.element('.terms-modal').modal('hide');
          $rootScope.blurContent = false;
          toggleModalState(false);
        };

        function toggleModalState(isModalOpen) {
          $rootScope.isModalOpen = isModalOpen;
        }
      }
    ]);
}());
