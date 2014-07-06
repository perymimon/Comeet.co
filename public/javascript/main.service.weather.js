MainModule.factory("WeatherService", ['$q', '$http', function($q, $http) {
    var SERVICE_ENDPOINT = "http://api.openweathermap.org/data/";

    var request = function(version, path,data) {
        var extend= angular.extend;
        var deferred = $q.defer();

        $http({
            method: 'jsonp',
            responseType:'json',
            url:SERVICE_ENDPOINT + version + '/' + path,
            params:extend({
                    units:'metric', //todo:not work , why? version to much old?
                    callback:'JSON_CALLBACK'
                },data)
        })
        .success(function(data, status, headers, config){
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config){
            deferred.reject(data);
        });

        return deferred.promise;
    };

    var normalizeDays = function(days) {
        var d = days;

        if(days === undefined || days === null || parseInt(days) < 1) d = 7;
        if(d > 14) d = 14; // max 14 days

        return d;
    };

    return {
        /*
        * static functions
        * */
        convert:{
            celsius:{
                kelvin: function (celsius) {
                    return celsius + 273.15;
                },
                fahrenheit: function (celsius) {
                    return ( celsius/(5/9)) + 32
                }
            },
            fahrenheit:{
                celsius: function (fahrenheit) {
                    return  (5/9)*(fahrenheit -32)
                }
            },
            kelvin:{
            celsius: function (klevin){
                    return klevin - 273.15;
                }
            }
        },
        /*
        * request info function
        * */
        stations:{
            byBBox: function(latMin, lngMin,latMax, lngMax){
                return request(2.1,'find/station',{bbox:[latMin,lngMin,latMax,lngMax].join(',')})
            }
        },
        current: {
            byPosition: function(lat, lng){
                return request(2.5, "/weather",{lat:lat,lon:lng});
            },
            byCity: function(cityName){
                return request(2.5,"/weather",{q:cityName});
            },
            byCityId: function(cityId){
                return request(2.5,"/weather",{id:cityId});
            }
        },
        forecast: {
            byPosition: function(lat, lng, days, units) {
                var u = units || 'imperial'; // internal, metric, or imperial
                var d = normalizeDays(days);

                var path = "/forecast/daily";
                return request(2.5,path,{lat:lat,lon:lng,cnt:d,mode:'json'});
            },
            byCity: function(cityName, days, units) {
                var u = units || 'imperial'; // internal, metric, or imperial
                var d = normalizeDays(days);

                var path = "/forecast/daily";
                return request(2.5,path,{q: cityName, cnt: d, mode:'json'});
            },
            byCityId: function(cityId, days, units) {
                var u = units || 'imperial'; // internal, metric, or imperial
                var d = normalizeDays(days);

                var path = "/forecast/daily";
                return request(2.5,path,{id:cityId,cnt:d,mode:'json'});
            }
        }
    }
}]);
