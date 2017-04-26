//Demo of Searching Sorting and Pagination of Table with AngularJS - Advance Example

var myApp = angular.module('myApp', []);

//Not Necessary to Create Service, Same can be done in COntroller also as method like add() method
myApp.service('filteredListService', function () {

    this.searched = function (valLists, toSearch) {
        return _.filter(valLists,

            function (i) {
                /* Search Text in all 3 fields */
                return searchUtil(i, toSearch);
            });
    };

    this.paged = function (valLists, pageSize) {
        retVal = [];
        for (var i = 0; i < valLists.length; i++) {
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
var TableCtrl = myApp.controller('TableCtrl', function ($scope, $filter, filteredListService) {

    $scope.pageSize = 4;

    $scope.profile = getProfileData();

    $scope.status = getStatusData();
    //alert('$scope.profile.EncounterType: '+$scope.profile.EncounterType);

    $scope.allItems = getDummyData();
    //alert('$scope.allItems: '+JSON.stringify($scope.allItems));

    $scope.reverse = false;

    $scope.resetAll = function () {
        $scope.filteredList = $scope.allItems;
        $scope.newVital = '';
        $scope.newLastRecorded = '';
        $scope.newDateTime = '';
        $scope.searchText = '';
        $scope.currentPage = 0;
        $scope.Header = ['', '', ''];
    }

    $scope.add = function () {
        $scope.allItems.push({
            Vital: $scope.newVital,
            LastRecorded: $scope.newLastRecorded,
            DateTime: $scope.newDateTime
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

    // Calculate Total Number of Pages based on Search Result
    $scope.pagination = function () {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        //alert('$scope.ItemsByPage: '+JSON.stringify($scope.ItemsByPage));
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
        return ret;
    };

    $scope.sort = function (sortBy) {
        $scope.resetAll();

        $scope.columnToOrder = sortBy;

        //$Filter - Standard Service
        $scope.filteredList = $filter('orderBy')($scope.filteredList, $scope.columnToOrder, $scope.reverse);

        if ($scope.reverse) iconName = 'glyphicon glyphicon-chevron-up';
        else iconName = 'glyphicon glyphicon-chevron-down';

        if (sortBy === 'EmpId') {
            $scope.Header[0] = iconName;
        } else if (sortBy === 'name') {
            $scope.Header[1] = iconName;
        } else {
            $scope.Header[2] = iconName;
        }

        $scope.reverse = !$scope.reverse;

        $scope.pagination();
    };

    //By Default sort ny Name
    $scope.sort('name');

});

function searchUtil(item, toSearch) {
    /* Search Text in all 3 fields */
    return (item.name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Email.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.EmpId == toSearch) ? true : false;
}

/*Get Profile Data for Example*/
function getProfileData() {
    return {
        Basic: 'Female, age 27',
        DOB: '08/16/1987',
        PhoneNumber: '(746) 465-1648',
        PreferredLanguage: 'English',
        SmokingStatus: 'Non-smoker'
    };
}

/*Get Status Data for Example*/
function getStatusData() {
    return {
        EncounterType: 'Inpatient',
        VisitReason: 'Fever and chills',
        Physician: 'Alyssa Havemann',
        Facility: ''
    };
}

/*Get Dummy Data for Example*/
function getDummyData() {
    return [{
        Vital: 'Weight',
        LastRecorded: '135lbs',
        DateTime: '12/06/2013 20:15'
    }, {
        Vital: 'Height',
        LastRecorded: '5ft 7in',
        DateTime: '12/06/2013 20:15'
    }, {
        Vital: 'BMI',
        LastRecorded: '23',
        DateTime: '12/06/2013 20:15'
    }, {
        Vital: 'Temperature',
        LastRecorded: '98.5 F',
        DateTime: '12/06/2013 20:15'
    }, {
        Vital: 'Blood Pressure',
        LastRecorded: '120/78',
        DateTime: '12/06/2013 20:15'
    }, {
        Vital: 'Pulse',
        LastRecorded: '80',
        DateTime: '12/06/2013 20:15'
    }, {
        Vital: 'Respiratory Rate',
        LastRecorded: '12',
        DateTime: '12/06/2013 20:15'
    }];
}