/* TODO */
// use knex with sqlite3 instead of xlsx

ideaTree.service('IdeaSheetService', ['$rootScope', '$q', function($rootScope, $q)  {
    var Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    var ideas_worksheet;
    $rootScope.ideas_schema = ['id', 'title', 'description','team_members', 'tags','created_at', 'completion_date', 'created_by','team','category','status'];
    $rootScope.team_schema = ['id', 'team_name'];
    $rootScope.member_schema = ['id', 'name', 'email', 'team_id']
    this.initializeWorkBook = function(){
        var deferred = $q.defer();
        workbook.xlsx.readFile('data.xlsx').then(function() {
            ideas_worksheet = workbook.getWorksheet('ideas');
            teams_worksheet = workbook.getWorksheet('teams');
            member_worksheet = workbook.getWorksheet('members');
            ideas_worksheet.columns = [
                { header: 'id', key: 'id', width: 10 },
                { header: 'Title', key: 'title', width: 32 },
                { header: 'Description', key: 'description', width: 32},
                { header: 'Team', key: 'team', width: 32},
                { header: 'Tags', key: 'tags', width: 32},
                { header: 'Created At', key: 'created_at', width: 32},
                { header: 'Completion Date', key: 'completion_date', width: 32},
                { header: 'Created By', key: 'created_by', width: 32},
                { header: 'Team Members', key: 'team_members', width: 32},
                { header: 'Category', key: 'category', width: 32},
                { header: 'Status', key: 'status', width: 32},
            ];
            teams_worksheet.columns = [
                { header : 'id', key : 'id', width : 10 },
                { header: 'Team Name', key: 'team_name', width: 32},
            ];
            member_worksheet.columns = [
                { header : 'id', key : 'id', width : 10 },
                { header: 'Name', key: 'name', width: 32},
                { header: 'Email', key: 'email', width: 32},
                { header: 'Team', key: 'team_id', width: 10},
            ];
            deferred.resolve(true);
        }, function(error){
            console.log(error);
            deferred.reject(false);
        });
        return deferred.promise;

    };

    /* TODO */

    this.addRowToIdeas = function(row_data){
        var deferred = $q.defer();
        ideas_worksheet = workbook.getWorksheet('ideas');
        ideas_worksheet.addRow(row_data);
        workbook.xlsx.writeFile("data.xlsx").then(function() {
            deferred.resolve(true);
        }, function(){
            deferred.reject(false);
        });
        return deferred.promise;
    };

    this.updateRow = function(data, index){
        var deferred = $q.defer();
        ideas_worksheet = workbook.getWorksheet('ideas');
        row = ideas_worksheet.getRow(index);
        row.values = data;
        workbook.xlsx.writeFile("data.xlsx").then(function() {
            deferred.resolve(true);
        }, function(){
            deferred.reject(false);
        });
        return deferred.promise;
    }

    this.getCurrentRows = function(){
        var deferred = $q.defer();
        $rootScope.ideas = [];
        ideas_worksheet.eachRow(function(row, index){
            console.log(row.getCell('status').value);
            if(index > 1){
                var rowData ={};
                $rootScope.ideas_schema.forEach(function(key){
                    rowData[key] = row.getCell(key).value;
                });
                $rootScope.ideas.push(rowData);
                
            }
        });
        deferred.resolve(true);
        return deferred.promise;
    };

    this.getTeams = function(){
        var deferred = $q.defer();
        $rootScope.teams = [];
        console.log(teams_worksheet);
        teams_worksheet.eachRow(function(row, index){
            
            if(index > 1){
                var rowData ={};
                $rootScope.team_schema.forEach(function(key){
                    rowData[key] = row.getCell(key).value;
                });
                $rootScope.teams.push(rowData);
                console.log(rowData)
            }
        });
        
        console.log($rootScope.teams);
        deferred.resolve(true);
        return deferred.promise;
    };

    this.getMembers = function(){
        console.log("hello");
        var deferred = $q.defer();
        $rootScope.members = [];
        member_worksheet.eachRow(function(row,index){
            if(index > 1){
                var rowData ={};
                $rootScope.member_schema.forEach(function(key){
                    rowData[key] = row.getCell(key).value;
                });
                $rootScope.members.push(rowData);
                console.log(rowData);
            }
        });
        
        
        console.log($rootScope.members);
        deferred.resolve(true);
        return deferred.promise;
    };

}]);