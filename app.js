global.jQuery = require('jquery');
var angular = require('angular');
var uiRouter = require('@uirouter/angularjs');
var ngAnimate = require('angular-animate');
var angularAria = require('angular-aria');
var angularMaterial = require('angular-material');
var ideaTree = angular.module('ideaTree', ['ui.router', 'ngAnimate','ngAria','ngMaterial']);
require('./services');

ideaTree.run(['$rootScope','$state', 'IdeaSheetService',function($rootScope,$state, IdeaSheetService){
    $rootScope.addingIdea = false;
    $rootScope.filterStatus = '';
    $rootScope.filterTeam = '';
    $rootScope.filterMember = '';
    let dev = false;
    let filePath;
    if (dev){
         filePath = 'data.xlsx'
    }else{
        filePath = '\\\\inunivsie02\\DTS_SRV\\TECOM\\TECOM_shared\\idea_tree-x64\\data.xlsx'
    }
    IdeaSheetService.initializeWorkBook(filePath).then(function(){
        $state.go('home');
        IdeaSheetService.getCurrentRows();
        IdeaSheetService.getTeams();
        IdeaSheetService.getMembers();
    }, function(){
        console.log("error");
    });
    $rootScope.newIdea = {};
    $rootScope.newIdeaTeam = null;
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

    $rootScope.$watch(function(){
        return $rootScope.filterStatus;
    }, function(){
        console.log($rootScope.filterStatus);
        if($rootScope.filterStatus == ''){
            $rootScope.filterStatus = null;
        }
    }, true);

    $rootScope.clearFilter = function () {
        $rootScope.filterStatus = '';
        $rootScope.filterTeam = '';
        $rootScope.filterMember = '';
    }
    $rootScope.selectedTeamId = 0;
    $rootScope.$watch(function(){
        return $rootScope.newIdeaTeam;
    }, function(){
        if($rootScope.newIdeaTeam){
            $rootScope.selectedTeamId = JSON.parse($rootScope.newIdeaTeam)["id"];
            $rootScope.newIdea.team = SON.parse($rootScope.newIdeaTeam)["team_name"]; 
            $rootScope.newIdea.created_by = '';
        };
        
    }, true);

    $rootScope.saveIdea = function(){
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