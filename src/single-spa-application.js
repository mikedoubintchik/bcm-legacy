import singleSpaAngularJS from "single-spa-angularjs";
import angular from "angular";
import uiRouter from 'angular-ui-router';

const BCMLegacy = singleSpaAngularJS({
  angular: angular,
  mainAngularModule: "account-settings",
  uiRouter: true,
  preserveGlobal: false,
  template: "<account-settings />",
  domElementGetter: function() {
    require('./account-settings.css');
    return document.getElementById('angularjs-container');
  },
});

export const bootstrap = BCMLegacy.bootstrap;
export const mount = BCMLegacy.mount;
export const unmount = BCMLegacy.unmount;
