/**
 * Service for customer service hours.
 *
 * @namespace Services
 * @class customerServiceHours
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.customerServiceHours', [])
  .service('customerServiceHoursServices', [
    '$rootScope',
    function($rootScope) {
      /**
       * Names available for contacts
       *
       * @memberof customerServiceHoursServices
       * @memberof {object} getCustomerServiceHours
       */
      this.getCustomerServiceTitles = {
        servicesInfo: [{
          name:"customerservicenumber",
          title: $rootScope.loc.GENERAL_CUSTOMER_SERVICE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"ttytddnumber",
          title: $rootScope.loc.GENERAL_CUSTOMER_SERVICE_TTY,
          icon: "tty-icon",
          class: "tty-number",
          url: "/inbox/compose"
        },{
          name:"blueconnectsupport",
          title: $rootScope.loc.BLUE_CONNECT_SUPPORT,
          icon: "fc-phone-nocircle",
          class: "phone-number",
          url: "/inbox/compose"
        },{
          name:"dentalgridnumber",
          title: $rootScope.loc.DENTAL_SUPPORT_LINE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"primemailnumber",
          title: $rootScope.loc.PRIME_MAIL_NUMBER,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"mentalhealthservicenumber",
          title: $rootScope.loc.MENTAL_HEALTH_LINE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"locatenonncprovidernumber",
          title: $rootScope.loc.LOCATE_NON_NC_PROVIDER,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"providerservicenumber",
          title: $rootScope.loc.PROVIDER_SERVICE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"priorreviewcertificationnumber",
          title: $rootScope.loc.PRIOR_REVIEW_CUSTOMER_SERVICE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"wakemedhealthcontactnumber",
          title: $rootScope.loc.WAKE_MED,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"dukemedicinecontactnumber",
          title: $rootScope.loc.DUKE_HEALTH,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"nurselinenumber",
          title: $rootScope.loc.NURSE_SUPPORT,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"rxhelpdesknumber",
          title: $rootScope.loc.PRESCRIPTION_LINE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"carolinashealthcaresystemcontactnumber",
          title: $rootScope.loc.CAROLINAS_HEATLHCARE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"billingpaymentsnumber",
          title: $rootScope.loc.BILLING_PAYMENTS_LINE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"claimssupportnumber",
          title: $rootScope.loc.CLAIMS_SUPPORT_LINE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"claimsbenefitsservicenumber",
          title: $rootScope.loc.CLAIMS_BENEFIT_LINE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        },{
          name:"billingmembershipservicenumber",
          title: $rootScope.loc.BILLING_MEMBERSHIP_LINE,
          icon: "fc-phone-nocircle",
          class:"phone-number",
          url: "/inbox/compose"
        }]
      };


      /**
       * Hours available for customer service contacts
       *
       * @memberof customerServiceHoursServices
       * @memberof {object} getCustomerServiceHours
       *
       * Use '9999' for unknown hours expect Saturday and Sunday
       */
      this.getCustomerServiceHours = {
        servicesHours: [{
          number:"1-888-868-5527",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-709-7092",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-215-4069",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-446-8053",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-705-7050",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-471-2738",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-451-9957",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-351-8283",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-310-4110",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-291-1782",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-281-1785",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-247-4145",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-234-2416",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-206-4697",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-442-7028",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-877-627-3287",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-877-494-7647",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2000'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-877-275-9787",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-877-258-3334",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-866-916-3475",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2200'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2200'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2200'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2200'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2200'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-817-7044",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2300'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2300'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2300'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2300'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2300'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-755-0790",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-672-7897",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-672-6584",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1800'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-621-8876",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'2100'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-579-8022",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1700'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-324-4963",
          openEveryday: true,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-305-6638",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.TUESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.WEDNESDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.THURSDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.FRIDAY,open:'0800',close:'1900'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-412-6403",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-877-988-0059",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-877-713-7682",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-877-679-6272",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-877-484-5029",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-855-282-3517",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-817-6044",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-810-2583",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-422-1582",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-367-6143",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-274-5180",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-359-2422",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-214-4844",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-877-477-2424",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-274-5186",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-888-874-2807",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-672-9897",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-800-214-4484",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-919-350-2227",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        },{
          number:"1-919-385-0555",
          openEveryday: false,
          hours: [
            {day:$rootScope.loc.SUNDAY,open:'0000',close:'0000'},
            {day:$rootScope.loc.MONDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.TUESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.WEDNESDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.THURSDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.FRIDAY,open:'9999',close:'9999'},
            {day:$rootScope.loc.SATURDAY,open:'0000',close:'0000'},
          ]
        }]
      };
    }
  ]);
}());
