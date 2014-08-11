angular.module('app.page.services', []).factory('UpdateUser', ['$http', function ($http) {
        var service = {
            Update: function(user){
                var url ='http://121.40.126.220/api/v1/';
                return $http.post(url,user).success(function (data) {
            //IMPORTANT: You need to activate always_return_data in your ressource (see example)
                    user.id = data.id;
                    console.log(data);
                    }).error(function (data) {
                    console.log(data);
                    });
                },
            };
        return service;
}]);