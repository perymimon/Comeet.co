/**
 * Created by pery on 05/07/14.
 */
MainModule.filter('celsius',[function () {
    return function (klevin) {
        return  klevin- 273.15;
    }
}]);
