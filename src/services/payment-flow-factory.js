(function() {
  /**
   * @typedef {Object} MailingAddress
   * @property {string} addressLine1
   * @property {string} addressLine2
   * @property {string} cityName
   * @property {string} stateCode
   * @property {string} postalCode
   *
   */
  angular
    .module('blueconnect.mobile.services.paymentFlowFactory', [])
    .factory('PaymentFlowFactory', [function() {
      var userSetData = {
        accountHolderName: null,
        accountNumber: null,
        accountType: null,
        bankName: null,
        billingMethod: null,
        confirmedAccountNumber: null,
        paymentAmount: null,
        paymentFrequency: null,
        paymentMethod: null,
        routingNumber:null,
        preferences: {
          emailAddress: null,
          mailingAddress: {
            addressLine1: null,
            addressLine2: null,
            cityName: null,
            stateCode: null,
            postalCode: null
          }
        },
        creditCardDetails: {
          lastFour: null,
          expiration: null,
          type: null,
          firstName: null,
          lastName: null,
          billToAddressLine1: null,
          billToAddressLine2: null,
          billToCity: null,
          billToState: null,
          billToZipCode: null,
          cvn: null
        },
        successConfirmationCode: null,
        signature: null,
        merchantReferenceCode: null,
        enrollmentProcessNumber: null,
        paymentBlob: null,
        paymentErrorCode: null,
        encryptedPaymentData: null
      };
      var paymentFlow = null;
      document.addEventListener("resume", onResumeClearPaymentInfo, false);
      /**
       * @namespace EventListeners
       * @name onResumeClearPaymentInfo
       * @description This method will clear the payment flow when the user backgrounds the app.
       * @function
       */
      function onResumeClearPaymentInfo() {
        reset();
      }
      return {
        setPaymentFlow: setPaymentFlow,
        getPaymentFlow: getPaymentFlow,
        setPaymentFrequency: setPaymentFrequency,
        getPaymentFrequency: getPaymentFrequency,
        setPaymentAmount: setPaymentAmount,
        getPaymentAmount: getPaymentAmount,
        setPaymentMethod: setPaymentMethod,
        getPaymentMethod: getPaymentMethod,
        setBillingMethod: setBillingMethod,
        getBillingMethod: getBillingMethod,
        getUserSetData: getUserSetData,
        getConfirmationCode: getConfirmationCode,
        getSignature: getSignature,
        setSignature: setSignature,
        getMerchantReferenceCode: getMerchantReferenceCode,
        setMerchantReferenceCode: setMerchantReferenceCode,
        getEnrollmentProcessNumber: getEnrollmentProcessNumber,
        setEnrollmentProcessNumber: setEnrollmentProcessNumber,
        getEmailAddress: getEmailAddress,
        setEmailAddress: setEmailAddress,
        getMailingAddress: getMailingAddress,
        getAccountHolderName: getAccountHolderName,
        setAccountHolderName: setAccountHolderName,
        getAccountNumber: getAccountNumber,
        setAccountNumber: setAccountNumber,
        getRoutingNumber: getRoutingNumber,
        setRoutingNumber: setRoutingNumber,
        getBankName: getBankName,
        setBankName: setBankName,
        getAccountType: getAccountType,
        setAccountType: setAccountType,
        getConfirmedAccountNumber: getConfirmedAccountNumber,
        setConfirmedAccountNumber: setConfirmedAccountNumber,
        resetCreditCardDetails: resetCreditCardDetails,
        reset: reset
      };
      function getSignature() {
        return userSetData.signature;
      }
      function setSignature(signature) {
        userSetData.signature = signature;
        return this;
      }
      function getMerchantReferenceCode() {
        return userSetData.merchantReferenceCode;
      }
      function setMerchantReferenceCode(merchantReferenceCode) {
        userSetData.merchantReferenceCode = merchantReferenceCode;
        return this;
      }
      function getEnrollmentProcessNumber() {
        return userSetData.enrollmentProcessNumber;
      }
      function setEnrollmentProcessNumber(enrollmentProcessNumber) {
        userSetData.enrollmentProcessNumber = enrollmentProcessNumber;
        return this;
      }
      function getEmailAddress() {
        return userSetData.preferences.emailAddress;
      }
      function setEmailAddress(emailAddress) {
        userSetData.preferences.emailAddress = emailAddress;
        return this;
      }
      function getConfirmationCode() {
        return userSetData.successConfirmationCode;
      }
      function setPaymentFlow(desiredPaymentFlow) {
        paymentFlow = desiredPaymentFlow;
        return this;
      }
      function getPaymentFlow() {
        return paymentFlow;
      }
      function setPaymentFrequency(frequency) {
        userSetData.paymentFrequency = frequency;
        return this;
      }
      function getPaymentFrequency() {
        return userSetData.paymentFrequency;
      }
      function setPaymentAmount(amount) {
        userSetData.paymentAmount = amount;
        return this;
      }
      function getPaymentAmount() {
        return userSetData.paymentAmount;
      }
      function setPaymentMethod(method) {
        userSetData.paymentMethod = method;
        return this;
      }
      function getPaymentMethod() {
        return userSetData.paymentMethod;
      }
      function setBillingMethod(method) {
        userSetData.billingMethod = method;
        return this;
      }
      function getBillingMethod() {
        return userSetData.billingMethod;
      }
      function getUserSetData() {
        return userSetData;
      }
      /**
       * return {MailingAddress}
       */
      function getMailingAddress() {
        return userSetData.preferences.mailingAddress;
      }
      function getAccountHolderName() {
        if (!userSetData.accountHolderName) {
          if (userSetData.creditCardDetails.firstName && userSetData.creditCardDetails.lastName) {
            return userSetData.creditCardDetails.firstName + ' ' + userSetData.creditCardDetails.lastName;
          }
        }
        return userSetData.accountHolderName;
      }
      function setAccountHolderName(accountHolderName) {
        userSetData.accountHolderName = accountHolderName;
        return this;
      }
      function getAccountType(accountType) {
        return userSetData.accountType;
      }
      function setAccountType(accountType) {
        userSetData.accountType = accountType;
        return this;
      }
      function getRoutingNumber() {
        return userSetData.routingNumber;
      }
      function setRoutingNumber(routingNumber) {
        userSetData.routingNumber = routingNumber;
        return this;
      }
      function getBankName() {
        return userSetData.bankName;
      }
      function setBankName(bankName) {
        userSetData.bankName = bankName;
        return this;
      }
      function getAccountNumber() {
        return userSetData.accountNumber;
      }
      function setAccountNumber(accountNumber) {
        userSetData.accountNumber = accountNumber;
        return this;
      }
      function getConfirmedAccountNumber() {
        return userSetData.confirmedAccountNumber;
      }
      function setConfirmedAccountNumber(confirmedAccountNumber) {
        userSetData.confirmedAccountNumber = confirmedAccountNumber;
        return this;
      }

      function resetCreditCardDetails() {
        userSetData.creditCardDetails.lastFour = null;
        userSetData.creditCardDetails.firstName = null;
        userSetData.creditCardDetails.month = null;
        userSetData.creditCardDetails.year = null;
        userSetData.creditCardDetails.cvn = null;
      }
      /**
       * Recuresively sets the factory object and it's sub-object values to null without
       * flattening the structure.
       */
      function reset() {
        setPropertiesToNull(userSetData);
        function setPropertiesToNull(obj) {
          Object.keys(obj).forEach(function(key) {
            if (obj[key] !== null && key !== 'paymentMethod' && key !== 'mailingAddress') {

              if (typeof obj[key] === 'object' && !$.isEmptyObject(obj[key])) {
                setPropertiesToNull(obj[key]);
              } else {
                obj[key] = null;
              }
            }
          });
        }
      }
    }])
})();
