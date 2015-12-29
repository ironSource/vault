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
            // TODO remove the token from the controller
            $http({
                methode: 'GET',
                url: '/v1/sys/mounts',
                headers: {'X-Vault-Token' : '217b19dd-287b-8d59-b1b6-7ccedc533765' }
            }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                console.log('success -->',response);
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                console.log('err -->' ,response);
                });
        }

        init();
    }]);
