//Demo of Searching Sorting and Pagination of Table with AngularJS - Advance Example

var app = angular.module('myApp', []);

//Inject Custom Service Created by us and Global service $filter. This is one way of specifying dependency Injection
app.controller('TableCtrl', function ($scope, $http) {

    var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    var url = window.location.href;
    var MRN = url.split("?MRN=")[1];

    $scope.refresh = function() {
        // getProfileData($scope, $http, Patient); start
        //$scope.profile = Patient.query();

        var url = "http://101.37.36.41:3020/api/patients?MRN=" + MRN;

        $http({
            method: 'GET',
            headers: headers,
            url: url
        }).
        success(function(result) {
            //your code when success
            //alert('success');
            $scope.profile = result[0];
            //alert('success result: '+JSON.stringify($scope.profile));
        }).
        error(function() {
            //your code when fails
            //alert('error');
        });
        // getProfileData($scope, $http, Patient); end

        // getDiagnosticData($scope, $http, Diagnostic); start
        //$scope.diagnostic = Diagnostic.query();

        var url = "http://101.37.36.41:3020/api/diagnostics?MRN=" + MRN;

        $http({
            method: 'GET',
            headers: headers,
            url: url
        }).
        success(function(result) {
            //your code when success
            //alert('success');
            $scope.diagnostic = result[0];
            //alert('success result: '+JSON.stringify($scope.diagnostic));
        }).
        error(function() {
            //your code when fails
            //alert('error');
        });
        // getDiagnosticData($scope, $http, Diagnostic); start
    }

    $scope.refresh();

    $scope.search = function () {
        var url = "http://101.37.36.41:5000/search.html";
        window.location.href = url;
    }

});