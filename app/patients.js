app.controller('PatientCtrl', function($scope, $http, Patient) {

    $scope.patient = new Patient();

    var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    var refresh = function() {
        $scope.patients = Patient.query();

        var url = "http://localhost:3000/api/patients";

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

        $scope.patient ="";
    }

    refresh();

    $scope.add = function(patient) {
        Patient.save(patient, function(patient) {
            refresh();
        });
    };

    $scope.update = function(patient) {
        patient.$update(function() {
            refresh();
        });
    };

    $scope.remove = function(patient) {
        patient.$delete(function(){
            refresh();
        });
    };

    $scope.edit = function(id) {
        $scope.patient = Patient.get({ id: id });
    };

    $scope.deselect = function() {
        $scope.patient = "";
    }

})