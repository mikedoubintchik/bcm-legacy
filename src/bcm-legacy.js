import "./set-public-path";
// import "./vendor";
// import '../node_modules/fastclick/lib/fastclick.js';
// import jquery from 'jquery';
// window.jQuery = jquery;
// window.$ = jquery;
import angular from "angular";
import ngRoute from 'angular-route';
import ngSanitize from 'angular-sanitize';
import ngAnimate from 'angular-animate';
import ngCache from 'angular-cache';
import ngTouch from 'angular-touch';
import ngMocks from 'angular-mocks';
import '../node_modules/angularjs-services-cloud/dist/angular-cloud-services.js';
import singleSpaAngularJS from "single-spa-angularjs";
// import tether from 'tether';
// import bootstrap from 'bootstrap';
import "./app";

const BCMLegacy = singleSpaAngularJS({
  angular,
  mainAngularModule: "blueconnect.mobile.app",
  uiRouter: false,
  preserveGlobal: false,
  template: require("./components/account-settings.template.html").default,
  domElementGetter: function () {
    require("./account-settings.css");
    require("../node_modules/blueconnect-mobile-icons/dist/css/fontcustom.css");
    return document.getElementById("angularjs-container");
  },
});

export const bootstrap = BCMLegacy.bootstrap;
export const mount = BCMLegacy.mount;
export const unmount = BCMLegacy.unmount;
