(function() {
  'use strict';
  angular
    .module('blueconnect.mobile.app', [
      'ngRoute',
      'ngSanitize',
      'ngAnimate',
      'ngTouch',
      'angular-cache',
      'bcbsnc.cloud.directives.bindHtmlCompile',
      // Constants
      'blueconnect.mobile.config',
      'blueconnect.mobile.directiveHtml',
      'blueconnect.mobile.analyticConstants',
      // Services
      'blueconnect.mobile.services.cordova',
      'blueconnect.mobile.services.adobe',
      'blueconnect.mobile.services.language',
      'blueconnect.mobile.services.message',
      'blueconnect.mobile.services.inquiry',
      'blueconnect.mobile.services.storage',
      'blueconnect.mobile.services.quickAlert',
      'blueconnect.mobile.services.alert',
      'blueconnect.mobile.services.share',
      'blueconnect.mobile.services.help',
      'blueconnect.mobile.services.login',
      'blueconnect.mobile.services.googleMaps',
      'blueconnect.mobile.services.claims',
      'blueconnect.mobile.services.policy',
      'blueconnect.mobile.services.livechat',
      'blueconnect.mobile.services.customerServiceHours',
      'blueconnect.mobile.services.paymentFlowFactory',
      'blueconnect.mobile.services.billingInvoiceHistoryFactory',
      'blueconnect.mobile.services.coachmark',
      'blueconnect.mobile.services.transparencyFactory',
      'blueconnect.mobile.services.geoLocation',
      'blueconnect.mobile.services.backButton',
      'blueconnect.mobile.services.findDoctor',
      // Controllers
      'blueconnect.mobile.controllers.main',
      'blueconnect.mobile.controllers.landing',
      'blueconnect.mobile.controllers.home',
      'blueconnect.mobile.controllers.homeRefresh',
      'blueconnect.mobile.controllers.setup',
      'blueconnect.mobile.controllers.login',
      'blueconnect.mobile.controllers.logout',
      'blueconnect.mobile.controllers.inbox',
      'blueconnect.mobile.controllers.compose',
      'blueconnect.mobile.controllers.inboxSearch',
      'blueconnect.mobile.controllers.help',
      'blueconnect.mobile.controllers.claims',
      'blueconnect.mobile.controllers.benefits',
      'blueconnect.mobile.controllers.about',
      'blueconnect.mobile.controllers.faq',
      'blueconnect.mobile.controllers.healthNav',
      'blueconnect.mobile.controllers.settings',
      'blueconnect.mobile.controllers.idCard',
      'blueconnect.mobile.controllers.customerService',
      'blueconnect.mobile.controllers.feedback',
      'blueconnect.mobile.controllers.billing',
      'blueconnect.mobile.controllers.billing.preferences',
      'blueconnect.mobile.controllers.billinghistory',
      'blueconnect.mobile.controllers.billingpaperless',
      'blueconnect.mobile.controllers.networkLandingLocal',
      'blueconnect.mobile.controllers.paymentFlow',
      'blueconnect.mobile.controllers.payment.method',
      'blueconnect.mobile.controllers.payment.details',
      'blueconnect.mobile.controllers.payment.confirmation',
      'blueconnect.mobile.controllers.payment.review',
      'blueconnect.mobile.controllers.editBillingMethodPage',
      'blueconnect.mobile.controllers.update.autopay',
      'blueconnect.mobile.controllers.stop.autopay',
      'blueconnect.mobile.controllers.editAutopayFlowPage',
      'blueconnect.mobile.controllers.billingInvoiceHistory',
      'blueconnect.mobile.controllers.billingHistoryFilter',
      'blueconnect.mobile.controllers.autopay.method',
      'blueconnect.mobile.controllers.billingHistoryUnderstandInvoice',
      'blueconnect.mobile.controllers.findDoctor',
      'blueconnect.mobile.controllers.findCare',
      'blueconnect.mobile.controllers.findDoctorAuthenticated',
      'blueconnect.mobile.controllers.findDoctorSearch',
      'blueconnect.mobile.controllers.findDoctorBrowser',
      'blueconnect.mobile.controllers.findDoctorSearchResults',
      'blueconnect.mobile.controllers.findDoctorResultsDetails',
      'blueconnect.mobile.controllers.findDoctorFilter',
      'blueconnect.mobile.controllers.upgrade',
      'blueconnect.mobile.controllers.pcp.ManageDependentsPcpController',
      'blueconnect.mobile.controllers.findDoctor',
      'blueconnect.mobile.controllers.findDoctorSearch',
      'blueconnect.mobile.controllers.findDoctorBrowser',
      'blueconnect.mobile.controllers.findDoctorSearchResults',
      'blueconnect.mobile.controllers.findDoctorResultsDetails',
      'blueconnect.mobile.controllers.findDoctorFilter',
      // Filters
      'blueconnect.mobile.filters.capitalize',
      'blueconnect.mobile.filters.padCurrencyAmount',
      'blueconnect.mobile.filters.maskAccount',
      'blueconnect.mobile.filters.addLeadingZeroToSingleDigit',
      'blueconnect.mobile.filters.removeCommas',
      'blueconnect.mobile.filters.toDropDownFilter',
      'blueconnect.mobile.filters.fromDropDownFilter',
      'blueconnect.mobile.filters.billingHistoryFromDateFilter',
      'blueconnect.mobile.filters.billingHistoryToDateFilter',
      'blueconnect.mobile.filters.limitFilter',
      // Directives
      'blueconnect.mobile.directives.goBack',
      'blueconnect.mobile.directives.goInbox',
      'blueconnect.mobile.directives.navbarLoading',
      'blueconnect.mobile.directives.checkBox',
      'blueconnect.mobile.directives.checkBoxGroup',
      'blueconnect.mobile.directives.radioButton',
      'blueconnect.mobile.directives.navbar',
      'blueconnect.mobile.directives.policySelect',
      'blueconnect.mobile.directives.homeCardIdCard',
      'blueconnect.mobile.directives.homeCardBilling',
      'blueconnect.mobile.directives.homeCardBillingError',
      'blueconnect.mobile.directives.homeCardClaims',
      'blueconnect.mobile.directives.homeCardInbox',
      'blueconnect.mobile.directives.homeCardCustomerService',
      'blueconnect.mobile.directives.homeCardSettings',
      'blueconnect.mobile.directives.homeCardInformationAlert',
      'blueconnect.mobile.directives.homeCardFindCare',
      'blueconnect.mobile.directives.findCare',
      'blueconnect.mobile.directives.tabSelect',
      'blueconnect.mobile.directives.glossaryOfTerms',
      'blueconnect.mobile.directives.inboxMessageList',
      'blueconnect.mobile.directives.inboxBottomBar',
      'blueconnect.mobile.directives.idCardBottomBar',
      'blueconnect.mobile.directives.idCardInfo',
      'blueconnect.mobile.directives.idCardMemberDetails',
      'blueconnect.mobile.directives.idCardImageTypes',
      'blueconnect.mobile.directives.idCardNetworkDetails',
      'blueconnect.mobile.directives.inboxMessage',
      'blueconnect.mobile.directives.inboxMessageBottomBar',
      'blueconnect.mobile.directives.inboxCompose',
      'blueconnect.mobile.directives.inboxError',
      'blueconnect.mobile.directives.loginBottomBar',
      'blueconnect.mobile.directives.basicNavbar',
      'blueconnect.mobile.directives.helpItemGroup',
      'blueconnect.mobile.directives.bottomButton',
      'blueconnect.mobile.directives.quickAlertModal',
      'blueconnect.mobile.directives.alertModal',
      'blueconnect.mobile.directives.searchInput',
      'blueconnect.mobile.directives.safeInput',
      'blueconnect.mobile.directives.blueBarLabel',
      'blueconnect.mobile.directives.claimsList',
      'blueconnect.mobile.directives.memberSavingsFooter',
      'blueconnect.mobile.directives.shareModal',
      'blueconnect.mobile.directives.claimsSearchInput',
      'blueconnect.mobile.directives.claimsFilterCriteria',
      'blueconnect.mobile.directives.helpModal',
      'blueconnect.mobile.directives.termsModal',
      'blueconnect.mobile.directives.fullScreenModal',
      'blueconnect.mobile.directives.policyHeaderGray',
      'blueconnect.mobile.directives.policyHeaderBlue',
      'blueconnect.mobile.directives.claimMember',
      'blueconnect.mobile.directives.claimAmounts',
      'blueconnect.mobile.directives.claimInfo',
      'blueconnect.mobile.directives.claimCompose',
      'blueconnect.mobile.directives.documentButtons',
      'blueconnect.mobile.directives.claimBottomBar',
      'blueconnect.mobile.directives.helpIcon',
      'blueconnect.mobile.directives.helpLink',
      'blueconnect.mobile.directives.dynamicHelpIcon',
      'blueconnect.mobile.directives.about',
      'blueconnect.mobile.directives.faq',
      'blueconnect.mobile.directives.healthNav',
      'blueconnect.mobile.directives.toggleSwitch',
      'blueconnect.mobile.directives.homeCardNewsUpdate',
      'blueconnect.mobile.directives.settingsList',
      'blueconnect.mobile.directives.listMessaging',
      'blueconnect.mobile.directives.homeCardBenefits',
      'blueconnect.mobile.directives.homeCardBenefitsSelect',
      'blueconnect.mobile.directives.benefitsDetail',
      'blueconnect.mobile.directives.benefitsSelectDetail',
      'blueconnect.mobile.directives.errorLoadingPage',
      'blueconnect.mobile.directives.homeCardOtherLanguages',
      'blueconnect.mobile.directives.fundData',
      'blueconnect.mobile.directives.idCardCustomerService',
      'blueconnect.mobile.directives.idCard',
      'blueconnect.mobile.directives.customerServiceCard',
      'blueconnect.mobile.directives.customerServiceSecureInbox',
      'blueconnect.mobile.directives.verticalBarGraph',
      'blueconnect.mobile.directives.feedback',
      'blueconnect.mobile.directives.benefitsCoverageDetails',
      'blueconnect.mobile.directives.benefitsBookletsDetails',
      'blueconnect.mobile.directives.medicarePlanBenefits',
      'blueconnect.mobile.directives.medicareDrugBenefits',
      'blueconnect.mobile.directives.medicareDrugBenefitsInitialCoverage',
      'blueconnect.mobile.directives.medicareDrugBenefitsCoverageGap',
      'blueconnect.mobile.directives.medicareFootnotes',
      'blueconnect.mobile.directives.medicareMoreInformationPdf',
      'blueconnect.mobile.directives.medicareSuppPlan',
      'blueconnect.mobile.directives.medicareGroupInfo',
      'blueconnect.mobile.directives.billingSummary',
      'blueconnect.mobile.directives.billingSummaryError',
      'blueconnect.mobile.directives.billingAndPaymentsComingSoon',
      'blueconnect.mobile.directives.prescriptionOnlyInfo',
      'blueconnect.mobile.directives.paymentFlowTotalBalance',
      'blueconnect.mobile.directives.paymentFlowTracker',
      'blueconnect.mobile.directives.paymentFlowPaymentFrequency',
      'blueconnect.mobile.directives.paymentFlowTitleBar',
      'blueconnect.mobile.directives.trackerBillingSummary',
      'blueconnect.mobile.directives.prescriptionOnlyInfo',
      'blueconnect.mobile.directives.dentalOnlyInfo',
      'blueconnect.mobile.directives.lowCostDentalOnlyInfo',
      'blueconnect.mobile.directives.visionOnlyInfo',
      'blueconnect.mobile.directives.contraceptiveOnlyInfo',
      'blueconnect.mobile.directives.paymentFlowPaymentAmount',
      'blueconnect.mobile.directives.paymentFlowRadioGroup',
      'blueconnect.mobile.directives.paymentFlowCheckbox',
      'blueconnect.mobile.directives.paymentFlowInputs',
      'blueconnect.mobile.directives.scrollStart',
      'blueconnect.mobile.directives.scrollEnd',
      'blueconnect.mobile.directives.benefitsNav',
      'blueconnect.mobile.directives.autopayFlowBillingMethod',
      'blueconnect.mobile.directives.paymentFlowBillingMethod',
      'blueconnect.mobile.directives.paymentFlowPaymentMethod',
      'blueconnect.mobile.directives.paymentFlow',
      'blueconnect.mobile.directives.paperlessAgreement',
      'blueconnect.mobile.directives.paymentFlowReusableDirectives',
      'blueconnect.mobile.directives.paymentFlowBankDetails',
      'blueconnect.mobile.directives.paymentFlowCreditCardDetails',
      'blueconnect.mobile.directives.paymentFlowPaymentMethodSelected',
      'blueconnect.mobile.directives.totalRemainingBalance',
      'blueconnect.mobile.directives.termsConditions',
      'blueconnect.mobile.directives.paymentFlowReviewDetails',
      'blueconnect.mobile.directives.maxLengthEnforce',
      'blueconnect.mobile.directives.cvnValidation',
      'blueconnect.mobile.directives.creditCardNumberValidation',
      'blueconnect.mobile.directives.paymentFlowProcessingPayment',
      'blueconnect.mobile.directives.paymentFlowAutopayPromo',
      'blueconnect.mobile.directives.paymentFlowPaymentReceipt',
      'blueconnect.mobile.directives.paymentFlowHelpShare',
      'blueconnect.mobile.directives.paymentFlowStateSelect',
      'blueconnect.mobile.directives.paymentFlowPaperlessSuccess',
      'blueconnect.mobile.directives.paidComponent',
      'blueconnect.mobile.directives.paymentProcessing',
      'blueconnect.mobile.directives.paymentUnsuccessful',
      'blueconnect.mobile.directives.billingSummaryNewMember',
      'blueconnect.mobile.directives.billingStatusPaidInFull',
      'blueconnect.mobile.directives.paymentFlowCtaButton',
      'blueconnect.mobile.directives.paymentFlowCancelButton',
      'blueconnect.mobile.directives.reinstatementSummary',
      'blueconnect.mobile.directives.paymentFlowReinstatementPending',
      'blueconnect.mobile.directives.customerServicePhoneCard',
      'blueconnect.mobile.directives.blockUnderClick',
      'blueconnect.mobile.directives.homeCardBillingAutopayStaticContent',
      'blueconnect.mobile.directives.invoicePayments',
      'blueconnect.mobile.directives.billingServiceDown',
      'blueconnect.mobile.directives.editBillingMethod',
      'blueconnect.mobile.directives.paymentFlowPaymentError',
      'blueconnect.mobile.directives.billingPreferencesDetails',
      'blueconnect.mobile.directives.stopAutopay',
      'blueconnect.mobile.directives.homecardChat',
      'blueconnect.mobile.directive.editAutopayFlowPageMethod',
      'blueconnect.mobile.directive.editAutopayFlowPageDetails',
      'blueconnect.mobile.directive.editAutopayFlowPageReview',
      'blueconnect.mobile.directive.editAutopayFlowPageConfirmation',
      'blueconnect.mobile.directives.billingPreferencesUpdate',
      'blueconnect.mobile.directives.editAutopayFlowPaymentReceipt',
      'blueconnect.mobile.directives.paymentFlowAutoPayPending',
      'blueconnect.mobile.directives.paymentFlowAutoPaySuccess',
      'blueconnect.mobile.directives.planDetails',
      'blueconnect.mobile.directives.billingInvoiceHistoryFilterRibbon',
      'blueconnect.mobile.directives.billingInvoiceHistoryNoInvoices',
      'blueconnect.mobile.directives.paymentFlowAutoPaySetup',
      'blueconnect.mobile.directives.billingHistoryUnderstandInvoice',
      'blueconnect.mobile.directives.billingServiceDown',
      'blueconnect.mobile.directives.paymentFlowPaymentError',
      'blueconnect.mobile.directives.coachmark',
      'blueconnect.mobile.directives.invoiceHistoryCard',
      'blueconnect.mobile.directives.billingButtons',
      'blueconnect.mobile.directives.downloadPDFButton',
      'blueconnect.mobile.directives.paymentFlowFaqsButton',
      'blueconnect.mobile.directives.findDoctorNavbar',
      'blueconnect.mobile.directives.findDoctorAuthenticatedNavbar',
      'blueconnect.mobile.directives.findDoctor',
      'blueconnect.mobile.directives.findDoctorSearch',
      'blueconnect.mobile.directives.planSelect',
      'blueconnect.mobile.directives.findDoctorBrowser',
      'blueconnect.mobile.directives.findDoctorSearchBottomBar',
      'blueconnect.mobile.directives.findDoctorSearchResults',
      'blueconnect.mobile.directives.findDoctorResultsDetails',
      'blueconnect.mobile.directives.resultsDetailsBlocks',
      'blueconnect.mobile.directives.planHeader',
      'blueconnect.mobile.directives.filterDetails',
      'blueconnect.mobile.directives.liveChat',
      'blueconnect.mobile.directives.lookupCitiesInput',
      'blueconnect.mobile.directives.homecardPcp',
      'blueconnect.mobile.directives.pcpDependentPcps',
      'blueconnect.mobile.directives.idCardPlanDetails',
    ])
    .run([
      function() {
        FastClick.attach(document.body);
      }
    ])
    .config([
      '$routeProvider',
      function($routeProvider) {
        $routeProvider
          .when('/network-landing-local', {
            templateUrl: 'views/network-landing-local.html',
            controller: 'NetworkLandingLocalController'
          })
          .when('/', {
            templateUrl: 'views/landing.html',
            controller: 'LandingController'
          })
          .when('/autopay-method', {
            templateUrl: 'views/autopay-flow-page-method.html',
            controller: 'AutopayMethodController'
          })
          .when('/billing-preferences', {
            templateUrl: 'views/billing-preferences.html',
            controller: 'BillingPreferencesController'
          })
          .when('/billing-history', {
            templateUrl: 'views/billing-history.html',
            controller: 'BillingHistoryController'
          })
          .when('/billing-paperless', {
            templateUrl: 'views/billing-paperless.html',
            controller: 'BillingPaperlessController'
          })
          .when('/home', {
            templateUrl: 'views/home.html',
            reloadOnSearch: false,
            controller: 'HomeController'
          })
          .when('/home-refresh', {
            templateUrl: 'views/landing.html',
            controller: 'HomeRefreshController'
          })
          .when('/setup', {
            templateUrl: 'views/setup.html',
            controller: 'SetupController'
          })
          .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
          })
          .when('/logout', {
            templateUrl: 'views/landing.html',
            controller: 'LogoutController'
          })
          .when('/inbox', {
            templateUrl: 'views/inbox.html',
            controller: 'InboxController'
          })
          .when('/inbox/sent', {
            templateUrl: 'views/inbox.html',
            controller: 'InboxController'
          })
          .when('/inbox/bookmarked', {
            templateUrl: 'views/inbox.html',
            controller: 'InboxController'
          })
          .when('/inbox/messages/:id', {
            templateUrl: 'views/inbox.html',
            controller: 'InboxController'
          })
          .when('/inbox/compose', {
            templateUrl: 'views/compose.html',
            controller: 'ComposeController'
          })
          .when('/inbox/compose/:id', {
            templateUrl: 'views/compose.html',
            controller: 'ComposeController'
          })
          .when('/inbox/search', {
            templateUrl: 'views/inbox-search.html',
            controller: 'InboxSearchController'
          })
          .when('/inbox/search/sent', {
            templateUrl: 'views/inbox-search.html',
            controller: 'InboxSearchController'
          })
          .when('/inbox/search/bookmarked', {
            templateUrl: 'views/inbox-search.html',
            controller: 'InboxSearchController'
          })
          .when('/help', {
            templateUrl: 'views/help.html',
            controller: 'HelpController'
          })
          .when('/claims', {
            templateUrl: 'views/claims.html',
            controller: 'ClaimsController'
          })
          .when('/claims/search', {
            templateUrl: 'views/claims-search.html',
            controller: 'ClaimsController'
          })
          .when('/claims/filter', {
            templateUrl: 'views/claims-filter.html',
            controller: 'ClaimsController'
          })
          .when('/claims/:id/:dependentNo', {
            templateUrl: 'views/claims.html',
            controller: 'ClaimsController'
          })
          .when('/benefits', {
            templateUrl: 'views/benefits-in-network.html',
            reloadOnSearch: false,
            controller: 'BenefitsController'
          })
          .when('/medicare-benefits', {
            templateUrl: 'views/medicare-benefits.html',
            reloadOnSearch: false,
            controller: 'BenefitsController'
          })
          .when('/benefits/out-of-network', {
            templateUrl: 'views/benefits-out-of-network.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/tier1', {
            templateUrl: 'views/benefits-tier1-network.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/bbt-only', {
            templateUrl: 'views/benefits-bbt-only-info.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/tier2', {
            templateUrl: 'views/benefits-tier2-network.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/tieroon', {
            templateUrl: 'views/benefits-tier-out-of-network.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/preferinnetwork', {
            templateUrl: 'views/benefits-prefer-in-network.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/otherinnetwork', {
            templateUrl: 'views/benefits-other-in-network.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/otheroutofnetwork', {
            templateUrl: 'views/benefits-other-out-of-network.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/benefitsselectinnetwork', {
            templateUrl: 'views/benefits-select-in-network.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/benefitsselectoutnetwork', {
            templateUrl: 'views/benefits-select-out-network.html',
            controller: 'BenefitsController'
          })
          .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
          })
          .when('/faq', {
            templateUrl: 'views/faq.html',
            controller: 'FAQController'
          })
          .when('/healthnav', {
            templateUrl: 'views/health-nav.html',
            controller: 'HealthNavController'
          })
          .when('/settings', {
            templateUrl: 'views/settings.html',
            controller: 'SettingsController'
          })
          .when('/id-card', {
            templateUrl: 'views/id-card.html',
            controller: 'IdCardController'
          })
          .when('/customer-service', {
            templateUrl: 'views/customer-service.html',
            controller: 'CustomerServiceController'
          })
          .when('/feedback', {
            templateUrl: 'views/feedback.html',
            controller: 'FeedbackController'
          })
          .when('/benefits/viewcoverage', {
            templateUrl: 'views/benefits-coverage.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/dental-only', {
            templateUrl: 'views/benefits-dental-only.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/low-cost-dental-only', {
            templateUrl: 'views/benefits-low-cost-dental-only.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/vision-only', {
            templateUrl: 'views/benefits-vision-only.html',
            controller: 'BenefitsController'
          })
          .when('/benefits/contraceptive-only', {
            templateUrl: 'views/benefits-contraceptive-only.html',
            controller: 'BenefitsController'
          })
          .when('/billing', {
            templateUrl: 'views/billing-payments-landing.html',
            controller: 'BillingController'
          })
          .when('/edit-billing-method', {
            templateUrl: 'views/edit-billing-method.html',
            controller: 'EditBillingMethodPage'
          })
          .when('/update-autopay', {
            templateUrl: 'views/update-autopay.html',
            controller: 'UpdateAutoPayController'
          })
          .when('/stop-autopay', {
            templateUrl: 'views/stop-autopay.html',
            controller: 'StopAutoPayController'
          })
          .when('/billing-invoice-history', {
            templateUrl: 'views/billing-invoice-history.html',
            controller: 'BillingInvoiceHistory'
          })
          .when('/billing-history-filter', {
            templateUrl: 'views/billing-history-filter.html',
            controller: 'BillingHistoryFilter'
          })
          .when('/understand-invoice', {
            templateUrl: 'views/billing-history-understand-invoice.html',
            controller: 'BillingHistoryUnderstandInvoice'
          })
          .when('/payment/:step', {
            template: function($routeParams) {
              return [
                '<div class="payment-container ' + $routeParams.step + '">',
                '<payment-flow-page',
                'ng-if="billingInfo && step"',
                'localization="loc"',
                'step="' + $routeParams.step + '"',
                'tracker-info="trackerInfo"',
                'billing-info="billingInfo"',
                'validate-form="' + $routeParams.step + 'ValidateForm"',
                'navbar-details="navbarDetails"',
                '>',
                '</payment-flow-page>',
                '</div>'
              ].join(' ');
            },
            controller: 'PaymentFlowController'
          })
          .when('/edit-autopay-flow/:step', {
            templateUrl: 'views/edit-autopay-flow.html',
            controller: 'editAutopayFlow'
          })
          .when('/fad-auth/find-doctor', {
            templateUrl: 'views/find-doctor-authenticated.html',
            controller: 'FindDoctorAuthenticatedController'
          })
          .when('/find-doctor', {
            templateUrl: 'views/find-doctor.html',
            controller: 'FindDoctorController'
          })
          .when('/find-doctor-search', {
            templateUrl: 'views/find-doctor-search.html',
            controller: 'FindDoctorSearchController'
          })
          .when('/find-doctor-browser', {
            templateUrl: 'views/find-doctor-browser.html',
            controller: 'FindDoctorBrowserController'
          })
          .when('/find-doctor-search-results', {
            templateUrl: 'views/find-doctor-search-results.html',
            controller: 'FindDoctorSearchResultsController'
          })
          .when('/find-doctor-results-details', {
            templateUrl: 'views/find-doctor-results-details.html',
            controller: 'FindDoctorResultsDetailsController'
          })
          .when('/find-doctor-filter', {
            templateUrl: 'views/find-doctor-filter.html',
            controller: 'FindDoctorFilterController'
          })
          .when('/upgrade', {
            templateUrl: 'views/upgrade.html',
            controller: 'UpgradeController'
          })
          .when('/pcp-manage-dependents-pcp', {
            templateUrl: 'views/pcp-manage-dependents.html',
            controller: 'ManageDependentsPcpController'
          })
          .when('/find-doctor', {
            templateUrl: 'views/find-doctor.html',
            controller: 'FindDoctorController'
          })
          .when('/find-doctor-search', {
            templateUrl: 'views/find-doctor-search.html',
            controller: 'FindDoctorSearchController'
          })
          .when('/find-doctor-browser', {
            templateUrl: 'views/find-doctor-browser.html',
            controller: 'FindDoctorBrowserController'
          })
          .when('/find-care', {
            templateUrl: 'views/find-care.html',
            controller: 'FindCareController'
          })
          .when('/find-doctor-search-results', {
            templateUrl: 'views/find-doctor-search-results.html',
            controller: 'FindDoctorSearchResultsController'
          })
          .when('/find-doctor-results-details', {
            templateUrl: 'views/find-doctor-results-details.html',
            controller: 'FindDoctorResultsDetailsController'
          })
          .when('/find-doctor-filter', {
            templateUrl: 'views/find-doctor-filter.html',
            controller: 'FindDoctorFilterController'
          });
      }
    ]);
})();
