var app = angular.module('myApp', []);

app.controller('myctrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.questions = [];
    $scope.showFull = [];

    $scope.toggleQuestion = function(index) {
        $scope.showFull[index] = !$scope.showFull[index];
    };

    $scope.displayquestion = function() {
        console.log("came to display in angular");
        $http.post('/display2')
            .then(function(response) {
                $scope.questions = response.data.questions;
                $scope.Sampletopic = response.data.topic;
                $scope.description = response.data.description;
            })
            .catch(function(err) {
                console.error(err);
            });
    };

    $scope.addnewquestion = function() {
        console.log($scope.newquestiondisplay);
        $http.post("/addnewquestion", { question: $scope.newquestiondisplay })
            .then(function(response) {
                console.log("question added successfully");
            })
            .catch(function(err) {
                console.error(err);
                alert("Something went wrong");
            });
    };

    $scope.displayanswers = function(qid) {
        $http.post('/saveques', { qid: qid })
            .then(function(response) {
                console.log("going to answers page");
                $window.location.href = "./answerspage.html";
            })
            .catch(function(err) {
                console.error(err);
            });
    };

    $scope.openprofilepage = function(user){
        console.log(user);
        $http.post('/openprofile',{user:user})
        .then(function(response){
            console.log("userprofiledisplayed");
            var screenWidth = window.screen.width;
            var screenHeight = window.screen.height;
            var windowWidth = 800; 
            var windowHeight = 600; 
            var left = (screenWidth - windowWidth) / 2;
            var top = (screenHeight - windowHeight) / 2;
            var popup = window.open('./profile.html', 'Profile', 'width=700,height=600,top=' + top + ',left=' + left + ',scrollbars=yes,resizable=yes');
            if (!popup) {
                alert('Please enable pop-ups for this site');
            }
        })
        .catch(function(err){
            console.log("error22" , err)
        })

    }
}]);
