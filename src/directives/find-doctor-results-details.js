/**
 * Directive for the findDoctorResultsDetails.
 *
 * @namespace Directives
 * @class findDoctorResultsDetails
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.findDoctorResultsDetails', [])
    .directive('findDoctorResultsDetails', [
      function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'partials/find-doctor-results-details.html',
          scope: {
            findDoctorResultsDetails: '=',
            smartShopperDetails: '='
          },
          controller: [
            '$scope',
            '$rootScope',
            'languageService',
            'cordovaService',
            'TransparencyFactory',
            'findDoctorService',
            'helpService',
            'adobeService',
            'analyticConstants',
            function(
              $scope,
              $rootScope,
              languageService,
              cordovaService,
              TransparencyFactory,
              findDoctorService,
              helpService,
              adobeService,
              analyticConstants
            ) {

              $scope.loc = $rootScope.loc;
              $scope.gotoView = $rootScope.gotoView;
              $scope.noMatchPlanFound = $rootScope.noMatchPlanFound;
              $scope.medicareUser = ($rootScope.loggedIn &&
                $rootScope.selectedPolicy.sourceSystem === 'Amisys');

              $scope.showDetails =
                $scope.findDoctorResultsDetails.showMoreDetails;
              $scope.language = $rootScope.language || 'en';
              $scope.policyMembers = $rootScope.selectedPolicy && $rootScope.selectedPolicy.policyMembers && $rootScope.selectedPolicy.policyMembers.map(function(member) {
                var firstName = member.givenName[0] + member.givenName.slice(1).toLowerCase();
                var lastName = member.familyName[0] + member.familyName.slice(1).toLowerCase();
                member.displayMemberName = firstName + ' ' + lastName + ' (' + member.dependentNumber + ')';
                return member;
              });

              $scope.recommendedFlow = ($rootScope.loggedIn && $scope.findDoctorResultsDetails.recommendedFlow && $scope.findDoctorResultsDetails.viewPcpDetails);

              $scope.smartShopperTerm = TransparencyFactory.getSmartShopperTerm();
              $scope.showSmartShopper = ($rootScope.loggedIn && TransparencyFactory.getSmartShopperResultItem());

              var providerIdentifier = null;
              var practitionerIdentifier = null;
              var locationIdentifier = null;
              var nationalProviderIdentifier = null;
              var pcpChangeRequest = null;

              if ($scope.findDoctorResultsDetails.resultSummaryIdentifiers) {
                $scope.findDoctorResultsDetails.resultSummaryIdentifiers.forEach(function(eachType) {
                  switch (eachType.type_code) {
                    case 'SYP':
                      providerIdentifier = eachType.value;
                      break;
                    case 'FAI':
                      locationIdentifier = eachType.value;
                      break;
                    case 'SYI':
                      practitionerIdentifier = eachType.value;
                      break;
                    case 'NPI':
                      nationalProviderIdentifier = eachType.value;
                      break;
                  }
                });
              }

              if ($scope.findDoctorResultsDetails.changePcp) {
                $scope.findDoctorResultsDetails.changePcp.providerData =
                  $scope.findDoctorResultsDetails.cardData.summary;
                $scope.alertModalObj = $scope.findDoctorResultsDetails.changePcp;
              }

              $scope.selectPcpAlertModalObj = {
                title: $scope.loc.PCP_COMMERCIAL_DEPENDENT_BUTTON_SELECT_PCP,
                message: $scope.loc.PCP_COMMERCIAL_DEPENDENT_SELECTED_PCP,
                members: $scope.policyMembers,
                confirmBtn: $scope.loc.PCP_COMMERCIAL_DEPENDENT_BUTTON_SELECT_PCP,
              };

              if ($scope.findDoctorResultsDetails.isPcpFlow && !$scope.recommendedProviderData && !$scope.medicareUser) {
                pcpChangeRequest = {
                  memberId: $rootScope.selectedPolicy.externalId,
                  providerIdentifier: providerIdentifier,
                  practitionerIdentifier: practitionerIdentifier,
                  locationIdentifier: locationIdentifier,
                  policyEffectiveFromDate: $rootScope.selectedPolicy.effectiveDate,
                  policyEffectiveThruDate: $rootScope.selectedPolicy.expirationDate,
                  PCPNPI: nationalProviderIdentifier,
                  PCPName: $scope.findDoctorResultsDetails.cardData.summary.name,
                  lobCode: $rootScope.selectedPolicy.lobCode,
                  groupId: $rootScope.selectedPolicy.groupNumber
                };
              }


              $scope.toggleShowDetails = function() {
                if (
                  $scope.showDetails ===
                  $scope.findDoctorResultsDetails.showMoreDetails
                ) {
                  $scope.showDetails =
                    $scope.findDoctorResultsDetails.showLessDetails;
                } else {
                  $scope.showDetails =
                    $scope.findDoctorResultsDetails.showMoreDetails;
                }
              };

              $scope.openSmartShopper = function() {
                $scope.expandSmartShopperInfo = !$scope.expandSmartShopperInfo;
                $rootScope.healthNavTrackToggleActions('smartShopperClaimReward', 'info', $scope.expandSmartShopperInfo);
              };

              $scope.openChangePcpAlert = function() {
                $scope.displayMakeThisMyPcpError = false;
                if ($scope.policyMembers.length > 1) {
                  $scope.selectPcpAlertModalObj.members.map(function(member) {
                    member.SELECTED = false;
                  });
                  $scope.openSelectPcpModal();
                } else {
                  $scope.openAlertModal();
                }
              };

              $scope.openInfoModal = function() {
                $rootScope.headerTerm = $scope.smartShopperDetails.infoModalHeader;
                $scope.helpInfo = {
                  introText_1: $scope.smartShopperDetails.infoModalBody.introText_1,
                  introText_2: $scope.smartShopperDetails.infoModalBody.introText_2,
                  title: $scope.smartShopperDetails.infoModalBody.title,
                  contents: [
                    {
                      title: $scope.smartShopperDetails.infoModalBody.heading_1,
                      text: $scope.smartShopperDetails.infoModalBody.text_1,
                    },
                    {
                      title: $scope.smartShopperDetails.infoModalBody.heading_2,
                      text: $scope.smartShopperDetails.infoModalBody.text_2,
                    },
                    {
                      title: $scope.smartShopperDetails.infoModalBody.heading_3,
                      text: $scope.smartShopperDetails.infoModalBody.text_3,
                    }
                  ],
                  smartShopperInfo: true,
                };
                helpService.help($scope.helpInfo);
              };

              $scope.confirmFunc = function() {
                $scope.recommendedProviderData = ($scope.findDoctorResultsDetails.recommendedFlow && TransparencyFactory.getRecommendedPcpData()) ? TransparencyFactory.getRecommendedPcpData() : false;
                $rootScope.$emit('pageLoading');
                if ($scope.recommendedProviderData && $scope.medicareUser) {
                  pcpChangeRequest = {
                    memberId: $rootScope.selectedPolicy.externalId,
                    groupNumber: $rootScope.selectedPolicy.groupNumber,
                    lobCode: $rootScope.selectedPolicy.lobCode,
                    sourceSystem : $rootScope.selectedPolicy.sourceSystem,
                    npi: $scope.recommendedProviderData.npi,
                    pcpName: $scope.recommendedProviderData.fullName,
                    amisysPracticeCode: $scope.recommendedProviderData.affiliationId,
                  };
                } else if (!$scope.recommendedProviderData && $scope.medicareUser) {
                  pcpChangeRequest = {
                    memberId: $rootScope.selectedPolicy.externalId,
                    groupNumber: $rootScope.selectedPolicy.groupNumber,
                    lobCode: $rootScope.selectedPolicy.lobCode,
                    sourceSystem : $rootScope.selectedPolicy.sourceSystem,
                    npi: nationalProviderIdentifier,
                    pcpName: $scope.findDoctorResultsDetails.cardData.summary.name,
                    amisysPracticeCode: providerIdentifier,
                  };
                }
                findDoctorService.changePcp(pcpChangeRequest).then(function(res) {
                  $rootScope.$emit('pageLoaded');
                  if (res.successIndicator || res.success) {
                    $scope.ChangedMySelectedPcp = true;
                    $scope.findDoctorResultsDetails.cardData.ChangedMySelectedPcp =
                      $scope.ChangedMySelectedPcp;
                    adobeService.trackAction('pcpChangedSuccessful', analyticConstants.PCP_SECTION);
                  } else {
                    $scope.displayMakeThisMyPcpError = true;
                    adobeService.trackAction('pcpChangedFailed', analyticConstants.PCP_SECTION);
                  }
                }).catch(function() {
                  $scope.displayMakeThisMyPcpError = true;
                });
              };

              $scope.confirmPcpFunc = function(members) {
                var selectedMembers = [];
                members.forEach(function(member) {
                  if (member.SELECTED) {
                    selectedMembers.push(member);
                  }
                });

                var membersInfo = selectedMembers.map(function(member) {
                  var pcpChangeReqMembersData = {};
                  pcpChangeReqMembersData.memberId = member.externalSourceId + member.dependentNumber;
                  pcpChangeReqMembersData.policyEffectiveFromDate = member.enrollmentEffectiveDate;
                  pcpChangeReqMembersData.policyEffectiveThruDate = member.enrollmentExpirationDate;

                  return pcpChangeReqMembersData;
                });

                var pcpChangeRequest = {
                  providerInfo: {},
                  membersInfo: null
                };
                pcpChangeRequest.providerInfo.providerIdentifier = providerIdentifier;
                pcpChangeRequest.providerInfo.practitionerIdentifier = practitionerIdentifier;
                pcpChangeRequest.providerInfo.locationIdentifier = locationIdentifier;
                pcpChangeRequest.PCPNPI = nationalProviderIdentifier;
                pcpChangeRequest.PCPName = $scope.findDoctorResultsDetails.cardData.summary.name;
                pcpChangeRequest.lobCode = $rootScope.selectedPolicy.lobCode;
                pcpChangeRequest.groupId = $rootScope.selectedPolicy.groupNumber;
                pcpChangeRequest.membersInfo = membersInfo;

                $rootScope.$emit('pageLoading');
                findDoctorService.changeMultiPcp(pcpChangeRequest).then(function(res) {
                  $rootScope.$emit('pageLoaded');
                  res.forEach(function(eachRes) {
                    if (eachRes.updateSucceedStatus) {
                      $scope.ChangedMySelectedPcp = true;
                      adobeService.trackAction('pcpMultiChangedSuccessful', analyticConstants.PCP_SECTION, { dependentNumber: eachRes.dependentNumber });
                      if (eachRes.dependentNumber === '00') {
                        $scope.findDoctorResultsDetails.cardData.ChangedMySelectedPcp =
                          $scope.ChangedMySelectedPcp;
                      } else {
                        $scope.findDoctorResultsDetails.cardData.ChangedMyDependentSelectedPcp =
                          $scope.ChangedMySelectedPcp;
                      }
                    } else {
                      // to do: what to show if part requests fail
                      console.log('PCP update failed for this member: ', eachRes.dependentNumber);
                      adobeService.trackAction('pcpMultiChangedFailed', analyticConstants.PCP_SECTION, { dependentNumber: eachRes.dependentNumber });

                    }
                  });
                }).catch(function() {
                  $scope.serviceNotAvailable = true;
                  $scope.displayMakeThisMyPcpError = true;
                });
              };

              if ($rootScope.loggedIn) {
                $rootScope.showPolicySelect = false;
                $rootScope.showNav = false;
              } else {
                languageService
                  .getLocale($scope.language)
                  .then(function(localeReturned) {
                    $scope.loc = localeReturned;
                  })
                  .catch(console.warn);
              }

              $scope.goToHEQ = function() {
                return $rootScope.openInSecureBrowser('appsso:healthequity');
              };

              $scope.findDoctorResultsDetails.searchTerm = TransparencyFactory.getSearchTerm();
              TransparencyFactory.setResultsToShare(
                $scope.findDoctorResultsDetails
              );

              // Reset the results details card data, as it should be obtained again for each provider.
              TransparencyFactory.resetResultsDetails();

              if (!cordovaService.deviceIsBrowser()) {

                AppRate.promptForRating(false);

                AppRate.preferences = {
                  displayAppName: 'Blue Connect Mobile',
                  usesUntilPrompt: 1,
                  promptAgainForEachNewVersion: true,
                  simpleMode: true,
                  inAppReview: false,
                  storeAppURL: {
                    ios: '392607223',
                    android: 'market://details?id=com.bcbsnc.healthnav',
                  },
                  customLocale: {
                    title: $scope.loc.RATING_DID_YOU_FIND,
                    message: $scope.loc.RATING_PLEASE_RATE,
                    cancelButtonLabel: $scope.loc.RATING_NO_THANKS,
                    laterButtonLabel: $scope.loc.RATING_REMIND_ME_LATER,
                    rateButtonLabel: $scope.loc.RATING_RATE_IT_NOW,
                  },
                  callbacks: {
                    onRateDialogShow: function(callback) {
                      callback(1); // cause immediate click on 'Rate Now' button
                    },
                    onButtonClicked: function() {
                    },
                  },
                  openUrl: AppRate.preferences.openUrl,
                };
              }

              /* Search for other pcp take directly to all primary care providers results page"*/
              $scope.otherPcpSearch = function(searchInput) {
                $scope.searchTermId = '260005173';
                TransparencyFactory.setResultsTerm(searchInput.searchTerm);
                return $rootScope.gotoView(
                  searchInput.link +
                  '?id=' + $scope.searchTermId + '&network_id=' +
                  $rootScope.selectedPlan.id +
                  '&distance=' +
                  TransparencyFactory.getDistance() +
                  '&searchTerm=' +
                  searchInput.searchTerm +
                  '&zipCode=' +
                  TransparencyFactory.getCity().zip +
                  '&planName=' +
                  searchInput.planName +
                  '&isPcpFlow=true'
                );
              };
            },
          ],
        };
      },
    ]);
})();
