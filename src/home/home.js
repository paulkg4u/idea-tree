ideaTree.controller('homeCtrl', ['$rootScope','$scope','IdeaSheetService', function($rootScope, $scope, IdeaSheetService){
    
    $scope.selectIdea = function(idea){
        console.log(idea);
    }
}]);