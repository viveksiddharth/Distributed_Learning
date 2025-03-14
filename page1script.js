var app = angular.module('myApp', []);

console.log("this is angular js")

app.controller('myCtrl' ,[ '$scope' , '$http', function($scope,$http){
  $scope.containers = [
    { id: 'c', name: 'C', description: 'This is an area to learn and spread knowledge on C' },
    { id: 'c2', name: 'C++', description: 'This is an area to learn and spread knowledge on C++' },
    { id: 'java', name: 'Java', description: 'This is an area to learn and spread knowledge on Java' },
    { id: 'python', name: 'Python', description: 'This is an area to learn and spread knowledge on Python' },
    { id: 'cloud', name: 'Cloud Computing', description: 'This is an area to learn and spread knowledge on Cloud computing' },
    { id: 'dsa', name: 'DSA', description: 'This is an area to learn and spread knowledge on DSA' }
  ];

  
    $scope.enter = function(name) {
      $http.post('/topic', { topic1: name })
        .then(function(response) {
          if (response.data.success) {
            console.log("selected topic");
            window.location.href = './questionspage.html'
          }
        })
        .catch(function(error) {
          alert("Something went wrong!!!!!");
        });
    };

}]);

app.controller('myctrl2' ,[ '$scope' , '$http', function($scope,$http){
  $scope.display =function(){
    $http.post('/display')
      .then(function(response){
        if(response.data.success)
        {
          $scope.rollno = true;
          $scope.name = true;
          $scope.email = true;
          $scope.rollno1 = response.data.rollno;
          $scope.name1 = response.data.name;
          $scope.email1 = response.data.email;
          $scope.queslen = response.data.queslen;
          $scope.anslen = response.data.anslen;
          $scope.coins = response.data.queslen*1 + response.data.likeslen *10;
        }
      })
      .catch(function(error){
          console.error("Error:",error);
      });
  }
}]);


app.controller('myctrl3' , ['$scope','$http' ,'$window' , function($scope,$http,$window){

  $scope.showFull = [];

  $scope.toggleQuestion = function(index) {
      $scope.showFull[index] = !$scope.showFull[index];
  };

  $scope.questions=[]
  $scope.display8 = function(){
    $http.post('display8')
    .then(function(response){
      $scope.questions = response.data.questions;
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
}])
