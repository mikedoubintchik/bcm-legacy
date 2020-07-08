/**
 * Services for the retrieval and setting of language.
 *
 * @namespace Services
 * @class inquiryService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.inquiry', [])
  .service('inquiryService', [function() {

    /**
     * Returns the IDs of currently availalable inquiry types.
     *
     * @memberof inquiryService
     * @method getInquiryTypes
     * @return {Array} Available inquiry type IDs
     */
    this.getInquiryTypes = function(state) {
      if (state) {
        return [
          'ID_CARD_ISSUE',
          'CLAIMS',
          'WEBSITE_ISSUE',
          'BENEFITS_COVERAGE',
          'OTHER_ISSUE'
        ];
      } else {
        return [
          'ID_CARD_ISSUE',
          'PREMIUM_PAYMENT',
          'CLAIMS',
          'WEBSITE_ISSUE',
          'PRESCRIPTIONS',
          'BENEFITS_COVERAGE',
          'OTHER_ISSUE'
        ];
      }
    };

    /**
     * Returns the Salesforce string for inquiry type.
     *
     * @memberof inquiryService
     * @method getSalesforceInquiryType
     * @param  {String} uid The unique ID of the inquiry type
     * @return {String} The Salesforce string
     */
    this.getSalesforceInquiryType = function(uid) {
      switch(uid) {
        case 'ID_CARD_ISSUE':
          return 'ID Card Issue';
        case 'PREMIUM_PAYMENT':
          return 'Premium Payment';
        case 'CLAIMS':
          return 'Claims';
        case 'WEBSITE_ISSUE':
          return 'Website Issue';
        case 'PRESCRIPTIONS':
          return 'Prescriptions';
        case 'BENEFITS_COVERAGE':
          return 'Benefits/Coverage';
        case 'OTHER_ISSUE':
          return 'Other Issue';
        case 'CANCEL_POLICY':
          return 'Cancel Policy';
        default:
          return uid;
      }
    };

    /**
     * Returns the displayable name for an inquiry type.
     *
     * @memberof inquiryService
     * @method getDisplayName
     * @param  {String} uid The unique ID of the inquiry type
     * @return {String} The displayable name
     */
    this.getDisplayName = function(uid) {
      switch(uid) {
        case 'ID_CARD_ISSUE':
          return 'ID Card Issue';
        case 'PREMIUM_PAYMENT':
          return 'Premium Payment';
        case 'CLAIMS':
          return 'Claims';
        case 'WEBSITE_ISSUE':
          return 'Website Issue';
        case 'PRESCRIPTIONS':
          return 'Prescriptions';
        case 'BENEFITS_COVERAGE':
          return 'Benefits/Coverage';
        case 'OTHER_ISSUE':
          return 'Other Issue';
        case 'CANCEL_POLICY':
          return 'Cancel Policy';
        default:
          return uid;
      }
    };
  }]);
}());
