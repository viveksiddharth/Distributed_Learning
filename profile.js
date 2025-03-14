var app = angular.module('profileapp',[]);

app.controller('myctrl1', ['$scope', '$http', function($scope, $http){

    $scope.inprofile = function(){

        $http.post('/inopenprofile')
        .then(function(response){
            $scope.rollno = response.data.rollno;
            $scope.name = response.data.name;
            $scope.email = response.data.email;
            $scope.queslen = response.data.queslen;
            $scope.anslen = response.data.anslen;
            $scope.coins = response.data.queslen*1 + response.data.likeslen *10;
        })
        .catch(function(err){
            console.log("error1", err);
        });
    };
}]);

