require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database...');
});

// Routes
app.post('/display', (req, res) => {
  var rollno = req.cookies('rollno');

  console.log("hi");
  
  connection.query(query, [rollno], (err, result,fields) => {
    if (err) {
      console.error('Error verifying user:', err);
      res.status(500).send({ success: false, message: 'Error verifying user.' });
      return;
    }
    else{
        result.forEach((row) => {
            console.log({success:true , rollno:rollno, name:row.Name , email:row.Email});
            res.status(200).send({success:true , rollno:rollno, name:row.Name , email:row.Email});
            
        });
    }
  });
});
app.listen(process.env.PORT2 , ()=>{
  console.log("server2 has started....")
})
