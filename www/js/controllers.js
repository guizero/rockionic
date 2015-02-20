angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, localStorageService) {

  $scope.logOut = function() {
    console.log('chegou aqui');
    localStorageService.clearAll();
    console.log("que merda isso aqui");
    console.log(localStorageService.get("email"));
    $state.go("sign-in");
  }
  
})

.controller('DashboardCtrl', function($scope, $http, UtilService, localStorageService) {
  $scope.util = UtilService;
  $scope.dashboard = $scope.util.localStorage("get", ["dashboard"]) != "zero" ? $scope.util.localStorage("get", ["dashboard"]) : "";
  console.log($scope.util.localStorage("get", ["dashboard"]) == "zero");
  var $result = $scope.util.localStorage("get", ["dashboard"]) == "zero";

  
  $scope.doRefresh = function() {
    $scope.util.loading(true);
    $http.get('http://localhost:3000/dashboard.json?email='+$scope.util.localStorage("get",["email"])+'&password='+$scope.util.localStorage("get",["password"])).
    success(function(data, status, headers, config) {
      console.log(data);
      var dataToStore = JSON.stringify(data.dashboard[0]);
      $scope.util.localStorage("set", ["dashboard", dataToStore]);
      console.log($scope.util.localStorage("get", ["dashboard"]));
      $scope.dashboard = $scope.util.localStorage("get", ["dashboard"]);
      $scope.util.loading(false);
      $scope.$broadcast('scroll.refreshComplete');
      
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert(data.errors)
      $scope.util.loading(false);
      $scope.$broadcast('scroll.refreshComplete');

    });
  }

  if ($scope.dashboard == "") {
    $scope.doRefresh();
  }


})

.controller('TasksAvailableCtrl', function($scope, $http, $ionicModal, UtilService) {
  $scope.util = UtilService;
  $scope.tasks = "";

  $scope.doRefresh = function() {
    $scope.util.loading(true);
    $http.get('http://localhost:3000/available_tasks.json?email='+$scope.util.localStorage("get",["email"])+'&password='+$scope.util.localStorage("get",["password"])).
    success(function(data, status, headers, config) {
      console.log(data);
      var dataToStore = JSON.stringify(data.active_tasks);
      $scope.util.localStorage("set", ["available_tasks", dataToStore]);
      console.log($scope.util.localStorage("get", ["available_tasks"]));
      $scope.tasks = $scope.util.localStorage("get", ["available_tasks"]);
      $scope.util.loading(false);
      $scope.$broadcast('scroll.refreshComplete');
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert(data.errors)
      $scope.util.loading(false);
      $scope.$broadcast('scroll.refreshComplete');

    });
  }

  $scope.doRefresh();

  $scope.getTask = function(task) {
    $scope.util.loading(true);
    $http.get('http://localhost:3000/get_task.json?email='+$scope.util.localStorage("get",["email"])+'&password='+$scope.util.localStorage("get",["password"])+'&task_id='+task.id).
    success(function(data, status, headers, config) {
      console.log(data);
      if (data.code == 200) {
        alert("Tarefa pega com sucesso");
      } else {
        alert('Ops, houve algum erro! A tarefa não foi pega.');
      }
      $scope.util.loading(false);
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert(data.error)
      $scope.util.loading(false);
      $scope.$broadcast('scroll.refreshComplete');

    });
  }

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/task-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showmodal = function(task) {
    $scope.title = task.title;
    $scope.description = task.description;
    $scope.modal.show();
  }

})

.controller('SignInCtrl', function($scope, $state, $http, UtilService) {
  $scope.util = UtilService;
  if ($scope.util.localStorage("get",["email"]) != "zero") {
    $state.go('app.dashboard');
  }

  $scope.signIn = function(user) {
    $scope.util.loading(true);
    
     
    $http.get('http://localhost:3000/profile.json?email='+user.email+'&password='+user.password).
      success(function(data, status, headers, config) {
        console.log(data);
        $scope.util.localStorage("set", ['first_name', data.profile.first_name]);
        $scope.util.localStorage("set", ['last_name', data.profile.last_name]);
        $scope.util.localStorage("set", ['email', user.email]);
        $scope.util.localStorage("set", ['password', user.password]);

        $scope.util.loading(false);
        $state.go('app.dashboard');
        
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert(data.errors)
        $scope.util.loading(false);

      });
    // 
  };
  
})

.controller('ConfigCtrl', function($scope, $state, $http, UtilService) {
  $scope.util = UtilService;
  

  $scope.config = $scope.util.localStorage("get", ["config"]) != "zero" ? $scope.util.localStorage("get", ["config"]) : "";
    
  $scope.setConfig = function(status, autotask_changed) {
    $scope.util.loading(true);
    $http({
      url: 'http://localhost:3000/set_autotask.json',
      method: 'GET',
      params: {
        email: $scope.util.localStorage("get",["email"]),
        password: $scope.util.localStorage("get",["password"]),
        task_price: $scope.config.task_price,
        task_time_frame: $scope.config.task_time_frame,
        task_max_ammount: $scope.config.task_max_ammount,
        task_urgent: $scope.config.task_urgent,
        auto_tasks: $scope.config.auto_tasks,
        autotask_changed: autotask_changed,
        status: status
      }
    }).
    success(function(data, status, headers, config) {
      console.log(data);
      $scope.config = data.rule;
      $scope.config.auto_tasks = data.auto_tasks;
      // console.log($scope.config);
      
      $scope.util.loading(false);
      
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert(data.errors)
      $scope.util.loading(false);
      $scope.$broadcast('scroll.refreshComplete');

    });
  }

  $scope.setConfig("retrieve");

  
});

