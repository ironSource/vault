var app = angular.module('app', [
    'ui.bootstrap',
    'ui.router',
    'ui.bootstrap',
    'views.loginCtrl',
    'views.mountsCtrl'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        'use strict';

        // Set the default state to the login homepage
        $urlRouterProvider.otherwise(function ($injector) {
            $injector.get('$state').go('login');
        });
}]);