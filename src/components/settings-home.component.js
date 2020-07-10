import CrossShieldImg from './images/crossshield.svg';

angular.module("account-settings").component("settingsHome", {
  template: require("./components/settings-home.template.html").default,
  controller: [
    "$scope",
    function ($scope) {
      $scope.exampleImg = CrossShieldImg;
    },
  ],
});
