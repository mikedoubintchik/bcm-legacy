angular.module("account-settings").component("settingsHome", {
  template: require("./components/settings-home.template.html"),
  controller: [
    "$rootScope",
    function ($rootScope) {
      console.log("root scope", $rootScope);
    },
  ],
});
