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

}]);