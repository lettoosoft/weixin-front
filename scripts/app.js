(function () {
    'use strict';
    angular.module('app', ['ngRoute', 'ngAnimate', 'http-auth-interceptor','ngCookies','ui.bootstrap', 'easypiechart', 'mgo-angular-wizard', 'textAngular', 'ui.tree', 'ngMap', 'ngTagsInput', 'app.ui.ctrls', 'app.ui.directives', 'app.ui.services', 'app.controllers', 'app.services','app.directives', 'app.form.validation', 'app.ui.form.ctrls', 'app.ui.form.directives', 'app.tables', 'app.map', 'app.task', 'app.localization', 'app.chart.ctrls', 'app.chart.directives', 'app.page.ctrls']).config([
        '$routeProvider', function ($routeProvider) {
            return $routeProvider.when('/', {
                templateUrl: 'landingPage.html'
            }).when('/dashboard', {
                templateUrl: 'views/dashboard.html'
            }).when('/needVerify',{
                templateUrl:'views/dashboard.html'
            }).when('/landingPage',{
                templateUrl:'landingPage.html'
            })
                // .when('/ui/typography', {
                //   templateUrl: 'views/ui/typography.html'
                // }).when('/ui/buttons', {
                //   templateUrl: 'views/ui/buttons.html'
                // }).when('/ui/icons', {
                //   templateUrl: 'views/ui/icons.html'
                // }).when('/ui/grids', {
                //   templateUrl: 'views/ui/grids.html'
                // }).when('/ui/widgets', {
                //   templateUrl: 'views/ui/widgets.html'
                // }).when('/ui/components', {
                //   templateUrl: 'views/ui/components.html'
                // }).when('/ui/timeline', {
                //   templateUrl: 'views/ui/timeline.html'
                // }).when('/ui/nested-lists', {
                //   templateUrl: 'views/ui/nested-lists.html'
                // }).when('/ui/pricing-tables', {
                //   templateUrl: 'views/ui/pricing-tables.html'
                // }).when('/forms/elements', {
                //   templateUrl: 'views/forms/elements.html'
                // }).when('/forms/layouts', {
                //   templateUrl: 'views/forms/layouts.html'
                // }).when('/forms/validation', {
                //   templateUrl: 'views/forms/validation.html'
                // }).when('/forms/wizard', {
                //   templateUrl: 'views/forms/wizard.html'
                // }).when('/maps/gmap', {
                //   templateUrl: 'views/maps/gmap.html'
                // }).when('/maps/jqvmap', {
                //   templateUrl: 'views/maps/jqvmap.html'
                // }).when('/tables/static', {
                //   templateUrl: 'views/tables/static.html'
                // }).when('/tables/responsive', {
                //   templateUrl: 'views/tables/responsive.html'
                // }).when('/tables/dynamic', {
                //   templateUrl: 'views/tables/dynamic.html'
                // }).when('/charts/others', {
                //   templateUrl: 'views/charts/charts.html'
                // }).when('/charts/morris', {
                //   templateUrl: 'views/charts/morris.html'
                // }).when('/charts/flot', {
                //   templateUrl: 'views/charts/flot.html'
                // }).when('/mail/inbox', {
                //   templateUrl: 'views/mail/inbox.html'
                // }).when('/mail/compose', {
                //   templateUrl: 'views/mail/compose.html'
                // }).when('/mail/single', {
                //   templateUrl: 'views/mail/single.html'
                // }).when('/pages/features', {
                //   templateUrl: 'views/pages/features.html'
                // })
                .when('/pages/signin', {
                    templateUrl: 'views/pages/signin.html'
                }).when('/pages/signup', {
                    templateUrl: 'views/pages/signup.html'
                }).when('/pages/forgot', {
                    templateUrl: 'views/pages/forgot-password.html'
                }).when('/pages/lock-screen', {
                    templateUrl: 'views/pages/lock-screen.html'
                }).when('/pages/profile', {
                    templateUrl: 'views/pages/profile.html'
                })
                // .when('/404', {
                //   templateUrl: 'views/pages/404.html'
                // }).when('/pages/500', {
                //   templateUrl: 'views/pages/500.html'
                // })
                 .when('/pages/reset', {
                   templateUrl: 'views/pages/reset.html'
                 })
                  .when('/pages/reset', {
                   templateUrl: 'views/pages/reset.html'
                 })
                // .when('/pages/invoice', {
                //   templateUrl: 'views/pages/invoice.html'
                // }).when('/pages/services', {
                //   templateUrl: 'views/pages/services.html'
                // }).when('/pages/about', {
                //   templateUrl: 'views/pages/about.html'
                // }).when('/pages/contact', {
                //   templateUrl: 'views/pages/contact.html'
                // }).when('/tasks', {
                //   templateUrl: 'views/tasks/tasks.html'
                // })
                .otherwise({
                    redirectTo: '/404'
                });
        }
    ])
    .run(
        ['$rootScope', '$location', 'LoginService', '$cookies',
            function ($rootScope, $location, LoginService, $cookies) {
                var url = $.trim($location.path());
                if ($location.path()!='' && $location.path != 'landingPage' && url != '/') {
                    console.log($location.path());
                    if (!LoginService.isLoggedIn()) {
                        LoginService.saveAttemptUrl();
                        $location.path('/pages/signin');
                    }
                    $rootScope.apiHost = 'http://121.40.126.220';
                    //$rootScope.apiHost = 'http://localhost:8000';
                    $rootScope.user = null;
                    LoginService.get_currentuser();
                    $rootScope.$on('event:auth-loginRequired', function (e, rejection) {
                        /*delete $cookies.is_login;
                         delete $cookies.authorization;
                         AuthenticationService.saveAttemptUrl();
                         $location.path('/access/signin');
                         //$state.go('access.signin', {}, {reload: true, inherit: false});*/

                                    $location.path('/pages/signin');
                                });

                    $rootScope.$on('event:auth-loginConfirmed', function () {
                        if ($rootScope.user.email_verified) {
                            $location.path('/dashboard');
                        }else{
                            $location.path('/needVerify');
                        }
                        //AuthenticationService.redirectToAttemptedUrl();
                        //$state.go('app.dashboard', {}, {reload: true, inherit: false});
                    });

                    $rootScope.$on('event:auth-logout-complete', function () {
                        delete $cookies.is_login;
                        delete $cookies.authorization;
                        $location.path('/pages/signin');
                    });
                }
            }

        ])
        .value('redirectToUrlAfterLogin', { url: '/' });
}).call(this);

//# sourceMappingURL=app.js.map
