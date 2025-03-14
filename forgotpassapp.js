var app = angular.module('otpApp', []);
app.controller('otpController',['$scope','$http','$window', function ($scope, $http,$window) {
    $scope.otp = ['', '', '', ''];
    $scope.email = '';
    $scope.success = false;
    $scope.verification = false;
    $scope.error = false;
    $scope.errorMessage = '';
    $scope.newpassword=false;

    var regex = new RegExp('[a-zA-Z0-9]+@[a-z]+\.[a-z]{2,3}');

    $scope.verifyOTP = function() {

        $http.post('/verify', {
        email: $scope.email,
        otp: $scope.otp
    })
    .then(function (response) {
        if (response.status === 200) {
            $scope.verification = false;
            $scope.success = true;
            $scope.error = false;
            $scope.newpassword = true
        }
    })
    .catch(function (error) {
        console.error("Error:");
        $scope.error = true;
        $scope.errorMessage = "Invalid OTP";
        $scope.success = false;
    });
}

    

    $scope.sendOTP = function () {
        if (regex.test($scope.email)) {
            $http.post('/sendotp', {
                    email: $scope.email
                })
                .then(function (response) {
                    if (response.status == 200) {
                        $scope.verification=true;
                        $scope.emailpartial = "***" + $scope.email.slice(3);
                        $scope.success = false;
                    } else {
                        $scope.error = true;
                        $scope.errorMessage = "Email does not exist";
                    }
                });
        } else {
            $scope.error = true;
            $scope.errorMessage = "Invalid Email";
        }
    }

    $scope.verifyPassword = function() {
        if ($scope.password === $scope.confirmPassword) {
            $http.post('/updatepassword', { password: $scope.password })
                .then(function(response) {
                    if (response.data.success) {
                        $scope.verificationMessage = "Password verified successfully!";
                        $window.location.href = './index.html';
                    } else {
                        $scope.verificationMessage = "Password verification failed!\n unknown email try signing up";
                    }
                })
                .catch(function(error) {
                    console.error("Error:", error);
                });
        } else {
            $scope.verificationMessage = "Passwords do not match!";
        }
    };
}]);
