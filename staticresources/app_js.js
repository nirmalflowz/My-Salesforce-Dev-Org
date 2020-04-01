var app = angular.module('myApp',['ngRoute','ui.bootstrap','ngSanitize','ngCookies']);

app.config(function($routeProvider,$locationProvider){
    $locationProvider.hashPrefix('');
    $routeProvider.when("/aboutus", {
        templateUrl : window.about,
        controller:'aboutUsController'
    })
    .when("/services", {
        templateUrl : "views/Services.html",
        controller:'servicesController'
    })
    .when("/contactus", {
        templateUrl : "views/ContactUs.html",
        controller:'contactUsController'
    }).when("/",{
        templateUrl:window.homeUrl,
        controller:'mainController'
    }).when("/productDesc/:userId",{
        templateUrl:window.prodDesc,
        controller:'productDescController'
    }).when("/cart",{
        templateUrl:window.cart,
        controller:'cartController'
    })/*.when("/listview",{
        templateUrl:'views/ProductListView.html',
        controller:'mainController'
    })*/;
});