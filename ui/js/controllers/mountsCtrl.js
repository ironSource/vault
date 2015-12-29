angular.module('views.mountsCtrl', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('mounts', {
                url: '/mounts',
                templateUrl: 'partials/mounts.html',
                controller: 'mountsCtrl'
            });
    }])
    .controller('mountsCtrl', ['$scope', '$http', function ($scope, $http) {

        function init () {
            // init
        }

        init();
    }]);
