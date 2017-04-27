var app = angular.module('myApp', ['ngResource', 'ngProgress', 'ngAnimate', 'toaster']);

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('myHttpInterceptor');
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.common = 'Content-Type: application/json';
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// Handle http server errors
app.factory('myHttpInterceptor', function ($q,toaster) {
    return {
        responseError: function (response) {
          console.log(response);
          if(response.data){
            if(response.data.message)
            toaster.error("Error: ", response.data.message);
            else
            toaster.error("Error: ", response.data);
          }
          return $q.reject(response);
        }
    };
});

// Showing loading indicator on top while data is requested from database
app.directive('loading',   ['$http', 'ngProgress', function ($http, ngProgress)
{
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v)
            {
                if(v){
                    ngProgress.start();
                }else{
                    ngProgress.complete();
                }
            });
        }
    };
}]);

app.factory('Patient', function($resource) {
    return $resource('http://localhost:3000/api/patients/:id', { id: '@_id' }, {
        update: { // We need to define this method manually as it is not provided with ng-resource
            method: 'PUT'
        }
    });
});

app.factory('Diagnostic', function($resource) {
    return $resource('http://localhost:3000/api/diagnostics/:id', { id: '@_id' }, {
        update: { // We need to define this method manually as it is not provided with ng-resource
            method: 'PUT'
        }
    });
});