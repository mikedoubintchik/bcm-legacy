/**
 * Service for showing an alert modal.
 *
 * @namespace Services
 * @class alertService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.quickAlert', [])
  .service('quickAlertService', [
    '$q',
    '$rootScope',
    '$timeout',
    function($q, $rootScope, $timeout) {
      /**
       * Shows an quick alert modal. It shows a message on an event that just occured
       *
       * @memberof quickAlertService
       * @method showQuickAlert
       * @param  {Object} [alert] Alert settings. It has thre variables, string, color ('blue', 'green', 'red') and alertBottom.
       * @param  {Boolean} bookmark Whether to bookmark or unbookmark.
       */
      this.showQuickAlert = function(alert, bookmark) {

        $rootScope.quickAlertModal = {
          alert: alert,
          bookmark: bookmark
        };

        angular.element('.quick-alert-modal').show();
      };
    }
  ]);
}());
