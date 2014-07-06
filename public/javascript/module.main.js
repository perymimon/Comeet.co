/**
 * Created by pery on 05/07/14.
 */
var MainModule = angular.module('MainModule', []);


/*
 solution flow
 * 1) send request to "open weather"
 * 2) get result
 * 3.1) convert the temperature from Klevin to celsius
 * 3.2) simplify the data
 * 5) update model and make it visible to the user
 * 6) repeat all process above every 1 minute
 *
 * */


function mainController($scope, Manger,$interval) {
    var quary = $scope.quary = {
        latitude_min: 0,
        longitude_min: 0,
        latitude_max: 360,
        longitude_max: 360
    };
    // condition for optimal weather for male and female
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

    /*state model for the appliction*/
    var state = $scope.state ={};
    $scope.state.gender = 'male'; // male || famale
    $scope.state.numberResult = '5';
    $scope.state.timeToNextUpdate = updateInterval; //sec
    $scope.state.limitResult = 2;

    /*
    * call internal function that use Manger service for update the list of station from the world
    * */
    uprateStations();

    /*
    * update station every 1 minute
    * */
    $interval(function () {
        $scope.state.timeToNextUpdate--;
        if( $scope.state.timeToNextUpdate <= 0 ){
            uprateStations();
            $scope.state.timeToNextUpdate = updateInterval;
        }

    }, 1000);


    function uprateStations(){
        Manger.stationsByBBox(quary).then(function (stations) {
            Manger.calculateOptimal(optimal);
            $scope.stations = stations;
        });
    }

    /*
    * helper function for filter `orderBy`, it's help to sort station by distance from optimal values
    * */
    $scope.order = function order (station ) {
        return station.optimalDistance[state.gender];
    };

    /*
    * helper function for update the state that
    * responsible the number of show results
    * */
    $scope.showMore = function(){
        $scope.state.limitResult += 10;
    }
}