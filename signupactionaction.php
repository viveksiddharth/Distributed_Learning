<?php
    if (isset($_POST["toregister"])) {
        if (!empty($_POST['toname']) && !empty($_POST['torollno2']) && !empty($_POST['toemail']) && !empty($_POST['topassword2'])) {
            $RollNo = $_POST['torollno2'];
			$name = $_POST['toname'];
            $email = $_POST['toemail'];
            $pass = $_POST['topassword2'];


            $conn = new mysqli('localhost', 'root', 'nitpy@25', 'logindetails');

            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }
            
            $query = $conn->prepare("SELECT * FROM logindata WHERE RollNo = ?");
            $query->bind_param("s", $RollNo);
            $query->execute();
            $query->store_result();
            
            if ($query->num_rows == 0) {
                $query->close();
                $stmt = $conn->prepare("INSERT INTO logindata(Name, RollNo, Email, Password) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("ssss", $name, $RollNo, $email, $pass);
                
                if ($stmt->execute()) {
                    header("Location: index.html");
                } else {
                    echo "Something went wrong";
                }

                $stmt->close();
            } else {
                echo "That account with RollNo already exists! ";
            }

            $conn->close();
        } else {
            echo "Enter all the fields";
        }
    }
?>
