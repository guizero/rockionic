// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngMessages', 'LocalStorageModule'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('sign-in', {
    url: '/sign-in',
    templateUrl: 'templates/sign-in.html',
    controller: 'SignInCtrl'
  })
  
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.dashboard', {
    url: "/dashboard",
    views: {
      'menuContent': {
        templateUrl: "templates/dashboard.html",
        controller: "DashboardCtrl"
      }
    }
  })

  .state('app.availabletasks', {
    url: "/availabletasks",
    views: {
      'menuContent': {
        templateUrl: "templates/availabletasks.html",
        controller: "TasksAvailableCtrl"
      }
    }
  })

  .state('app.config', {
    url: "/config",
    views: {
      'menuContent': {
        templateUrl: "templates/config.html",
        controller: 'ConfigCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/sign-in');
})

.factory('UtilService', function($ionicLoading, localStorageService) {
  
  return {
    loading: function(state) {
      if (state) {
        $ionicLoading.show({
            noBackdrop: true
        }); 
      } else {
        $ionicLoading.hide();
      }
    },
    localStorage: function(mode, data) {
      if (mode == "set") { localStorageService.set(data[0], data[1])} else { 
        $result = localStorageService.get(data[0]);
        $result = $result == null ? "zero" :  $result;
        return  $result }
    }
  }
});
