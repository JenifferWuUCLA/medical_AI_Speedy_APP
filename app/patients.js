app.controller('PatientCtrl', function($scope, Patient, ngProgress, toaster) {

    $scope.patient = new Patient();

    var refresh = function() {
        $scope.patients = Patient.query();
        alert($scope.patients);
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