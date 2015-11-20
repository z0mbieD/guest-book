'use strict';

/**
 * @ngdoc function
 * @name guestBookApp.controller:RecordsCtrl
 * @description
 * # RecordsCtrl
 * Controller of the guestBookApp
 */
angular.module('guestBookApp')
  .controller('RecordsCtrl', function ($scope, $routeParams, $location, $captcha) {
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
      if($captcha.checkResult($scope.captchaResult) == true)
      {
        $scope.record.id = guid();
        $scope.record.createAt = new Date();

        var records = getRecords() || [];
        records.push($scope.record);

        setRecords(records);
        $location.url('/');

        $scope.record = {};
      }
      else
      {
        alert("Результаты капчи неверны! Попробуйте еще раз.");
      }

    };

    $scope.update = function() {
      var recordId = $routeParams.id;
      var records = getRecords();

      records[recordId] = $scope.record;
      $location.url('/');

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

    $scope.captchaOptions = {
      imgPath: 'images/',
      captcha: {
        numberOfImages: 5,
        callbacks: {
          loaded: function( captcha ) {
            // Binds an element to callback on click
            // @param element object like document.getElementById() (has to be a single element)
            // @param callback function to run when the element is clicked
            var _bindClick = function( element, callback ) {
              if ( element.addEventListener ) {
                element.addEventListener( 'click', callback, false );
              } else {
                element.attachEvent( 'onclick', callback );
              }
            };

            // Avoid adding the hashtag to the URL when clicking/selecting visualCaptcha options
            var anchorOptions = document.getElementById( 'sample-captcha' ).getElementsByTagName( 'a' );
            var anchorList = Array.prototype.slice.call( anchorOptions );// .getElementsByTagName does not return an actual array
            anchorList.forEach( function( anchorItem ) {
              _bindClick( anchorItem, function( event ) {
                event.preventDefault();
              });
            });
          }
        }

      },
      init: function ( captcha ) {
        $scope.captcha = captcha;
      }
    };

    $scope.isVisualCaptchaFilled = function() {
      if ( $scope.captcha.getCaptchaData().valid ) {
        window.alert( 'visualCaptcha is filled!' );
      } else {
        window.alert( 'visualCaptcha is NOT filled!' );
      }
    };


    var queryString = window.location.search;
    // Show success/error messages
    $scope.status = null;
    if ( queryString.indexOf('status=noCaptcha') !== -1 ) {
      $scope.valid = false;
      $scope.status = 'visualCaptcha was not started!';
    } else if ( queryString.indexOf('status=validImage') !== -1 ) {
      $scope.valid = true;
      $scope.status = 'Image was valid!';
    } else if ( queryString.indexOf('status=failedImage') !== -1 ) {
      $scope.valid = false;
      $scope.status = 'Image was NOT valid!';
    } else if ( queryString.indexOf('status=validAudio') !== -1 ) {
      $scope.valid = true;
      $scope.status = 'Accessibility answer was valid!';
    } else if ( queryString.indexOf('status=failedAudio') !== -1 ) {
      $scope.valid = false;
      $scope.status = 'Accessibility answer was NOT valid!';
    } else if ( queryString.indexOf('status=failedPost') !== -1 ) {
      $scope.valid = false;
      $scope.status = 'No visualCaptcha answer was given!';
    }
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
