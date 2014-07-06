/**
 * Created by pery on 05/07/14.
 */

var locations = [];


/*
* params: pivot
* */
function distanceFromPivotConditions(humidity,temp){

}

addEventListener("message", function ( event ) {
    locations =  event.data ;

    //covert all temp to celsius
    locations.forEach(function (location, index) {
        location.main.temp = convert.kelvin.celsius( location.main.temp );
        location.main.distance =
    })
});

