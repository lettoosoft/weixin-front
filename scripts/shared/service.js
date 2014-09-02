'use strict';

angular.module('app.services', [])
    .factory('resetService', function ($rootScope,$http,authService){
        var service = {
            ReSet:  function(check,$scope){
                        var url = $rootScope.apiHost + '/api/v1/user/password/reset/';
                        $http.post(url,check).success(function (data){
                            $scope.send = true;
                            $scope.sendError = false;
                        }).error(function (data){
                            $scope.disabled = false;
                            $scope.sendError = true;
                        })
                    },
            change: function(check,$scope){
                        var url = $rootScope.apiHost + '/api/v1/user/password/change/';
                        $http.post(url,check)
                        .success(function (data){
                            $scope.disabled = true;
                            //修改密码成功之后
                            //调用controller里面的logout方法
                            $scope.logout();
                        })
                        .error(function (data){
                            $scope.disabled = false;
                            $scope.error = "原密码输入错误！请重新输入！";               
                        })
            }
        }
        return service;
    })
    .factory('LoginService', function ( $rootScope, $http, authService, $cookies, $location, redirectToUrlAfterLogin) {
        var service = {
            login: function (signin) {
                var url = $rootScope.apiHost + '/api/v1/user/login/';
                $http.post(url, signin, { ignoreAuthModule: true })
                    .success(function (data, status, headers, config) {
                        //添加判断，注册用户是否激活






                        //
                        $rootScope.user = data;
                        var auth = 'ApiKey ' + data.username + ':' + data.apikey;
                        $http.defaults.headers.common.Authorization = auth;  // Step 1

                        // Save auth apikey in cookie
                        $cookies.is_login = true;
                        $cookies.authorization = auth;

                        // Need to inform the http-auth-interceptor that
                        // the user has logged in successfully.  To do this, we pass in a function that
                        // will configure the request headers with the authorization token so
                        // previously failed requests(aka with status == 401) will be resent with the
                        // authorization token placed in the header
                        authService.loginConfirmed(data, function (config) {  // Step 2 & 3
                            config.headers.Authorization = auth;
                            
                            return config;
                        });
                        $rootScope.message = "";
                    })
                    .error(function (data, status, headers, config) {
                        $rootScope.$broadcast('event:auth-login-failed', status);
                        $rootScope.message = data.error;
                    });
            },
            logout: function () {
                        delete $http.defaults.headers.common.Authorization;
                        $rootScope.$broadcast('event:auth-logout-complete');
            },
            loginCancelled: function () {
                authService.loginCancelled();
            },
            isLoggedIn: function () {
                if ($cookies.is_login) {
                    $http.defaults.headers.common.Authorization = $cookies.authorization;
                    return true;
                }
                return false;
            },
            saveAttemptUrl: function () {
                if ($location.path().toLowerCase() != '/pages/signin') {
                    redirectToUrlAfterLogin.url = $location.path();
                }
                else
                    redirectToUrlAfterLogin.url = '/dashboard';
            },
            redirectToAttemptedUrl: function () {
                $location.path(redirectToUrlAfterLogin.url);
            },
            get_currentuser: function () {
                var url = $rootScope.apiHost + '/api/v1/me/';
                $http.post(url)
                    .success(function (data, status, headers, config) {
                        $rootScope.user = data;
                        $rootScope.$broadcast('event:get_currentuser_successed');
                    })
                    .error(function (data, status, headers, config) {
                        console.log("Error occurred.  Status:" + status);
                    });
            }
        };
        return service;

    })
    .factory('signUpService', function ($http, $rootScope, $location, authService, $cookies, redirectToUrlAfterLogin) {
        var service = {
            signUp: function (signup,$scope) {
                var url = $rootScope.apiHost + '/api/v1/createuser/';
                return $http.post(url, signup)
                    .success(function (data, status, headers, config) {
                        //调用controller里面的方法
                        $rootScope.$broadcast('event:sign_up_success');
                    })
                    .error(function (data) {
                        $scope.disabled = false;
                    });
            },
            reSendEmail:function ($scope) {
                var url = $rootScope.apiHost + '/api/v1/user/resend/';
                  return $http.post(url,{email:$rootScope.user.email})
                    .success(function (data){
                        $scope.success = true;
                    })
                    .error(function (data){
                        $scope.error = true;
                        $scope.disable = false;
                    })
            }
        };
        return service;
    })
    .factory('RegEpxService', [ function () {
        var service = {
            explain: function($scope){
                $scope.info = true;
            },
            explainDisappear:function($scope){
                var re = /^[a-zA-Z0-9_]+/g;
                    if (re.test($scope.check.password)) {
                        $scope.danger1 = false;
                        $scope.disabled = false;

                    }else{
                        $scope.danger1 = true;
                        $scope.disabled = true;
                    }
                    $scope.info = false;

            }
        };
        return service;
    }])
    .factory('UpdateUser', ['$http','$rootScope',function ($http,$rootScope) {
        var service = {
            Update: function(profile){
                var url ='http://121.40.126.220/api/v1/user/'+$rootScope.user.id+'/';
                return $http.put(url,profile).success(function (data) {
            //IMPORTANT: You need to activate always_return_data in your ressource (see example)
                    $rootScope.user=data;
                    console.log("success");
                }).error(function (data) {
                    console.log("fail");
                });
            }
        };
        return service;
    }])
    .factory('weixin', ['$http','$rootScope',function ($http,$rootScope) {
        var service = {
            // 获取微信列表
            select:function(scope){
                var url = $rootScope.apiHost +  '/api/v1/publicaccount/';
                $http.get(url).success(function(data){
                    scope.weixin = data.objects;
                    scope.weixin_num = data.objects.length;
                    var apps=[
                        {"id":1,"title":"失物招领","status":0,"dateline":"2015年9月1日","switch":true},
                        {"id":2,"title":"吃货口袋","status":1,"dateline":"2015年9月1日","switch":false},
                        {"id":3,"title":"表白墙","status":0,"dateline":"2015年9月1日","switch":true}
                    ]
                    scope.apps=apps;
                });
            },
            autoAdd:function(newUser,$scope){
                var url = $rootScope.apiHost +  '/api/v1/publicaccount/auto/';
                $http.post(url,newUser).success(function (data){
                    console.log(data);
                }).error(function(){
                    
                })

            },
            add:function(json,addItem){
                //var arr  = {'id':3,'name':'吃货口袋','wid':'mileechkd'};
                var url = $rootScope.apiHost + '/api/v1/publicaccount/';
                $http.post(url,addItem).success(function (data){
                   console.log(data);
                   json.push(data);
                });
                return json;
            }
        };
        return service;
    }])
    .factory('searchService',['$rootScope','$http',function ($rootScope,$http){
        var service = {
            search:function (scope,name){
                var url = $rootScope.apiHost +'/api/v1/weixinapp/?title__contains='+name;
                $http.get(url).success(function(data){
                    if (data.objects.length == 0) {
                        scope.result = true;
                        scope.apps=data.objects;

                    }else{
                        scope.apps=data.objects;
                    }
                })
            },
            searched:function (scope){
                var url = $rootScope.apiHost +'/api/v1/keyword/';
                $http.get(url).success(function(data){
                    scope.keywords = data.objects;
                })
            },
            findApp:function (scope,name){
                var url = $rootScope.apiHost +'/api/v1/weixinapp/?keywords__name__contains='+name;
                $http.get(url).success(function(data){
                    scope.apps=data.objects;
                    scope.result = false;
                })
            }
        };
        return service;
    }])
    .factory('appService', ['$http','$rootScope','$routeParams',function ($http,$rootScope,$routeParams) {
        var service = {
            // 获取微信列表
            select:function(scope){
                var url = $rootScope.apiHost +  '/api/v1/weixinapp/?limit=3';
                $http.get(url).success(function(data){
                    scope.apps = data.objects; 
                });
            },
            paging:function(scope,pages){
                var pagelimit = 3;
                var pageoffset = pages * 3;
                var url = $rootScope.apiHost +  '/api/v1/weixinapp/?limit='+pagelimit+'&offset='+pageoffset;
                $http.get(url).success(function(data){
                    scope.apps = data.objects; 
                    scope.result = false;
                });
            },
            selectDetail:function($scope){
                var url = $rootScope.apiHost +  '/api/v1/weixinapp/';
                $http.get(url).success(function(data){
                    for (var i = 0; i < data.objects.length; i++) {
                         if (data.objects[i].id == $routeParams.appId ) {
                            $scope.app = data.objects[i];
                         };
                     }; 
                });                
            },
            addApp:function(addedApp,app){                                
                addedApp.push(app);
                console.log(addedApp);
            }
        };
        return service;
    }]);

