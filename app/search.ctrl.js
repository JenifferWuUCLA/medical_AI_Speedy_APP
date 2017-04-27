//Demo of Searching Sorting and Pagination of Table with AngularJS - Advance Example

var app = angular.module("myApp", ['angular-popups', 'jkuri.datepicker']);

//Not Necessary to Create Service, Same can be done in COntroller also as method like add() method
app.service('filteredListService', function () {

    this.searched = function (valLists, toSearch) {
        //alert('toSearch: ' + toSearch);
        return _.filter(valLists,

            function (i) {
                /* Search Text in all 3 fields */
                //alert('toSearch: ' + toSearch);
                return searchUtil(i, toSearch);
            });
    };

    this.paged = function (valLists, pageSize) {
        var retVal = [];
        if (valLists !== undefined) {
            for (var i = 0; i < valLists.length; i++) {
                //alert('valLists[i]: '+valLists[i].name+', '+valLists[i].gender);
                if (i % pageSize === 0) {
                    retVal[Math.floor(i / pageSize)] = [valLists[i]];
                } else {
                    retVal[Math.floor(i / pageSize)].push(valLists[i]);
                }
            }
        }

        //alert('paged retVal : '+JSON.stringify(retVal));
        return retVal;
    };

});

//Inject Custom Service Created by us and Global service $filter. This is one way of specifying dependency Injection
app.controller('Ctrl', function ($scope, $http, $filter, filteredListService) {

    // getDummyData($scope, $http, Patient); start
    var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    var url = "http://101.37.36.41:3020/api/patients";

    $http({
        method: 'GET',
        headers: headers,
        url: url
    }).
    success(function(result) {
        //your code when success
        //alert('success result: '+result);
        //alert('success');

        $scope.ItemsByPage = result;
        $scope.allItems = result;

        //By Default sort ny Name
        $scope.sort('name');

    }).
    error(function() {
        //your code when fails
        //alert('error');
    });
    // getDummyData($scope, $http, Patient); end

    $scope.pageSize = 4;
    $scope.reverse = false;

    $scope.resetAll = function () {
        $scope.filteredList = $scope.allItems;
        //alert('$scope.allItems resetAll : '+JSON.stringify($scope.allItems));
        //alert('$scope.filteredList_resetAll: '+JSON.stringify($scope.filteredList));
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
        //alert('$scope.allItems: '+JSON.stringify($scope.allItems));
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText);

        //alert('$scope.searchText: '+JSON.stringify($scope.searchText));
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
        //alert('$scope.filteredList_pagination: '+JSON.stringify($scope.filteredList));
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        //alert('$scope.ItemsByPage_pagination: '+JSON.stringify($scope.ItemsByPage));
    };

    $scope.setPage = function () {
        //alert('$scope.setPage = function () {... ... ...}');
        $scope.currentPage = this.n;
        //alert('$scope.currentPage: '+JSON.stringify($scope.currentPage));
    };

    $scope.firstPage = function () {
        //alert('$scope.firstPage = function () {... ... ...}');
        $scope.currentPage = 0;
    };

    $scope.lastPage = function () {
        //alert('$scope.lastPage = function () {... ... ...}');
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
        //alert('$scope.filteredList_sort: '+JSON.stringify($scope.filteredList));

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


});

function searchUtil(item, toSearch) {
    /* Search Text in all 3 fields */
    //alert(item.name.toLowerCase().indexOf(toSearch.toLowerCase()) );
    return (item.name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.DOB == toSearch || item.age == toSearch || item.gender == toSearch || item.zipcode == toSearch) ? true : false;
}