/**
 * Controller for the Billing History Filter.
 *
 * @namespace Controllers
 * @class BillingHistoryFilter
 */
(function () {
  'use strict';
  angular
      .module('blueconnect.mobile.controllers.billingHistoryFilter', [
        'bcbsnc.cloud.services.page'
      ])
      .controller('BillingHistoryFilter',
          [
            'BillingInvoiceHistoryFactory',
            '$rootScope',
            '$window',
            '$scope',
            'adobeService',
            'analyticConstants',
            function (BillingInvoiceHistoryFactory, $rootScope, $window, $scope, adobeService, analyticConstants) {

              $scope.isMedicareSSA = BillingInvoiceHistoryFactory.getMedicareSSAValue();
              // hide the navbar
              $rootScope.showNav = false;

              // hide the policy select dropdown
              $rootScope.showPolicySelect = false;

              // default the loc object to avoid ReferenceErrors later
              $scope.loc = $rootScope.loc || {};

              // default the navbar details to avoid unref
              $scope.navbarDetails = {};

              $scope.navbarDetails = {
                display: {
                  title: $rootScope.loc.BP_FILTER_BILLING_HISTORY,
                  leftNavButton: {
                    icon: 'close'
                  }
                },
                onLeftClick: function () {
                  $window.history.back();
                }
              };

              $rootScope.pageTitle = $rootScope.loc.BP_FILTER_BILLING_HISTORY;
              $scope.startDateSelected = BillingInvoiceHistoryFactory.getStartIndex() || 24;
              $scope.endDateSelected = BillingInvoiceHistoryFactory.getEndIndex() || 0;
              var dateFormat = 'MMMM YYYY';
              var startDates = [];
              var start = moment().format(dateFormat);

              var index = 1;
              while (index <= 25) {
                startDates.push({value: index, label: start});
                start = moment().subtract(index, 'month').format(dateFormat);
                index++;
              }

              $scope.startDates = startDates;
              $scope.endDates = startDates;
              BillingInvoiceHistoryFactory.setDateList(startDates);
              $scope.historyTypeSelected = BillingInvoiceHistoryFactory.getHistoryType() || 'A';
              $scope.dateRangeSelected = BillingInvoiceHistoryFactory.getTimeSpan() || '3';

              $scope.validateDateRange = function(fromDate, toDate) {
                if (fromDate && toDate && moment(fromDate.label, dateFormat).isAfter(moment(toDate.label, dateFormat))) {
                  $scope.billingHistoryFilterForm.$invalid = true;
                }
              };

              $scope.selectButton = function () {
                $scope.dateRangeSelected = "99";
              };

              $scope.validateBillingHistory = function(formObj) {

                (!$scope.isMedicareSSA) ? BillingInvoiceHistoryFactory.setHistoryType(formObj.$$parentForm.billingHistoryFilterForm.historyTypeSelected.$modelValue) : BillingInvoiceHistoryFactory.setHistoryType('A');

                var timeSpan = (formObj.$$parentForm.billingHistoryFilterForm.dateRangeSelected.$modelValue).toString();

                if (timeSpan === '0' || timeSpan === '99') {
                  var lastYear = moment().subtract(1, 'year').format('YYYY');
                  var lastJan = moment(lastYear, 'YYYY').month(0);
                  var lastDec = moment(lastYear, 'YYYY').month(11);

                  if (timeSpan === '99' && (!formObj.$$parentForm.billingHistoryFilterForm.endDate.$modelValue || !formObj.$$parentForm.billingHistoryFilterForm.startDate.$modelValue)){
                    return console.warn('form is invalid, cannot proceed');
                  }

                  if (timeSpan === '0'){
                    //This is last years plan
                    BillingInvoiceHistoryFactory.setSearchFromDate(lastJan);
                    BillingInvoiceHistoryFactory.setSearchToDate(lastDec);
                  } else {
                    //This is the custom date range
                    timeSpan = (moment(formObj.$$parentForm.billingHistoryFilterForm.endDate.$modelValue.label)).diff(moment(formObj.$$parentForm.billingHistoryFilterForm.startDate.$modelValue.label), 'months');
                    BillingInvoiceHistoryFactory.setStartIndex(formObj.$$parentForm.billingHistoryFilterForm.startDate.$modelValue.value);
                    BillingInvoiceHistoryFactory.setStartDate(moment(formObj.$$parentForm.billingHistoryFilterForm.startDate.$modelValue.label));
                    BillingInvoiceHistoryFactory.setEndIndex(formObj.$$parentForm.billingHistoryFilterForm.endDate.$modelValue.value);
                    BillingInvoiceHistoryFactory.setEndDate(moment(formObj.$$parentForm.billingHistoryFilterForm.endDate.$modelValue.label));
                    BillingInvoiceHistoryFactory.setSearchFromDate(moment(formObj.$$parentForm.billingHistoryFilterForm.startDate.$modelValue.label));
                    BillingInvoiceHistoryFactory.setSearchToDate(moment(formObj.$$parentForm.billingHistoryFilterForm.endDate.$modelValue.label));
                  }//end timeSpan === 0

                } else {
                  //This is 3, 6, 12, or 24 selected
                  BillingInvoiceHistoryFactory.setSearchFromDate(moment().subtract(timeSpan, 'month'));
                  BillingInvoiceHistoryFactory.setSearchToDate(moment());
                }//end timeSpan 0 or 99

                BillingInvoiceHistoryFactory.setTimeSpan(timeSpan);
                $rootScope.gotoView('billing-invoice-history?search=true');
              };

              adobeService.trackState('billingInvoiceHistoryFilter', analyticConstants.BILLING_SECTION);
            }]);
})();
