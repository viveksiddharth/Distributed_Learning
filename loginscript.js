var app = angular.module('myapploginpage', []);

app.controller('myCtrl', ['$scope', '$http', '$window', function($scope, $http, $window ) {
  $scope.verifyUser = function() {
    $http.post('/verifyUser', {username: $scope.torollno , password:$scope.topassword})
      .then(function(response) {
        if (response.data.success){
            $window.location.href = './homepage.html';
        }
        else{

          $scope.message22 = true;
            $scope.message2 = response.data.message;
        }
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  };
}]);

app.controller('myCtrl2', ['$scope', '$http', '$window', function($scope, $http, $window){
    $scope.verifyadduser = function() {
      
       var pattern = /^CS21B10([1-5][0-9]|60|61|62|63)$/;
       if (pattern.test($scope.torollno2)){

        $http.post('/verifyadduser', {name: $scope.toname, email: $scope.toemail, rollno: $scope.torollno2 , password:$scope.topassword2})
        .then(function(response) {
              $scope.message11=true;
              $scope.message = response.data.message;
        })
        .catch(function(error) {
          console.error('Error:', error);
        });

       }
       else{
        $scope.message11=true;
        $scope.message = "Invalid rollno";
       }


    };
  }]);


