var app = angular.module('socketDemo', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/home.html',
        controller: 'HomeController'
      }).
      when('/shows/:show', {
        templateUrl: '/partials/show.html',
        controller: 'ShowsController'
      }).
      otherwise({
        redirectTo: '/'
      });
  })

app.controller('navController', function($scope, userLoggedInService){
    $scope.showLoggedIn = false;
    $scope.showSignIn = true;
    $scope.signIn = function(){
      $scope.thisUser = $scope.signInName;
      $scope.showSignIn = false;
      $scope.showLoggedIn = true;
      userLoggedInService.addName($scope.thisUser);
      console.log(userLoggedInService.getName);
    }    
    $scope.signOut = function(){
      $scope.signInName = "";
      $scope.thisUser = false;
      $scope.showSignIn = true;
      $scope.showLoggedIn = false;
      userLoggedInService.removeName();
    }

  })
  .controller('HomeController', function ($scope, userLoggedInService) {
    
    $scope.messageObject = {}; 
    $scope.createMessageDataObject = function(){
      // $scope.messageObject.name = $scope.name; 
      $scope.messageObject.name = $scope.thisUser; 
      $scope.messageObject.message = $scope.message;
    }


     
    // $scope.printMessageSendData = function(){
    //   $scope.messageSendData.name = $scope.name; 
    //   $scope.messageSendData.message = $scope.message;
    //   console.log("printing messageSendData..", $scope.messageSendData);
    //   console.log("printing name..", $scope.name);
    //   console.log("printing message", $scope.message);

    // }
    // io is a global object given to you by /socket.io/socket.io.js
    var socket = io();
    $scope.messages = [];

    // when the _server_ sends a message
    // we'll add that message to our $scope.messages array
    socket.on('message', function (data) {
      $scope.messages.push(data);

      // use $scope.apply in order to make sure the view is updated
      // even though this event was fired outside of Angular's digest
      $scope.$apply();
    })

    $scope.self = function () {
      // this sends a message to the server
      // with the name of "self"
      $scope.createMessageDataObject();
      console.log($scope.messageObject);
      socket.emit('self', $scope.messageObject);
    }

    $scope.all = function () {
      // this sends a message to the server
      // with the name of "all"
      $scope.createMessageDataObject();
      console.log($scope.messageObject);
      socket.emit('all', $scope.messageObject);
    }

    $scope.broadcast = function () {
      // this sends a message to the server
      // with the name of "broadcast"
      socket.emit('broadcast', 'replaceme');
    }

    // The $destroy event is triggered when the controller is about to go away
    // For example when you move to another route
    $scope.$on('$destroy', function (event) {
      // since the global io object is reused, all the event listeners from
      // above will remain until the page is reloaded.

      // So clean up by removing all listeners
      socket.removeAllListeners();
    });

  })
  .controller('ShowsController', function ($scope, $routeParams) {

    $scope.show = $routeParams.show;
    var socket = io();

    // when the user first lands on this route
    // immediately send a message to the server with a dynamic room name taken
    // from the $routeParams.

    // The server will then tell this client to join the room specified here.
    socket.emit('join', { showName: $routeParams.show });

    $scope.messages = [];
    socket.on('message', function (data) {
      $scope.messages.push(data);
      $scope.$apply();
    })

    $scope.sendMessage = function () {
      socket.emit('message' + userLoggedInService, 'replaceme');
    }

    $scope.broadcastRoom = function () {
      socket.emit('broadcastRoom', 'replaceme');
    }

    $scope.$on('$destroy', function (event) {
      socket.removeAllListeners();
    });

  })
