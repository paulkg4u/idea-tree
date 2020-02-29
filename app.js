
console.log("hello");
var angular = require('angular');
var uiRouter = require('@uirouter/angularjs');

var ideaTree = angular.module('ideaTree', ['ui.router']);
require('./services');

ideaTree.run(['$rootScope','$state', 'IdeaSheetService',function($rootScope,$state, IdeaSheetService){
    $rootScope.addingIdea = false;
    IdeaSheetService.initializeWorkBook().then(function(){
        $state.go('home');
        IdeaSheetService.getCurrentRows();
    }, function(){
        console.log("error");
    });

    $rootScope.addIdea = function(){
        $rootScope.addingIdea = !$rootScope.addingIdea;
        $rootScope.newIdea = {
            'title' : '',
            'description' : '',
            'team_members':'',
            'tags' : '',
            'created_at' : '',
            'completion_date' : '',
            'team_members' : '',
            'category' : ''
        };
    };

    $rootScope.saveIdea = function(){
        IdeaSheetService.addRowToIdeas(); 
    };


}]);

require('./src/home/home');

ideaTree.config(['$stateProvider', function($stateProvider){
    $stateProvider.state('home', {
        url : '/',
        templateUrl : './src/home/home.html',
        controller : 'homeCtrl',
        resolve : {
            liveControl :[
                function(){
                    return true;
                }
            ]
        }
    })
}]);