/**
 * Created by pery on 05/07/14.
 */
var MainModule = angular.module('MainModule', []);


/*
 flow
 * 1) send requst to "open weather"
 * 2) get result
 * 3) send reuslt to worker with centeral point, and Number of good result we wants
 * 3.1) conver tempure in worker from klevin to celsius
 * 4) wait for answer with a orderd list of good reasults
 * 5) update model and make it visible to the user
 * 6) create anoder two button for 'male' and 'female'
 *
 * */


function mainController($scope, Manger,$interval) {
    var quary = $scope.quary = {
        latitude_min: 0,
        longitude_min: 0,
        latitude_max: 360,
        longitude_max: 360
    };
    var optimal = $scope.optimal = {
        male: {
            humidity: 50,
            temperature: 21
        },
        female: {
            humidity: 50,
            temperature: 22
        }
    };
    var updateInterval = 60;

    var state = $scope.state ={};
    $scope.state.gender = 'male'; // male || famale
    $scope.state.numberResult = '5';

    $scope.state.timeToNextUpdate = updateInterval; //sec
    $scope.state.limitResult = 2;


    Manger.stationsByBBox(quary).then(function (stations) {
        Manger.calculateOptimal(optimal);
        $scope.stations = stations;
    });

    /*update station every 1 minute*/
    $interval(function () {
        $scope.state.timeToNextUpdate--;
        if( $scope.state.timeToNextUpdate <= 0 ){
            Manger.stationsByBBox(quary).then(function (stations) {
                Manger.calculateOptimal(optimal);
                $scope.stations = stations;
             });
            $scope.state.timeToNextUpdate = updateInterval;
        }

    }, 1000);

    $scope.order = function order (station ) {
        return station.optimalDistance[state.gender];
    };

    $scope.showMore = function(){
        $scope.state.limitResult += 10;
    }
}