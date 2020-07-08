/**
 * Services for the retrieval and setting of language.
 *
 * @namespace Services
 * @class languageService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.language', [
    'bcbsnc.cloud.services.rest'
  ])
  .service('languageService', [
    '$q',
    '$rootScope',
    'restService',
    function($q, $rootScope, restService) {
      $rootScope.loc = $rootScope.loc || {};
      /**
      * The current language.
      *
      * @memberof languageService
      * @member {String} language
      */
      this.language = 'en';

      /**
       * Sets the language of the app. If no language is provided, retrieves the default language.
       *
       * @memberof languageService
       * @method setLanguage
       * @param  {String} [lang] i18n language code
       * @return {Promise} A promise that resolves to function(language)
       */
      this.setLanguage = function(lang) {
        var self = this;
        lang = lang || self.getDefaultLanguage().substr(0, 2);
        self.language = lang;
        $rootScope.$emit('languageChanged', {lang: lang});
        return $q.resolve(lang);
      };

      /**
       * Retrieves the default language from the phone or browser.
       *
       * @memberof languageService
       * @method getDefaultLanguage
       * @return {Promise} A promise that resolves to function(language)
       */
      this.getDefaultLanguage = function() {
        return navigator.language.substr(0, 2);
      };

      /**
       * Retrieves the locale object for the provided language from the data service.
       *
       * @memberof languageService
       * @method getLocale
       * @param  {String} lang i18n language code
       * @return {Promise} A promise that resolves to function(locale)
       */
      this.getLocale = function(lang) {
        return restService.getData('locale', lang, {loggedIn : $rootScope.loggedIn});
      };

      /**
       * Retrieves the internal (offline) locale object for the provided language.
       *
       * @memberof languageService
       * @method getInternalLocale
       * @param  {String} lang i18n language code
       * @return {Object} The internal locale
       */
      this.getInternalLocale = function(lang) {
        lang = lang || this.language;
        var internalLocale = {
          en: {
            LOG_IN: 'Log In',
            REGISTER: 'Register',
            LOG_IN_FIND_A_MED_SERVICE_LINK: 'Find a Doctor, Drug or Facility',
            MENU_FIND_A_MED_SERVICE_LINK: 'Find a Doctor | Drug | Facility',
            DISTANCE_AND_ZIP_CODE: 'Distance and ZIP Code',
            DISTANCE: 'Distance',
            FIND_CARE_NAME: 'Name',
            FIND_CARE_ADDRESS: 'Address',
            FROM_ZIP_CODE: 'From ZIP Code',
            FROM_CITY_COUNTY_OR_ZIP_CODE: 'From City, County, or ZIP Code',
            ERROR_MUST_BE_NC_ZIP_CODE: 'Must be NC ZIP Code',
            ERROR_MUST_BE_NC_CITY_COUNTY_ZIP_CODE: 'Must be a NC City, County, or ZIP Code',
            ERROR_ZIP_CODE_MUST_BE_5_DIGITS: 'ZIP Code must be 5 digits',
            ERROR_REQUIRED: 'Required',
            ERROR_LOCATION_NOT_FOUND: 'Location not found. Please try again.',
            ERROR_ENTER_ZIP_CODE: 'Your current location cannot be found. Please enter a ZIP Code.',
            ERROR_ENTER_CITY_COUNTY_OR_ZIP_CODE: 'Your current location cannot be found. Please enter a City, County or ZIP Code.',
            SHARE: 'Share',
            HEALTH_PLAN: 'Health Plan:',
            MILES: 'Miles',
            ENGLISH: 'English',
            ESPANOL: 'Español',
            USER_ID: 'User ID',
            REMEMBER: 'Remember?',
            PASSWORD: 'Password',
            FORGOT: 'Forgot?',
            FORGOT_PASSWORD: 'Forgot your password?',
            STAY_LOGGED_IN: 'Keep me logged in for 75 days',
            OK: 'OK',
            CANCEL: 'Cancel',
            CONTINUE: 'Continue',
            EXTERNAL_LINK: 'Open Web Link',
            EXTERNAL_LINK_WARNING: 'You are leaving Blue Connect Mobile. Would you like to continue?',
            LOGIN_INVALID: 'Please enter a valid user ID and Password',
            NETWORK_ERROR: 'Network Error',
            ERROR_NETWORK_BADCONNECTION: 'No Network Connection',
            NETWORK_ERROR_MESSAGE: 'We\'re experiencing technical difficulties. Please check your internet connection and try again.',
            SERVICE_ERROR_MESSAGE: 'Sorry, we\'re experiencing technical difficulties. Would you like to go back to your Home Page?',
            HELP: 'Help',
            CONFIRM_FINGERPRINT: 'Confirm Your Fingerprint',
            ENABLE_TOUCH_ID: 'Enable Touch ID',
            ENABLE_FACE_ID: 'Enable Face ID',
            ENABLE_FINGERPRINT_AUTH: 'Enable Fingerprint ID',
            SETTINGS_LOGIN_KEY_TOUCH_ID: 'Touch ID',
            SETTINGS_LOGIN_KEY_FACE_ID: 'Face ID',
            FINGERPRINT_AUTH: 'Fingerprint ID',
            ERROR_NOT_ACCESSIBLE: 'Blue Connect Mobile is not accessible at this time. We apologize for the inconvenience.',
            ERROR_CAN_LOGIN_NO_CLAIMS_BENEFITS: 'Some areas of Blue Connect Mobile are unavailable due to technical issues. Thank you for your patience.',
            ERROR_MAINTENANCE: 'Blue Connect Mobile is scheduled for maintenance ',
            ERROR_MAINTENANCE_LINE2: ' and may be unavailable during that time. We apologize for the inconvenience.',
            ERROR_SELECT_FROM_DROPDOWN_LIST: 'You must select a location from the drop-down list.',
          }, es: {
            LOG_IN: 'Ingresar',
            REGISTER: 'Registrarse',
            LOG_IN_FIND_A_MED_SERVICE_LINK: 'Encuentre un médico,medicamento o establecimiento',
            MENU_FIND_A_MED_SERVICE_LINK: 'Encuentre un médico | medicamento | establecimiento médico',
            DISTANCE_AND_ZIP_CODE: 'Distancia y código postal',
            DISTANCE: 'Distancia',
            FIND_CARE_NAME: 'Nombre',
            FIND_CARE_ADDRESS: 'Dirección',
            FROM_ZIP_CODE: 'Desde el código postal',
            FROM_CITY_COUNTY_OR_ZIP_CODE: 'De ciudad, condado o código postal',
            ERROR_MUST_BE_NC_ZIP_CODE: 'Debe ser un código postal de Carolina del Norte',
            ERROR_MUST_BE_NC_CITY_COUNTY_ZIP_CODE: 'Debe ser una ciudad, condado o código postal de Carolina del Norte',
            ERROR_ZIP_CODE_MUST_BE_5_DIGITS: 'El código postal debe tener cinco dígitos',
            ERROR_REQUIRED: ' Información requerida',
            ERROR_LOCATION_NOT_FOUND: 'Ubicación no encontrada. Inténtalo de nuevo por favor.',
            ERROR_ENTER_ZIP_CODE: 'Your current location cannot be found. Please enter a ZIP Code.',
            ERROR_ENTER_CITY_COUNTY_OR_ZIP_CODE: 'No se puede encontrar su ubicación actual. Introduzca una ciudad, condado o código postal.',
            SHARE: 'Compartir',
            HEALTH_PLAN: 'Seguro médico:',
            MILES: 'Millas',
            ENGLISH: 'English',
            ESPANOL: 'Español',
            USER_ID: 'Identificación del usuario:',
            REMEMBER: '¿Recuerda?',
            PASSWORD: 'Contraseña',
            FORGOT: '¿La olvidó?',
            FORGOT_PASSWORD: '¿Olvidaste tu contraseña?',
            STAY_LOGGED_IN: 'Mantener mi sesión iniciada durante 75 días',
            OK: 'Aprobado',
            CANCEL: 'Cancelar',
            CONTINUE: 'Continuar',
            ID_CARD_VIEWING_CARD: 'Vea tarjeta',
            EXTERNAL_LINK: 'Abrir enlace de la red',
            EXTERNAL_LINK_WARNING: 'Usted está saliendo de Blue Connect Mobile. ¿Le gustaría continuar?',
            LOGIN_INVALID: 'Introduzca un ID y una contraseña válidos',
            NETWORK_ERROR: 'Error de Red',
            ERROR_NETWORK_BADCONNECTION: 'No hay conexión con la red',
            NETWORK_ERROR_MESSAGE: 'Estamos experimentando dificultades técnicas. Comprueba tu conexión a Internet y vuelve a intentarlo.',
            HELP: 'Ayuda',
            CONFIRM_FINGERPRINT: 'Confirmar su huella digital',
            ENABLE_TOUCH_ID: 'Activar Touch ID',
            ENABLE_FACE_ID: 'Activar Face ID',
            ENABLE_FINGERPRINT_AUTH: 'Activar indentificación de huella digital',
            SETTINGS_LOGIN_KEY_TOUCH_ID: 'Touch ID',
            SETTINGS_LOGIN_KEY_FACE_ID: 'Face ID',
            FINGERPRINT_AUTH: 'ID de huella digital',
            ERROR_NOT_ACCESSIBLE: 'Blue Connect móvil no está disponible en este momento. Lamentamos la inconveniencia que esto pueda causar.',
            ERROR_CAN_LOGIN_NO_CLAIMS_BENEFITS: 'Algunas áreas de la aplicación Blue Connect Mobile no están disponibles debido a problemas técnicos. Gracias por su paciencia.',
            ERROR_MAINTENANCE: 'Blue Connect Mobile tiene programado mantenimiento para el ',
            ERROR_MAINTENANCE_LINE2: ' y es posible que no esté disponible durante esas horas. Nos disculpamos por los inconvenientes que esta situación pueda causar.',
            ERROR_SELECT_FROM_DROPDOWN_LIST: 'Usted debe seleccionar una ubicación de la lista desplegable.',
          }
        };

        return internalLocale[lang.toLowerCase()];
      };
    }
  ]);
}());
