var app = angular.module("EducationDemocratization",["ngRoute","ngSanitize"]);

app.config(function($routeProvider,$locationProvider){
    $locationProvider.hashPrefix('');
    $routeProvider.when("/", {
        templateUrl : window.loginView
    })
    .when("/lessons", {
        templateUrl : window.lessonView
    }).when("/winnerlesson",{
    	templateUrl:window.winnerLessonView
    }).otherwise({
    	redirectTo:"/"
    });
});

function VotingPageController($scope, $location){
    $scope.login = function(){
        $location.path('/lessons');
    }
    $scope.logo = window.logo;
    $scope.schoollogo = window.schoollogo;
}

app.controller('VotingPageController',VotingPageController);