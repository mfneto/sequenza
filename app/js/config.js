(function (AppSequenza) {
    'use strict';
    AppSequenza.config(Config);
    Config.$inject = ['$locationProvider', '$routeProvider', '$httpProvider'];

    function Config($locationProvider, $routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('blockWindowService')
        $locationProvider.hashPrefix('!');
        // routes
        $routeProvider
            .when("/", {
                templateUrl: "./partials/grid.html",
                controller: "GridController"
            })
            .when("/Customer", {
                templateUrl: "./partials/customer.html",
                controller: "CustomerController"
            })
            .when("/Customer/:id", {
                templateUrl: "./partials/customer.html",
                controller: "CustomerController"
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})(AppSequenza);