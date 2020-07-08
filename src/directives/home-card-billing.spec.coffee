describe 'Unit testing the billing home card', ->
  $compile = null
  $rootScope = null

  putAttrs = (text) ->
    JSON.stringify(text).replace /\"/g, '\''
  beforeEach ->
    module 'templates'
    module 'blueconnect.mobile.directives.homeCardBilling'
    module 'blueconnect.mobile.directives.paidComponent'
    module 'blueconnect.mobile.directives.invoicePayments'

  beforeEach inject (_$compile_, _$rootScope_) ->
    $compile = _$compile_
    $rootScope = _$rootScope_

  it 'Shows paid component when member is paid', ->
    paymentDetails =
      currentAmtDue: 0
      reinstatementAmount: 0
      processingPay: false
      reinstatementAmount: 0
      autoPay: false
    planDetails =
      active: true
      selectedPolicy:
        isNew: false

    # Compile a piece of HTML containing the directive
    elementTxt = """
      <home-card-billing
        payment-details=\"#{putAttrs(paymentDetails)}"
        plan-details=\"#{putAttrs(planDetails)}"
        billing-link=\"\'testdata.com/testlink\'\">
      </home-card-billing>
    """
    # console.log elementTxt
    element = $compile(elementTxt)($rootScope);
    $rootScope.$digest();
    returnedMarkup = element.html()
    # console.log returnedMarkup
    # Check that the compiled element contains the templated content
    expect(element.html()).toContain "<i class=\"paid-icon"

  it 'Shows invoice payment component when payments have been made within invoice period', ->
    paymentDetails =
      currentAmtDue: 100
      reinstatementAmount: 0
      processingPay: false
      reinstatementAmount: 0
      autoPay: false
      invoicePayments: [
        {
          paymentDate: '1/1/2017'
          paymentRejectReason: null
          paymentStatus: 'Successful'
          paymentAmount: '434.03'
        },
        {
          paymentDate: '1/2/2017'
          paymentRejectReason: null
          paymentStatus: 'Successful'
          paymentAmount: '434.03'
        }
      ]
    planDetails =
      active: true
      selectedPolicy:
        isNew: false

    # Compile a piece of HTML containing the directive
    elementTxt = """
      <home-card-billing
        payment-details=\"#{putAttrs(paymentDetails)}"
        plan-details=\"#{putAttrs(planDetails)}"
        billing-link=\"\'testdata.com/testlink\'\">
      </home-card-billing>
    """

    element = $compile(elementTxt)($rootScope);
    $rootScope.$digest();
    returnedMarkup = element.html()
    # Check that the compiled element contains the templated content
    expect(element.find('invoice-payments').length).toEqual 2

  it 'shows processing payment when the payment has not yet cleared', ->
    paymentDetails =
      currentAmtDue: 100
      reinstatementAmount: 0
      processingPay: false
      reinstatementAmount: 0
      autoPay: false
      invoicePayments: [
        {
          paymentDate: new Date().toISOString()
          paymentRejectReason: null
          paymentStatus: 'Pending'
          paymentAmount: '200.13'
        }
      ]
    planDetails =
      active: true
      selectedPolicy:
        isNew: false
    # Compile a piece of HTML containing the directive
    elementTxt = """
      <home-card-billing
        payment-details=\"#{putAttrs(paymentDetails)}"
        plan-details=\"#{putAttrs(planDetails)}"
        billing-link=\"\'testdata.com/testlink\'\">
      </home-card-billing>
    """

    element = $compile(elementTxt)($rootScope);
    $rootScope.$digest();
    returnedMarkup = element.html()
    # Check that the compiled element contains the templated content
    invoicePayments = element.find 'invoice-payments'
    expect(invoicePayments.length).toEqual 1
    expect(invoicePayments.find('payment-processing').length).toEqual 1

  it 'shows new policy message for new policies', ->
    paymentDetails =
      currentAmtDue: 0
      reinstatementAmount: 0
      processingPay: false
      reinstatementAmount: 0
      autoPay: false
      invoicePayments: []
    planDetails =
      active: true
      selectedPolicy:
        isNew: true
    # Compile a piece of HTML containing the directive
    elementTxt = """
      <home-card-billing
        payment-details=\"#{putAttrs(paymentDetails)}"
        plan-details=\"#{putAttrs(planDetails)}"
        billing-link=\"\'testdata.com/testlink\'\">
      </home-card-billing>
    """

    element = $compile(elementTxt)($rootScope);
    $rootScope.$digest();
    returnedMarkup = element.html()
    # Check that the compiled element contains the templated content
    newMemberInfo = element.find 'billing-summary-new-member'
    expect(newMemberInfo.length).toEqual 1
