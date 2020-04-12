ideaTree.controller('homeCtrl', ['$rootScope','$scope','IdeaSheetService', function($rootScope, $scope, IdeaSheetService){
    
    $scope.selectedIdea = null;
    $scope.editIdea = false;
    $scope.selectedIdeaIndex = null
    $scope.selectIdea = function(idea, index){
        $scope.selectedIdea = idea;
        $scope.selectedIdeaIndex = index;
    }

    $scope.saveIdea =  function(){
        $rootScope.ideas_schema.forEach(function(key){
            $scope.selectedIdea[key] = $scope.editedIdea[key];
        });
        // save to excel
        IdeaSheetService.updateRow($scope.selectedIdea, $scope.selectedIdeaIndex+2).then(function(){
            $scope.toggleEdit();
        }, function(){
            $scope.toggleEdit();
        });
        
    };
    
    $scope.$watch(function(){
        return $scope.editIdeaTeam;
    }, function(){
        if($scope.editIdeaTeam && $scope.editIdeaTeam[0] == '{'){
            $scope.selectedTeamId = JSON.parse($scope.editIdeaTeam)["id"];
            $scope.editedIdea.team = JSON.parse($scope.editIdeaTeam)["team_name"]; 
            
            $scope.editedIdea.created_by = '';
        };
        
    }, true);


    $scope.toggleEdit = function(){
        $scope.editIdea = !$scope.editIdea;
        $scope.editedIdea = {};
        if($scope.editIdea){
            $scope.editedIdea = {
                'title' : $scope.selectedIdea.title,
                'description' : $scope.selectedIdea.description,
                'team' : $scope.selectedIdea.team,
                'team_members':$scope.selectedIdea.team_members,
                'tags' : $scope.selectedIdea.tags,
                'created_at': $scope.selectedIdea.created_at,
                'completion_date' : $scope.selectedIdea.completion_date,
                'created_by' : $scope.selectedIdea.created_by,
                'category' : $scope.selectedIdea.category,
                'status':$scope.selectedIdea.status
            };
            $rootScope.teams.forEach(element => {
                console.log(element);
                if(element.team_name == $scope.selectedIdea.team){
                    $scope.editIdeaTeam = JSON.stringify({"id":element.id, "team_name":element.team_name});
                }
            });
            console.log($scope.editedIdea.created_by);
        }
        
    }

    $scope.getStatusClass = function(status){
        if(status == 'upcoming'){
            return 'status status-upcoming';
        }else if(status == 'ongoing'){
            return 'status status-ongoing';
        }else if(status == 'completed'){
            return 'status status-completed';
        }else if(status == 'dropped'){
            return 'status status-dropped';
        }else{
            return 'status';
        }
    };


    $scope.ideaFilter = function(idea){
        if($rootScope.filterStatus == null){
            $rootScope.filterStatus = '';
        }
        if($rootScope.filterMember == null){
            $rootScope.filterMember = '';
        }
        if($rootScope.filterTeam == null){
            $rootScope.filterTeam = '';
        }
        console.log($rootScope.filterStatus);
        // console.log(idea.status.includes($rootScope.filterStatus) && idea.created_by.includes($rootScope.filterMember) && idea.team.includes($rootScope.filterTeam));
        return (idea.status.includes($rootScope.filterStatus) && idea.created_by.includes($rootScope.filterMember) && idea.team.includes($rootScope.filterTeam));
    }
}]);