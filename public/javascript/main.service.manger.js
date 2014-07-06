/**
 * Created by pery on 06/07/14.
 */
MainModule.factory('Manger', ['WeatherService','$q',function (WeatherService, $q) {
    var stations,
        simpleStations,
        optimals
        ;

    /* use `openWeather` service to get weather from all stations in Boundaries */
    function requestStationsByBBox(quary) {
        var deferred = $q.defer()
            ;
        WeatherService.stations
            .byBBox(
                quary.latitude_min,
                quary.longitude_min,
                quary.latitude_max,
                quary.longitude_max
            )
            .then(function (data) {
                stations = data.list;
                simplifyLocations();
                deferred.resolve(simpleStations);
            });

        return deferred.promise;
    }
    /*
    * covert the data that get from `openWeather` to simple objects for continue using
    * */
    function simplifyLocations() {
        simpleStations = stations.map(function (station, index) {
            if(station.main) {
                var humidity =  station.main.humidity || 0,
                // convert temperature from kelvin to celsius
                    temp = WeatherService.convert.kelvin.celsius(station.main.temp)
                    ;
            }

            return {
                name: station.name,
                humidity: humidity || 0,
                temperature: temp || 0
            };
        });
    }

    /*
    * use Pythagorean equation to calculate the distance from optimal points
    * and add that values to Simple Station model;
    * High value is bad
    * */
    function calculateOptimalMeasurement(optimals) {
        var power = Math.pow,
            optimalMaleTemperaure = optimals.male.temperature,
            optimalMaleHumidity = optimals.male.humidity,
            optimalFemaleTemperaure = optimals.female.temperature,
            optimalFemaleHumidity = optimals.female.humidity
            ;

        simpleStations.forEach(function (station) {
            var humidity = station.humidity,
                temperature = station.temperature
                ;
            station.optimalDistance = {
                male: Math.sqrt(
                    power(humidity - optimalMaleHumidity, 2) +
                        power(temperature - optimalMaleTemperaure, 2)
                ),
                female: Math.sqrt(
                    power(humidity - optimalFemaleHumidity, 2) +
                        power(temperature - optimalFemaleTemperaure, 2)
                )
            }
        });

    }

    return {
        calculateOptimal: calculateOptimalMeasurement,
        stationsByBBox: requestStationsByBBox
    }

}]);
