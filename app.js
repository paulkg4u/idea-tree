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
            'team' : '',
            'team_members':'',
            'tags' : '',
            'created_at' : new Date(),
            'completion_date' : '',
            'created_by' : '',
            'category' : '',
            'status':''
        };
    };

    $rootScope.saveIdea = function(){
        console.log($rootScope.newIdea);
        IdeaSheetService.addRowToIdeas($rootScope.newIdea).then(function(){
            IdeaSheetService.getCurrentRows().then(function(){
                $rootScope.addingIdea = false;
            }, function(){
                console.log("could not load new")
            });
        }, function(){
            $rootScope.addingIdea = false;
        }); 
        
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