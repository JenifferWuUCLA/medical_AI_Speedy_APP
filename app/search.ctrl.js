//Demo of Searching Sorting and Pagination of Table with AngularJS - Advance Example

var myApp = angular.module("myApp", ['angular-popups', 'jkuri.datepicker']);


//Not Necessary to Create Service, Same can be done in COntroller also as method like add() method
myApp.service('filteredListService', function () {

    this.searched = function (valLists, toSearch) {
        //alert('toSearch: '+toSearch);
        return _.filter(valLists,

            function (i) {
                /* Search Text in all 3 fields */
                return searchUtil(i, toSearch);
            });
    };

    this.paged = function (valLists, pageSize) {
        retVal = [];
        for (var i = 0; i < valLists.length; i++) {
            //alert('valLists[i]: '+valLists[i].name+', '+valLists[i].gender);
            if (i % pageSize === 0) {
                retVal[Math.floor(i / pageSize)] = [valLists[i]];
            } else {
                retVal[Math.floor(i / pageSize)].push(valLists[i]);
            }
        }

        return retVal;
    };

});

//Inject Custom Service Created by us and Global service $filter. This is one way of specifying dependency Injection
myApp.controller('Ctrl', function ($scope, $http, Patient, $filter, filteredListService) {

    //alert('$scope_TableCtrl: '+JSON.stringify($scope));

    $scope.patient = new Patient();

    var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    $scope.pageSize = 4;

    $scope.allItems = Patient.query();

    var url = "http://localhost:3000/api/patients";

    $http({
        method: 'JSONP',
        headers: headers,
        url: url
    }).
    success(function(result) {
        //your code when success
        $scope.allItems = result;
    }).
    error(function(data, status, headers, config) {
        //your code when fails
    });

    /*$http.get("http://localhost:3000/api/patients")
        .then(function(response){ $scope.allItems = response.data; });*/

    $scope.reverse = false;

    $scope.resetAll = function () {
        $scope.filteredList = $scope.allItems;
        $scope.newName = '';
        $scope.newDOB = '';
        $scope.newAge = '';
        $scope.newGender = '';
        $scope.newZipcode = '';
        $scope.searchText = '';
        $scope.currentPage = 0;
        $scope.Header = ['', '', '', '', ''];
    }

    $scope.add = function () {
        $scope.allItems.push({
            name: $scope.newName,
            DOB: $scope.newDOB,
            age: $scope.newAge,
            gender: $scope.newGender,
            zipcode: $scope.newZipcode
        });
        $scope.resetAll();
    }

    $scope.search = function () {
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText);

        if ($scope.searchText == '') {
            $scope.filteredList = $scope.allItems;
        }
        $scope.pagination();
    }

    $scope.Gender = "M";

    $scope.RadioChange = function (s) {
        $scope.GenderSelected = s;

        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.GenderSelected);

        if ($scope.GenderSelected == '') {
            //alert('all');
            $scope.filteredList = $scope.allItems;
        }

        $scope.pagination();
    };

    $scope.DateChange = function () {
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.ctrl.dobDate);

        if ($scope.ctrl.dobDate == '') {
            //alert('all');
            $scope.filteredList = $scope.allItems;
        }

        $scope.pagination();
    };


    // Calculate Total Number of Pages based on Search Result
    $scope.pagination = function () {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        //alert('$scope.ItemsByPage_TableCtrl: '+JSON.stringify($scope.ItemsByPage));
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    $scope.firstPage = function () {
        $scope.currentPage = 0;
    };

    $scope.lastPage = function () {
        $scope.currentPage = $scope.ItemsByPage.length - 1;
    };

    $scope.range = function (input, total) {
        var ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (var i = input; i < total; i++) {
            if (i != 0 && i != total - 1) {
                ret.push(i);
            }
        }
        //alert('ret_TableCtrl: '+JSON.stringify(ret))
        return ret;
    };

    $scope.sort = function (sortBy) {
        $scope.resetAll();

        $scope.columnToOrder = sortBy;

        //$Filter - Standard Service
        $scope.filteredList = $filter('orderBy')($scope.filteredList, $scope.columnToOrder, $scope.reverse);

        if ($scope.reverse) iconName = 'glyphicon glyphicon-chevron-up';
        else iconName = 'glyphicon glyphicon-chevron-down';

        if (sortBy === 'name') {
            $scope.Header[0] = iconName;
        } else if (sortBy === 'DOB') {
            $scope.Header[1] = iconName;
        } else if (sortBy === 'age') {
            $scope.Header[2] = iconName;
        } else if (sortBy === 'gender') {
            $scope.Header[3] = iconName;
        } else {
            $scope.Header[4] = iconName;
        }

        $scope.reverse = !$scope.reverse;

        $scope.pagination();
    };

    //By Default sort ny Name
    $scope.sort('name');

});

function searchUtil(item, toSearch) {
    /* Search Text in all 3 fields */
    return (item.name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.DOB == toSearch || item.age == toSearch || item.gender == toSearch || item.zipcode == toSearch) ? true : false;
}