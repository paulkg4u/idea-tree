ideaTree.controller('homeCtrl', ['$rootScope','$scope','IdeaSheetService', function($rootScope, $scope, IdeaSheetService){
    
    $scope.selectedIdea = null;
    $scope.selectIdea = function(idea){
        $scope.selectedIdea = idea;
    }
}]);