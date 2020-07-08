(function() {
  angular
    .module('blueconnect.mobile.services.transparencyFactory', [])
    .factory('TransparencyFactory', [
      '$rootScope',
      'languageService',
      function($rootScope, languageService) {
        if (!$rootScope.loggedIn) {
          $rootScope.loc = languageService.getInternalLocale($rootScope.language || 'en');
        }

        var userSetData = {
          zipCode: null,
          currentLocationZipCode: null,
          city: null,
          distance: 25,
          selectedPlan: {},
          searchTerm: null,
          browseTerm: null,
          resultsTerm: null,
          resultsDetailsTerm: null,
          resultsDetailsIndex: null,
          resultsDetailsItemLabel: null,
          resultsDetailsItem: null,
          resultsDetailsNetworksAccepted: null,
          resultsDetailsSpecialties: null,
          resultsDetailsCredentials: null,
          resultsDetailsAwards: null,
          resultsDetailsLanguages: null,
          resultsDetailsAmenities: null,
          resultsDetailsAffiliations: null,
          resultsDetailsLimitations: null,
          resultsDetailsIdentifiers: null,
          geoLocationStatus: false,
          zipRangeNC: null,
          resultsToShare: null,
          existingSearchResults: null,
          isLocationBlocked: false,
          locationMsg: null,
          filterTier: '',
          filterSpecialty: '',
          filterGender: '',
          currentPolicyMembers: null,
          selectedMember: null,
          procedureId: null,
          filtersData: null,
          filterDistance: null,
          filterZipCode: null,
          filterCityname: null,
          displaySmartShopper: null,
          smartShopperTerm: null,
          smartShopperFilter: null,
          selectedRecommendedPcpData: null,
        };

        return {
          getUserSetData: getUserSetData,
          getZipCode: getZipCode,
          setZipCode: setZipCode,
          setCity: setCity,
          getCity: getCity,
          resetCity: resetCity,
          getCurrentLocationZipCode: getCurrentLocationZipCode,
          setCurrentLocationZipCode: setCurrentLocationZipCode,
          getDistance: getDistance,
          setDistance: setDistance,
          getSelectedPlan: getSelectedPlan,
          setSelectedPlan: setSelectedPlan,
          getSearchTerm: getSearchTerm,
          setSearchTerm: setSearchTerm,
          setResultsProcedureId: setResultsProcedureId,
          getResultsProcedureId: getResultsProcedureId,
          getBrowseTerm: getBrowseTerm,
          setBrowseTerm: setBrowseTerm,
          setBrowseLevelTwoTerm: setBrowseLevelTwoTerm,
          getBrowseLevelTwoTerm: getBrowseLevelTwoTerm,
          resetSearchCriteria: resetSearchCriteria,
          resetSearchTerms: resetSearchTerms,
          getGeoLocationStatus: getGeoLocationStatus,
          setGeoLocationStatus: setGeoLocationStatus,
          validateZipCode: validateZipCode,
          validateCity: validateCity,
          getZipRangeNC: getZipRangeNC,
          setZipRangeNC: setZipRangeNC,
          getResultsToShare: getResultsToShare,
          setResultsToShare: setResultsToShare,
          getExistingSearchResults: getExistingSearchResults,
          setExistingSearchResults: setExistingSearchResults,
          setLocationBlocked: setLocationBlocked,
          getLocationBlocked: getLocationBlocked,
          setLocationMsg: setLocationMsg,
          getLocationMsg: getLocationMsg,
          setResultsTerm: setResultsTerm,
          getResultsTerm: getResultsTerm,
          setResultsDetailsTerm: setResultsDetailsTerm,
          getResultsDetailsTerm: getResultsDetailsTerm,
          setResultsDetailsItemLabel: setResultsDetailsItemLabel,
          getResultsDetailsItemLabel: getResultsDetailsItemLabel,
          setResultDetailsItem: setResultDetailsItem,
          getResultsDetailsItem: getResultsDetailsItem,
          setResultsDetailsIndex: setResultsDetailsIndex,
          getResultsDetailsIndex: getResultsDetailsIndex,
          setResultsDetailsNetworksAccepted: setResultsDetailsNetworksAccepted,
          getResultsDetailsNetworksAccepted: getResultsDetailsNetworksAccepted,
          setResultsDetailsSpecialties: setResultsDetailsSpecialties,
          getResultsDetailsSpecialties: getResultsDetailsSpecialties,
          setResultsDetailsCredentials: setResultsDetailsCredentials,
          getResultsDetailsCredentials: getResultsDetailsCredentials,
          setResultsDetailsAwards: setResultsDetailsAwards,
          getResultsDetailsAwards: getResultsDetailsAwards,
          getResultsDetailsLanguages: getResultsDetailsLanguages,
          hasResultsDetailsLanguages: hasResultsDetailsLanguages,
          setResultsDetailsLanguages: setResultsDetailsLanguages,
          getResultsDetailsAmenities: getResultsDetailsAmenities,
          hasResultsDetailsAmenities: hasResultsDetailsAmenities,
          setResultsDetailsAmenities: setResultsDetailsAmenities,
          getResultsDetailsAffiliations: getResultsDetailsAffiliations,
          hasResultsDetailsAffiliations: hasResultsDetailsAffiliations,
          setResultsDetailsAffiliations: setResultsDetailsAffiliations,
          getResultsDetailsLimitations: getResultsDetailsLimitations,
          hasResultsDetailsLimitations: hasResultsDetailsLimitations,
          setResultsDetailsLimitations: setResultsDetailsLimitations,
          getResultsDetailsIdentifiers: getResultsDetailsIdentifiers,
          hasResultsDetailsIdentifiers: hasResultsDetailsIdentifiers,
          setResultsDetailsIdentifiers: setResultsDetailsIdentifiers,
          setFilterTierSelectedTerm: setFilterTierSelectedTerm,
          getFilterTierSelectedTerm: getFilterTierSelectedTerm,
          setFilterSpecialtySelectedTerm: setFilterSpecialtySelectedTerm,
          getFilterSpecialtySelectedTerm: getFilterSpecialtySelectedTerm,
          setFilterGenderSelectedTerm: setFilterGenderSelectedTerm,
          getFilterGenderSelectedTerm: getFilterGenderSelectedTerm,
          setSearchSpecialtyId: setSearchSpecialtyId,
          getSearchSpecialtyId: getSearchSpecialtyId,
          setCurrentPolicyMembers: setCurrentPolicyMembers,
          getCurrentPolicyMembers: getCurrentPolicyMembers,
          setSelectedMember: setSelectedMember,
          getSelectedMember: getSelectedMember,
          resetResultsDetails: resetResultsDetails,
          resetFilterData: resetFilterData,
          setFiltersData: setFiltersData,
          getFiltersData: getFiltersData,
          setFilterDistance: setFilterDistance,
          getFilterDistance: getFilterDistance,
          setFilterZipCode: setFilterZipCode,
          getFilterZipCode: getFilterZipCode,
          setFilterCityName: setFilterCityName,
          getFilterCityName: getFilterCityName,
          setSmartShopperResultItem: setSmartShopperResultItem,
          getSmartShopperResultItem: getSmartShopperResultItem,
          setSmartShopperTerm: setSmartShopperTerm,
          getSmartShopperTerm: getSmartShopperTerm,
          setSmartShopperFilter: setSmartShopperFilter,
          getSmartShopperFilter: getSmartShopperFilter,
          setRecommendedPcpData: setRecommendedPcpData,
          getRecommendedPcpData: getRecommendedPcpData,
        };

        function getUserSetData() {
          return userSetData;
        }
        function getZipCode() {
          return userSetData.zipCode;
        }
        function setZipCode(zipCode) {
          userSetData.zipCode = zipCode;
          return this;
        }
        function getCity() {
          return userSetData.city;
        }
        function setCity(cityObj) {
          userSetData.city = cityObj;
          return this;
        }
        function resetCity(cityFullName) {
          console.log('called reset city!');
          userSetData.city = null;
          userSetData.city = { cityFullName: cityFullName };
          return this;
        }
        function getCurrentLocationZipCode() {
          return userSetData.currentLocationZipCode;
        }
        function setCurrentLocationZipCode(zipCode) {
          userSetData.currentLocationZipCode = zipCode;
          return this;
        }
        function getDistance() {
          return userSetData.distance;
        }
        function setDistance(distance) {
          userSetData.distance = distance;
          return this;
        }
        function getSelectedPlan() {
          return userSetData.selectedPlan;
        }
        function setSelectedPlan(plan) {
          userSetData.selectedPlan = plan;
          return this;
        }
        function setResultsProcedureId(procedureId) {
          userSetData.procedureId = procedureId;
          return this;
        }
        function getResultsProcedureId() {
          return userSetData.procedureId;
        }
        function getSearchTerm() {
          return userSetData.searchTerm;
        }
        function setSearchTerm(term) {
          // Set.
          userSetData.searchTerm = term;

          // Reset index if there is one.
          setResultsDetailsIndex(null);

          // Return.
          return this;
        }
        function getBrowseTerm() {
          return userSetData.browseTerm;
        }
        function setBrowseTerm(term) {
          // Set.
          userSetData.browseTerm = term;

          // Reset index if there is one.
          setResultsDetailsIndex(null);

          // Return.
          return this;
        }

        function getBrowseLevelTwoTerm() {
          return userSetData.browseLevelTwoTerm;
        }
        function setBrowseLevelTwoTerm(term) {
          // Set.
          userSetData.browseLevelTwoTerm = term;

          // Reset index if there is one.
          setResultsDetailsIndex(null);

          // Return.
          return this;
        }
        function getGeoLocationStatus() {
          return userSetData.geoLocationStatus;
        }
        function setGeoLocationStatus(status) {
          userSetData.geoLocationStatus = status;
          return this;
        }

        function getZipRangeNC() {
          return userSetData.zipRangeNC;
        }
        function setZipRangeNC(zipMin, zipMax) {
          userSetData.zipRangeNC = { min: zipMin, max: zipMax };
          return this;
        }

        function resetSearchTerms() {
          setSearchTerm(null);
          setBrowseTerm(null);
          setResultsTerm(null);
        }

        function resetSearchCriteria() {
          setZipCode(null);
          setDistance(25);
        }

        function validateZipCode(zipCode) {
          const isNorthCarolinaPlan =
            userSetData.selectedPlan.isNorthCarolinaPlan;
          var retVal = { status: true, message: null };

          if (!zipCode || zipCode.toString().length <= 0) {
            retVal.message = $rootScope.loc.ERROR_REQUIRED;
            retVal.status = false;
            return retVal;
          }
          if (!/^[0-9]{5}(?:-[0-9]{4})?$/.test(zipCode.toString())) {
            retVal.message = $rootScope.loc.ERROR_ZIP_CODE_MUST_BE_5_DIGITS;
            retVal.status = false;
            return retVal;
          }
          if (!/^(?!0{3})[0-9]{3,5}$/.test(zipCode.toString())) {
            retVal.message = $rootScope.loc.ERROR_LOCATION_NOT_FOUND;
            retVal.status = false;
            return retVal;
          }
          if (
            isNorthCarolinaPlan &&
            (zipCode < userSetData.zipRangeNC.min ||
              zipCode > userSetData.zipRangeNC.max)
          ) {
            retVal.message = $rootScope.loc.ERROR_MUST_BE_NC_CITY_COUNTY_ZIP_CODE;
            retVal.status = false;
            return retVal;
          } else {
            return retVal;
          }
        }

        function validateCity(cityObj) {
          const isNorthCarolinaPlan =
            userSetData.selectedPlan.isNorthCarolinaPlan;

          var retVal = { status: true, message: null };

          if (!cityObj || !cityObj.cityFullName || typeof cityObj.cityFullName === 'undefined' || cityObj.cityFullName.length <= 0) {
            retVal.message = $rootScope.loc.ERROR_REQUIRED;
            retVal.status = false;
            return retVal;
          }
          if (cityObj && (!cityObj.zip || typeof cityObj.zip === 'undefined')) {
            retVal.message = $rootScope.loc.ERROR_SELECT_FROM_DROPDOWN_LIST;
            retVal.status = false;
            return retVal;
          }
          if (
            cityObj &&
            cityObj.zip &&
            isNorthCarolinaPlan &&
            (cityObj.zip < userSetData.zipRangeNC.min ||
              cityObj.zip > userSetData.zipRangeNC.max)
          ) {
            retVal.message = $rootScope.loc.ERROR_MUST_BE_NC_CITY_COUNTY_ZIP_CODE;
            retVal.status = false;
            return retVal;
          } else {
            return retVal;
          }
        }

        function getResultsToShare() {
          return userSetData.resultsToShare;
        }

        function setResultsToShare(resultsToShare) {
          userSetData.resultsToShare = resultsToShare;
          return this;
        }

        function getExistingSearchResults() {
          return userSetData.existingSearchResults;
        }

        function setExistingSearchResults(searchResults) {
          userSetData.existingSearchResults = searchResults;
          return this;
        }

        function setLocationBlocked(isBlocked) {
          userSetData.isLocationBlocked = isBlocked;
          return this;
        }

        function getLocationBlocked() {
          return userSetData.isLocationBlocked;
        }

        function setLocationMsg(blockedMsg) {
          userSetData.locationMsg = blockedMsg;
          return this;
        }

        function getLocationMsg() {
          return userSetData.locationMsg;
        }

        function setResultsTerm(resultsTerm) {
          // Set.
          userSetData.resultsTerm = resultsTerm;

          // Reset index, if there is one, due to new results term.
          setResultsDetailsIndex(null);

          // Return.
          return this;
        }

        function getResultsTerm() {
          return userSetData.resultsTerm;
        }

        function setResultsDetailsTerm(resultsDetailsTerm) {
          userSetData.resultsDetailsTerm = resultsDetailsTerm;
          return this;
        }

        function getResultsDetailsTerm() {
          return userSetData.resultsDetailsTerm;
        }

        function setResultsDetailsItemLabel(resultsDetailsItemLabel) {
          userSetData.resultsDetailsItemLabel = resultsDetailsItemLabel;
          return this;
        }

        function getResultsDetailsItemLabel() {
          return userSetData.resultsDetailsItemLabel;
        }

        function setResultsDetailsIndex(resultsDetailsIndex) {
          userSetData.resultsDetailsIndex = resultsDetailsIndex;
          return this;
        }

        function getResultsDetailsIndex() {
          return userSetData.resultsDetailsIndex;
        }

        function getResultsDetailsItem() {
          return userSetData.resultsDetailsItem;
        }

        function setResultDetailsItem(resultsDetailsItem) {
          userSetData.resultsDetailsItem = resultsDetailsItem;
          return this;
        }

        function setResultsDetailsNetworksAccepted(networksAccepted) {
          userSetData.resultsDetailsNetworksAccepted = networksAccepted;
          return this;
        }

        function getResultsDetailsNetworksAccepted() {
          return userSetData.resultsDetailsNetworksAccepted;
        }

        function setResultsDetailsSpecialties(specialties) {
          userSetData.resultsDetailsSpecialties = specialties;
          return this;
        }

        function getResultsDetailsSpecialties() {
          return userSetData.resultsDetailsSpecialties;
        }

        function setResultsDetailsCredentials(credentials) {
          userSetData.resultsDetailsCredentials = credentials;
          return this;
        }

        function getResultsDetailsCredentials() {
          return userSetData.resultsDetailsCredentials;
        }

        function setResultsDetailsAwards(awards) {
          userSetData.resultsDetailsAwards = awards;
          return this;
        }

        function getResultsDetailsAwards() {
          return userSetData.resultsDetailsAwards;
        }

        function setFilterTierSelectedTerm(tierItem) {
          userSetData.filterTier = tierItem;
          return this;
        }
        function getFilterTierSelectedTerm() {
          return userSetData.filterTier;
        }

        function setFilterSpecialtySelectedTerm(specialtyItem) {
          userSetData.filterSpecialty = specialtyItem;
          return this;
        }
        function getFilterSpecialtySelectedTerm() {
          return userSetData.filterSpecialty;
        }

        function setFilterGenderSelectedTerm(genderItem) {
          userSetData.filterGender = genderItem;
          return this;
        }

        function getFilterGenderSelectedTerm() {
          return userSetData.filterGender;
        }

        function setSearchSpecialtyId(searchId) {
          userSetData.searchSpecialtyId = searchId;
          return this;
        }

        function getSearchSpecialtyId() {
          return userSetData.searchSpecialtyId;
        }

        function setCurrentPolicyMembers(members) {
          userSetData.currentPolicyMembers = members;
          return this;
        }

        function getCurrentPolicyMembers() {
          return userSetData.currentPolicyMembers;
        }

        function setSelectedMember(member) {
          userSetData.selectedMember = member;
          return this;
        }

        function getSelectedMember() {
          return userSetData.selectedMember;
        }

        function hasResultsDetailsLanguages() {
          return !!userSetData.resultsDetailsLanguages;
        }

        function getResultsDetailsLanguages() {
          return userSetData.resultsDetailsLanguages;
        }

        function setResultsDetailsLanguages(languages) {
          userSetData.resultsDetailsLanguages = languages;
          return this;
        }

        function hasResultsDetailsAmenities() {
          return !!userSetData.resultsDetailsAmenities;
        }

        function getResultsDetailsAmenities() {
          return userSetData.resultsDetailsAmenities;
        }

        function setResultsDetailsAmenities(amenities) {
          userSetData.resultsDetailsAmenities = amenities;
          return this;
        }

        function hasResultsDetailsAffiliations() {
          return !!userSetData.resultsDetailsAffiliations;
        }

        function getResultsDetailsAffiliations() {
          return userSetData.resultsDetailsAffiliations;
        }

        function setResultsDetailsAffiliations(affiliations) {
          userSetData.resultsDetailsAffiliations = affiliations;
          return this;
        }

        function hasResultsDetailsLimitations() {
          return !!userSetData.resultsDetailsLimitations;
        }

        function getResultsDetailsLimitations() {
          return userSetData.resultsDetailsLimitations;
        }

        function setResultsDetailsLimitations(limitations) {
          userSetData.resultsDetailsLimitations = limitations;
          return this;
        }

        function hasResultsDetailsIdentifiers() {
          return !!userSetData.resultsDetailsIdentifiers;
        }

        function getResultsDetailsIdentifiers() {
          return userSetData.resultsDetailsIdentifiers;
        }

        function setResultsDetailsIdentifiers(identifiers) {
          userSetData.resultsDetailsIdentifiers = identifiers;
          return this;
        }

        function resetResultsDetails() {
          // Reset values.
          userSetData.resultsDetailsAffiliations = null;
          userSetData.resultsDetailsAmenities = null;
          userSetData.resultsDetailsAwards = null;
          userSetData.resultsDetailsCredentials = null;
          userSetData.resultsDetailsIdentifiers = null;
          userSetData.resultsDetailsLanguages = null;
          userSetData.resultsDetailsLimitations = null;
          userSetData.resultsDetailsNetworksAccepted = null;
          userSetData.resultsDetailsSpecialties = null;

          // Return.
          return this;
        }

        function resetFilterData() {
          setFilterSpecialtySelectedTerm('');
          setFilterTierSelectedTerm('');
          setFilterGenderSelectedTerm('');
          return this;
        }

        function setFiltersData(filtersData) {
          userSetData.filtersData = filtersData;
        }

        function getFiltersData() {
          return userSetData.filtersData;
        }

        function setFilterDistance(filterDistance) {
          userSetData.filterDistance = filterDistance;
        }

        function getFilterDistance() {
          return userSetData.filterDistance;
        }

        function setFilterZipCode(filterZipCode) {
          userSetData.filterZipCode = filterZipCode;
        }

        function getFilterZipCode() {
          return userSetData.filterZipCode;
        }

        function setFilterCityName(filterCityname) {
          userSetData.filterCityname = filterCityname;
        }

        function getFilterCityName() {
          return userSetData.filterCityname;
        }

        function setSmartShopperResultItem(smartShopperValue) {
          userSetData.displaySmartShopper = ($rootScope.isSmartShopperEligible && smartShopperValue) ? true : false;
        }

        function getSmartShopperResultItem() {
          return userSetData.displaySmartShopper;
        }
        function setSmartShopperTerm(searchTerm, preposition) {
          userSetData.smartShopperTerm = {
            searchTerm: searchTerm,
            preposition: preposition || ''
          };
        }

        function getSmartShopperTerm() {
          return userSetData.smartShopperTerm;
        }
        function setSmartShopperFilter(value) {
          userSetData.smartShopperFilter = value;
        }

        function getSmartShopperFilter() {
          return userSetData.smartShopperFilter;
        }
        function setRecommendedPcpData(providerData) {
          userSetData.selectedRecommendedPcpData = providerData;
        }

        function getRecommendedPcpData() {
          return userSetData.selectedRecommendedPcpData;
        }
      },
    ]);
})();
