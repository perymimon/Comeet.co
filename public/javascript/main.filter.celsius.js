/**
 * Created by pery on 05/07/14.
 */

/*
* add conver filter to main moder, for real time conver Klevin to celsius
* not in user
* */
MainModule.filter('celsius',[function () {
    return function (klevin) {
        return  klevin- 273.15;
    }
}]);
