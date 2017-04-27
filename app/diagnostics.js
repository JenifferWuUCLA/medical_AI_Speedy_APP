app.controller('DiagnosticCtrl', function($scope, $http, Diagnostic) {

    $scope.diagnostic = new Diagnostic();

    var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    var refresh = function() {
        $scope.diagnostics = Diagnostic.query();

        var url = "http://101.37.36.41:3020/api/diagnostics";

        $http({
            method: 'JSONP',
            headers: headers,
            url: url
        }).
        success(function(result) {
            //your code when success
            $scope.patients = result;
        }).
        error(function(data, status, headers, config) {
            //your code when fails
        });

        $scope.diagnostic ="";
    }

    refresh();

    $scope.add = function(diagnostic) {
        Diagnostic.save(diagnostic, function(diagnostic) {
            refresh();
        });
    };

    $scope.update = function(diagnostic) {
        diagnostic.$update(function() {
            refresh();
        });
    };

    $scope.remove = function(diagnostic) {
        diagnostic.$delete(function(){
            refresh();
        });
    };

    $scope.edit = function(id) {
        $scope.diagnostic = Patient.get({ id: id });
    };

    $scope.deselect = function() {
        $scope.diagnostic = "";
    }

})