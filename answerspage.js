var app = angular.module('myApp', []);
console.log("came ans answers page")

app.controller('myctrl', ['$scope', '$http', '$window',function($scope,$http,$window) {
    $scope.answers = [];

    $scope.showFull = [];

    $scope.liked=[];
    $scope.disliked=[];

    $scope.toggleanswer = function(index) {
        $scope.showFull[index] = !$scope.showFull[index];
    };



    $scope.toggleLike = function(index) {
        $scope.liked[index] = !$scope.liked[index];
        if ($scope.liked[index]) {
            $scope.disliked[index] = false; 

            $http.post('/addlike' , {aid:$scope.answers[index].aid} )
            .then(function(response){
                console.log(response.data.likescount,response.data.dislikescount)
                $scope.answers[index].likescount = response.data.likescount;
                $scope.answers[index].dislikescount = response.data.dislikescount;
            })
            .catch(function(error){
                console.log("wrong",error);
            })
        }
    };

    $scope.toggleDislike = function(index) {
        $scope.disliked[index] = !$scope.disliked[index];
        if ($scope.disliked[index]) {
            $scope.liked[index] = false;
            console.log($scope.answers[index]);
            $http.post('/adddislike' , {aid:$scope.answers[index].aid} )
            .then(function(response){
                console.log(response.data.likescount,response.data.dislikescount)
                $scope.answers[index].likescount = response.data.likescount;
                $scope.answers[index].dislikescount = response.data.dislikescount;
            })
            .catch(function(error){
                console.log("wrong");
            })
        }
    };

    $scope.displaylikes = function(index){
        
        console.log($scope.answers[index].aid)
        console.log("came to display likes");
        $http.post('/display4',{aid:$scope.answers[index].aid})
        .then(function(response){
            if (response.data.success)
            {
                $scope.liked[index]=true;
            }
            $scope.answers[index].likescount = response.data.likeslen;
        })
        .catch(function(err){
            console.log(err);
        })
    };

    $scope.displaydislikes = function(index){
        
        $http.post('/display5',{aid:$scope.answers[index].aid})
        .then(function(response){

            if (response.data.success)
            {
                $scope.disliked[index]=true;
            }
            $scope.answers[index].dislikescount = response.data.dislikeslen;
            
        })
        .catch(function(err){
            console.log(err);
        })
    };

    $scope.addnewanswer = function() {
        console.log($scope.newanswerdisplay);
        $http.post("/addnewanswer", { answer: $scope.newanswerdisplay })
            .then(function(response) {
                console.log("question added successfully");
            })
            .catch(function(err) {
                console.error(err);
                alert("Something went wrong");
            });
    };

    $scope.displayanswers = function() {

        console.log("came to display in angular")

        $http.post('/display3')
        .then(function(response){
            $scope.answers = response.data.answers;
            console.log(response.data.question);
            $scope.question = response.data.question;
        })
}

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
