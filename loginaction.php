<?php
    if (isset($_POST["tologin"])) {
        if ( !empty($_POST['torollno']) && !empty($_POST['topassword'])) { 
            $RollNo = $_POST['torollno'];
            $pass = $_POST['topassword'];

            $conn = new mysqli('localhost', 'root', 'nitpy@25', 'logindetails');

            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            $query = $conn->prepare("SELECT * FROM logindata WHERE RollNo = ? and Password = ?");
            $query->bind_param("ss", $RollNo, $pass);
            $query->execute();
            $query->store_result();
            
            if ($query->num_rows == 0) {
                $query->close();
               echo "Details not found! Try signing up";
            } else {
                echo "Login Successful";
                
                $cookie_name1 = 'RollNo';
                $cookie_value1 = $RollNo;
                setcookie($cookie_name1,$cookie_value1,time()+3600);
                header("Location: homepage.php");
            }

            $conn->close();
        } else {
            echo "Enter all the fields";
        }
    }
?>
