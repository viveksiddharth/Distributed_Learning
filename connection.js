const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');


const app = express()
require('dotenv').config();

app.use(bodyParser.json());

var connection = mysql.createConnection({
     port: process.env.DB_PORT,
     host: process.env.DB_HOST,
     user: process.env.DB_USERNAME,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME
});


connection.connect((err)=>{
    if (!err){
        console.log("connected");
    }
    else{
        console.log(err);
    }
})

module.exports = connection;

app.post('/verifyUser' , (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    query = `SELECT * from logindata where Rollno = ? and Password = ?`;
    connection.query(query,[username,password] , (err,result)=>{
        if (err) {
            res.status(500).send({ success: false, message: 'Error verifying user.' });
          } else if (result.length > 0) {
            res.status(200).send({ success: true, message: 'User verified successfully.' });
          } else {
            res.status(404).send({ success: false, message: 'User not found.' });
          }
    })
});

app.post('/verifyadduser' , (req,res)=>{
    const name = req.body.name;
    const password = req.body.password;
    const rollno = req.body.rollno;
    const email = req.body.email;
    query = `SELECT * from logindata where Rollno = ?`;
    connection.query(query,[rollno] , (err,result)=>{
        if (err) {
            res.status(500).send({ success: false, message: 'Error verifying user.' });
          } else if (result.length > 0) {
            res.status(200).send({ success: false, message: 'User already Exists.Try forgot password' });
          } else {
            query = `INSERT INTO logindata(Name, RollNo, Email, Password) VALUES (?, ?, ?, ?)`
            connection.query(query,[name,rollno,email,password] , (err,result)=>{
                if(err){
                    res.status(500).send({ success: false, message: 'Error adding user.' });
                }
                else{
                    res.status(404).send({ success: true, message: 'Succesfully account has been created. Please proceed to login' });
                }
            })
          }
    })
});


