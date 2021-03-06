(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.singleSpaAngularjs = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = singleSpaAngularJS;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var defaultOpts = {
    // required opts
    angular: null,
    domElementGetter: null,
    mainAngularModule: null,
    // optional opts
    uiRouter: false,
    preserveGlobal: false,
    elementId: "__single_spa_angular_1",
    strictDi: false,
    template: undefined
  };

  function singleSpaAngularJS(userOpts) {
    if (_typeof(userOpts) !== "object") {
      throw new Error("single-spa-angularjs requires a configuration object");
    }

    var opts = _objectSpread({}, defaultOpts, {}, userOpts);

    if (!opts.angular) {
      throw new Error("single-spa-angularjs must be passed opts.angular");
    }

    if (opts.domElementGetter && typeof opts.domElementGetter !== "function") {
      throw new Error("single-spa-angularjs opts.domElementGetter must be a function");
    }

    if (!opts.mainAngularModule) {
      throw new Error("single-spa-angularjs must be passed opts.mainAngularModule string");
    } // A shared object to store mounted object state


    var mountedInstances = {};
    return {
      bootstrap: bootstrap.bind(null, opts, mountedInstances),
      mount: mount.bind(null, opts, mountedInstances),
      unmount: unmount.bind(null, opts, mountedInstances)
    };
  }

  function bootstrap(opts) {
    return Promise.resolve();
  }

  function mount(opts, mountedInstances) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return Promise.resolve().then(function () {
      window.angular = opts.angular;
      var containerEl = getContainerEl(opts, props);
      var bootstrapEl = document.createElement("div");
      bootstrapEl.id = opts.elementId;
      containerEl.appendChild(bootstrapEl);

      if (opts.uiRouter) {
        var uiViewEl = document.createElement("div");
        uiViewEl.setAttribute("ui-view", opts.uiRouter === true ? "" : opts.uiRouter);
        bootstrapEl.appendChild(uiViewEl);
      }

      if (opts.template) {
        bootstrapEl.innerHTML = opts.template;
      }

      if (opts.strictDi) {
        mountedInstances.instance = opts.angular.bootstrap(bootstrapEl, [opts.mainAngularModule], {
          strictDi: opts.strictDi
        });
      } else {
        mountedInstances.instance = opts.angular.bootstrap(bootstrapEl, [opts.mainAngularModule]);
      }

      mountedInstances.instance.get("$rootScope").singleSpaProps = props;
    });
  }

  function unmount(opts, mountedInstances) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return new Promise(function (resolve, reject) {
      mountedInstances.instance.get("$rootScope").$destroy();
      getContainerEl(opts, props).innerHTML = "";
      if (opts.angular === window.angular && !opts.preserveGlobal) delete window.angular;
      setTimeout(resolve);
    });
  }

  function getContainerEl(opts, props) {
    var element;

    if (opts.domElementGetter) {
      element = opts.domElementGetter(props);
    } else {
      var htmlId = "single-spa-application:".concat(props.name || props.appName);
      element = document.getElementById(htmlId);

      if (!element) {
        element = document.createElement("div");
        element.id = htmlId;
        document.body.appendChild(element);
      }
    }

    if (!element) {
      throw new Error("domElementGetter did not return a valid dom element");
    }

    return element;
  }
});
//# sourceMappingURL=single-spa-angularjs.js.map
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

angular.module('account-settings', [
  'ui.router'
]);
angular
.module('account-settings')
.config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
  });

  $stateProvider.state({
    name: 'settings-home',
    url: '/settings',
    template: '<settings-home></settings-home>'
  })
}])
import * as accountSettingsTemplate from "./components/account-settings.template.html";

angular.module("account-settings").component("accountSettings", {
  template: accountSettingsTemplate.default,
});

import * as settingsHomeTemplate from "./components/settings-home.template.html";

angular.module("account-settings").component("settingsHome", {
  template: settingsHomeTemplate.default,
  controller: [
    "$rootScope",
    function ($rootScope) {
      console.log("root scope", $rootScope);
    },
  ],
});
