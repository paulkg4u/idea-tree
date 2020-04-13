global.jQuery = require('jquery');
var angular = require('angular');
var uiRouter = require('@uirouter/angularjs');
var ngAnimate = require('angular-animate');
var angularAria = require('angular-aria');
var angularMaterial = require('angular-material');
var ideaTree = angular.module('ideaTree', ['ui.router', 'ngAnimate','ngAria','ngMaterial']);
require('./services');

ideaTree.run(['$rootScope','$state', 'IdeaSheetService',function($rootScope,$state, IdeaSheetService){
    $rootScope.loadSpinner  = true;
    $rootScope.loadingMessage = '';
    $rootScope.addingIdea = false;
    $rootScope.filterStatus = '';
    $rootScope.filterTeam = '';
    $rootScope.filterMember = '';
    let dev = false;
    if (dev){
         $rootScope.filePath = 'data.xlsx';
    }else{
        $rootScope.filePath = '\\\\inunivsie02\\DTS_SRV\\TECOM\\TECOM_shared\\idea_tree\\data.xlsx';
    }
    $rootScope.loadingMessage = "Fetching Database";
    IdeaSheetService.initializeWorkBook($rootScope.filePath).then(function(){
        // $rootScope.loadSpinner = false;
        //             $rootScope.loadingMessage = "";
        // IdeaSheetService.getCurrentRows();
        // IdeaSheetService.getTeams();
        // IdeaSheetService.getMembers();
        // $state.go('home');
        $rootScope.loadingMessage = "Fetching Tasks";
        IdeaSheetService.getCurrentRows().then(function(){
            $rootScope.loadingMessage = "Fetching Teams";
            IdeaSheetService.getTeams().then(function(){
                $rootScope.loadingMessage = "Fetching Team Members";
                IdeaSheetService.getMembers().then(function(){
                    console.log("here");
                    $rootScope.loadSpinner = false;
                    $rootScope.loadingMessage = "";
                    $state.go('home');
                }, function(){
                    $rootScope.loadSpinner = false;
                    $rootScope.loadingMessage = "";
                    alert("Error loading team members");
                });
            }, function(){
                $rootScope.loadSpinner = false;
                $rootScope.loadingMessage = "";
                alert("Error loading team");
            });
        }, function(){
            $rootScope.loadSpinner = false;
            $rootScope.loadingMessage = "";
            alert("Error loading tasks")
        });
    }, function(){
        $rootScope.loadSpinner = false;
        $rootScope.loadingMessage = "";
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