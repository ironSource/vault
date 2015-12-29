var app = angular.module('app', [
    'ui.router',
    'isVaultUi',

    'views.loginCtrl'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        'use strict';

        // Set the default state to the login homepage
        $urlRouterProvider.otherwise(function ($injector) {
            $injector.get('$state').go('login');
        });
}]);
