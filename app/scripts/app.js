'use strict';

/**
 * @ngdoc overview
 * @name guestBookApp
 * @description
 * # guestBookApp
 *
 * Main module of the application.
 */
angular
  .module('guestBookApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'udpCaptcha'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../views/records/list.html',
        controller: 'RecordsCtrl',
        controllerAs: 'records'
      })
      .when('/create', {
        templateUrl: '../views/records/create.html',
        controller: 'RecordsCtrl',
        controllerAs: 'records'
      })
      .when('/edit/:id', {
        templateUrl: '../views/records/edit.html',
        controller: 'RecordsCtrl',
        controllerAs: 'records'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
