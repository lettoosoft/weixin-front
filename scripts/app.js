(function () {
    'use strict';  
    angular.module('app', ['ngRoute','ngAnimate', 'http-auth-interceptor', 'ngCookies', 'ui.bootstrap', 'easypiechart', 'mgo-angular-wizard', 'textAngular', 'ui.tree', 'ngMap', 'ngTagsInput', 'app.ui.ctrls', 'app.ui.directives', 'app.ui.services', 'app.controllers', 'app.services', 'app.directives', 'app.form.validation', 'app.ui.form.ctrls', 'app.ui.form.directives', 'app.tables', 'app.map', 'app.task', 'app.localization', 'app.chart.ctrls', 'app.chart.directives', 'app.page.ctrls']).config([
        '$routeProvider', function ($routeProvider) {
            return $routeProvider
              .when('/', {
                templateUrl: 'landingPage.html'
            }).when('/pages/UserAgreement',{
                templateUrl:'views/pages/User-agreement.html'
            }).when('/dashboard', {
                templateUrl: 'views/dashboard.html'
            }).when('/welcome', {
                templateUrl: 'views/welcome.html'
            }).when('/needVerify', {
                templateUrl: 'views/needVerify.html'
            }).when('/landingPage', {
                templateUrl: 'landingPage.html'
            }).when('/pages/signin', {
                templateUrl: 'views/pages/signin.html'
            }).when('/pages/signup', {
                templateUrl: 'views/pages/signup.html'
            }).when('/pages/forgot', {
                templateUrl: 'views/pages/forgot-password.html'
            }).when('/pages/lock-screen', {
                templateUrl: 'views/pages/lock-screen.html'
            }).when('/pages/apps', {
                templateUrl: 'views/pages/apps.html'
            }).when('/pages/profile', {
                templateUrl: 'views/pages/profile.html'
            }).when('/pages/avtar', {
                templateUrl: 'views/pages/avtar.html'                
            }).when('/pages/paid', {
                templateUrl: 'views/pages/paid.html'
            }).when('/pages/reset', {
                templateUrl: 'views/pages/reset.html'
            }).when('/pages/detail/:appId', {
                templateUrl: 'views/pages/detail.html'
            }).when('/pages/payMent', {
                templateUrl: 'views/pages/payMent.html'
            }).when('/pages/notSensitization',{
                templateUrl:'views/pages/not-sensitization.html'
            }).when('/Introduction',{
                templateUrl:'Introduction.html'
            }).when('/Display',{
                templateUrl:'Display.html'
            }).when('/Successful',{
                templateUrl:'Successful.html'
            }).otherwise({
                redirectTo: '/404'
            });
        }
    ])
        .run(
        ['$rootScope', '$location', 'LoginService', '$cookies',
            function ($rootScope, $location, LoginService, $cookies) {

                $rootScope.apiHost = 'http://121.40.126.220';
                //$rootScope.apiHost = 'http://localhost:8000';
                $rootScope.user = null;
                LoginService.saveAttemptUrl();

                var url = $.trim($location.path());
                if (url != '/pages/UserAgreement' && url != '/pages/avtar'  && url != '/pages/forgot' && url != '/pages/signup' && url != '' && url != 'landingPage' && url != '/' && url != '/welcome' && url != '/needVerify') {
                    // LoginService.isLoggedIn() 应该先执行，以便从cookie里取回auth_key放到http header里
                    // 然后再执行LoginService.get_currentuser()去判断是否登录。
                    if (!LoginService.isLoggedIn()) {
                        LoginService.saveAttemptUrl();
                        $location.path('/pages/signin');
                    }
                    LoginService.get_currentuser();
                }

                $rootScope.$on('event:get_currentuser_successed', function (e, rejection) {
                    if ($rootScope.user.email_verified) {
                        LoginService.redirectToAttemptedUrl();
                    } else {
                        $location.path('/needVerify');
                    }
                });

                $rootScope.$on('event:auth-loginRequired', function (e, rejection) {
                    $location.path('/pages/signin');
                });

                $rootScope.$on('event:auth-loginConfirmed', function () {
                    if ($rootScope.user.email_verified) {
                        $location.path('/dashboard');
                    } else {
                        $location.path('/needVerify');
                    }
                });

                $rootScope.$on('event:auth-logout-complete', function () {
                    delete $cookies.is_login;
                    delete $cookies.authorization;
                    $location.path('/pages/signin');
                });
            }

        ])
        .value('redirectToUrlAfterLogin', { url: '/' });
}).call(this);
