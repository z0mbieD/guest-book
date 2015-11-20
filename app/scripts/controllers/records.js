'use strict';

/**
 * @ngdoc function
 * @name guestBookApp.controller:RecordsCtrl
 * @description
 * # RecordsCtrl
 * Controller of the guestBookApp
 */
angular.module('guestBookApp')
  .controller('RecordsCtrl', function ($scope, $routeParams) {
    $scope.records = getRecords(),
    $scope.filteredRecords = [],
    $scope.currentPage = 1,
    $scope.numPerPage = 5,
    $scope.maxSize = 5,
    $scope.totalItems = 50;

    $scope.show = function() {
      $scope.records = getRecords();
    };

    $scope.get = function() {
      var recordId = $routeParams.id;
      var records = getRecords();

      $scope.record = records[recordId];
    };

    $scope.create = function() {
      $scope.record.id = guid();
      $scope.record.createAt = new Date();

      var records = getRecords() || [];
      records.push($scope.record);

      setRecords(records);

      $scope.record = {};
    };

    $scope.update = function() {
      var recordId = $routeParams.id;
      var records = getRecords();

      records[recordId] = $scope.record;

      setRecords(records);
    };

    $scope.remove = function(id) {
      $scope.filteredRecords.splice(id, 1);

      setRecords($scope.filteredRecords);
    };

    $scope.$watch("currentPage + numPerPage", function() {
      var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;

      $scope.filteredRecords = $scope.records.slice(begin, end);
    });
  });

function getRecords(){
  return JSON.parse(localStorage.getItem('guestBook'));
}

function setRecords(records){
  localStorage.setItem('guestBook', JSON.stringify(records));
  return false;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4();
}
