require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const cookieparser = require('cookie-parser');

app.use(cookieparser());
app.use(cors('*'));
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

app.post('/verifyUser', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = `SELECT * FROM logindata WHERE Rollno = ? AND Password = ?`;
  
  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error verifying user:', err);
      res.status(500).send({ success: false, message: 'Error verifying user.' });
      return;
    }
    if (result.length > 0) {
      res.cookie('rollno',username);
      res.status(200).send({ success: true, message: 'User verified successfully.' });

    } else {
      res.status(200).send({ success: false, message: 'Incorrect Credentials! Plesae try Signing Up'  });
    }
  });
});

app.post('/verifyadduser', (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const rollno = req.body.rollno;
  const email = req.body.email;
  
  const query = `SELECT * FROM logindata WHERE Rollno = ?`;
  
  connection.query(query, [rollno], (err, result) => {
    if (err) {
      console.error('Error verifying user:', err);
      res.status(200).send({ success: false, message: 'Error verifying user.' });
      return;
    }
    if (result.length > 0) {
      res.status(200).send({ success: false, message: 'User already exists. Try Forgot password.' });
    } else {
      const insertQuery = `INSERT INTO logindata (Name, RollNo, Email, Password) VALUES (?, ?, ?, ?)`;
      connection.query(insertQuery, [name, rollno, email, password], (err, result) => {
        if (err) {
          console.error('Error adding user:', err);
          res.status(200).send({ success: false, message: 'Error adding user.' });
          return;
        }
       else{
        let query = 'Insert into users (roll_no) values (?)';
        connection.query(query,[rollno],(err,result)=>{
          if(err){
            console.log("something went wrong");
            res.status(500).send({success:false})
          }
          else{
            res.status(200).send({ success: true, message: 'User added successfully. Head over to Sign in' });
          }
        })
       }
      });
    }
  });
});

var nm = require('nodemailer');
let savedOTPS = { };
var transporter = nm.createTransport(
    {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'viveksiddharth7842@gmail.com',
            pass: 'fzlq alhf jbln axqi'
        }
    }
);
app.post('/sendotp', (req, res) => {
    let email = req.body.email;
    let digits = '0123456789';
    let limit = 4;
    let otp = ''
    for (i = 0; i < limit; i++) {
        otp += digits[Math.floor(Math.random() * 10)];

    }
    var options = {
        from: 'viveksiddharth7842@gmail.com',
        to: `${email}`,
        subject: "Testing node emails",
        html: `<p>Enter the otp: ${otp} to verify your email address</p>`

    };
    transporter.sendMail(
        options, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send("couldn't send")
            }
            else {
              console.log("email sent")
                savedOTPS[email] = otp;
                console.log(savedOTPS[email])
                setTimeout(
                    () => {
                        delete savedOTPS.email
                    }, 60000
                )
                res.send("sent otp")
            }

        }
    )
})

app.post('/verify', (req, res) => {
  console.log("came here" , req.body.email,req.body.otp, savedOTPS[req.body.email])
    let otprecived = req.body.otp;
    let email = req.body.email;
    if (savedOTPS[email] == otprecived) {
        res.cookie('email1',email)
        res.send("Verfied");
    }
    else {
        res.status(404).send("Invalid OTP")
    }
})

app.post('/updatepassword' , (req,res)=>{
  console.log("password updating");

  let email = req.cookies.email1;
  let newpass = req.body.password;
  console.log(email);
  query = `update logindata set Password = ? where Email = ?`;
  connection.query(query,[newpass,email],(err,result)=>{
    if(err){
      res.status(500).send({success:false});
    }
    else{
    res.status(200).send({success:true})
    }
  })

})

app.post('/display', (req, res) => {
  let user = req.cookies.rollno;
  let query1 = `SELECT * FROM logindata WHERE rollno = ?`;
  connection.query(query1, [user], (err1, result1) => {
      if (err1) {
          console.error("error1", err1);
          return res.status(500).send({ success: false, message: "Error retrieving user data" });
      }
      if (result1.length === 0) {
          return res.status(404).send({ success: false, message: "User not found" });
      }

      let rollno = user;
      let name = result1[0].Name;
      let email = result1[0].Email;

      let query2 = 'SELECT * FROM users WHERE roll_no = ?';
      connection.query(query2, [rollno], (err2, result2) => {
          if (err2) {
              console.error("error2", err2);
              return res.status(500).send({ success: false, message: "Error retrieving user data" });
          }
          if (result2.length === 0) {
              return res.status(404).send({ success: false, message: "User not found" });
          }

          let user_id = result2[0].user_id;

          let query3 = `SELECT * FROM questions WHERE userposted = ?`;
           connection.query(query3, [rollno], (err3, result3) => {
              if (err3) {
                  console.error("error3", err3);
                  return res.status(500).send({ success: false, message: "Error retrieving questions data" });
              }

              let queslen = result3.length;

              let query4 = `SELECT * FROM answers WHERE userpostedans = ?`;
              connection.query(query4, [rollno], (err4, result4) => {
                  if (err4) {
                      console.error("error4", err4);
                      return res.status(500).send({ success: false, message: "Error retrieving answers data" });
                  }

                  let anslen = result4.length;
                  let likeslen = 0;
                  async function getLikesLength() {
                      for (let i = 0; i < result4.length; i++) {
                          let row = result4[i];
                          let query5 = `SELECT * FROM likedanswers WHERE answer_id = ?`;
                          try {
                              const likedAnswers = await queryPromise(connection, query5, [row.answer_id]);
                              likeslen += likedAnswers.length;
                          } catch (err) {
                              console.error("error5", err);
                              return res.status(500).send({ success: false, message: "Error retrieving liked answers data" });
                          }
                      }
                      console.log(rollno, name, queslen, likeslen, anslen);
                      res.status(200).send({ success:true,rollno: rollno, name: name, email: email, queslen: queslen, likeslen: likeslen, anslen: anslen });
                  }
                  getLikesLength();
              });
          });
      });
  });
});

app.post('/topic',(req,res)=>{
  var topicname = req.body.topic1;
  res.cookie('topicname1' , topicname);
  res.status(200).send({success:true});
  console.log("came here")
  
})

app.post('/display2', (req, res) => {
  let topicname1 = req.cookies.topicname1;
  const query = `SELECT topic_id, description FROM topics WHERE topic_name = ?`;

  connection.query(query, [topicname1], (err, result) => {
    if (err) {
      console.error('Error qq', err);
      res.status(500).send({ success: false, message: 'Error qq' });
      return;
    }

    result.forEach((row) => {
      const des = row.description;
      const queryQuestions = `SELECT * FROM questions WHERE topic_id = ?`;

      connection.query(queryQuestions, [row.topic_id], (err, questionsResult) => {
        if (err) {
          console.error('Error qq1', err);
          res.status(500).send({ success: false, message: 'Error qq1' });
          return;
        }

        const resultsArray = [];

        questionsResult.forEach((row) => {
          const qid = row.question_id;
          const queryAnswers = `SELECT * FROM answers WHERE question_id = ?`;

          connection.query(queryAnswers, [qid], (err, answersResult) => {
            if (err) {
              console.error('Error fetching answers', err);
              res.status(500).send({ success: false, message: 'Error fetching answers' });
              return;
            }

            const anslen = answersResult.length;

            resultsArray.push({
              qid: qid,
              question: row.question_text,
              answers: anslen,
              user: row.userposted
            });

            if (resultsArray.length === questionsResult.length) {
              res.status(200).send({ status: true, questions: resultsArray, topic: topicname1, description: des });
            }
          });
        });
      });
    });
  });
});

app.post('/addnewquestion' , (req,res)=>{
  let topicname = req.cookies.topicname1;
  let user = req.cookies.rollno;

  let query = 'select * from topics where topic_name = ?';
  connection.query(query,[topicname],(err,result)=>{
    if(err){
      console.log("error",err);
      res.status(500).send({success:false});
    }
    else{
      let topic_id = result[0].topic_id;

      let query = `insert into questions (topic_id,question_text,userposted) values (?,?,?)`;

      connection.query(query,[topic_id,req.body.question,user],(err,result)=>{
        if(err){
          console.log("error");
          res.status(500).send({success:true});
        }
        else{
          res.status(200).send({success:true});
        }
      })
    }
  })
})

app.post('/addnewanswer' , (req,res)=>{
  let qid = req.cookies.qid;
  let user = req.cookies.rollno;

  let query = 'select * from questions where question_id = ?';
  connection.query(query,[qid],(err,result)=>{
    if(err){
      console.log("error",err);
      res.status(500).send({success:false});
    }
    else{
      let qid = result[0].question_id;

      let query = `insert into answers (question_id,answer_text,userpostedans) values (?,?,?)`;

      connection.query(query,[qid,req.body.answer,user],(err,result)=>{
        if(err){
          console.log("error");
          res.status(500).send({success:true});
        }
        else{
          res.status(200).send({success:true});
        }
      })
    }
  })
})


app.post('/saveques' , (req,res)=>{
  const qid = req.body.qid;
  res.cookie('qid',qid);
  res.status(200).send({status:true});
})

app.post('/display3' , (req,res)=>{
  const qid1 = req.cookies.qid;
  const query = `select * from answers where question_id = ?`;
  connection.query(query,[qid1],(err,result)=>{

    if (err) {
      console.error('Error aa1', err);
      res.status(500).send({ success: false, message: 'Error aa1' });
      return;
    }
    else{
      console.log("came here to display answers")
      const resultsarray = [];

      for (let i =0; i<result.length ; i++){
        row = result[i];

        aid = row.answer_id;

        let query = `select * from likedanswers where answer_id = ?`;
        likeslen = 0;
        connection.query(query , [aid] , (err,results)=>{
          if (err)
          {
            console.log("error");
            res.status(500).send({success:false});
          }
          else{
            likeslen = results.length;
          }
        });

        resultsarray.push(
          {
            aid:aid,
            answer : row.answer_text,
            likes:likeslen,
            user:row.userpostedans
          }
        );

      }
      var questiondisplay ="" 
      connection.query(`select * from  questions where question_id = ?` , [qid1] , (err,result)=>{
        if(err){
          console.log(500);
          res.status(500).send({success:false});
        }
        else{
          questiondisplay = result[0].question_text;
          res.status(200).send({status:true,answers:resultsarray,question:questiondisplay, likes:likeslen});
        }
      })
    }

  })
})

app.post('/addlike',(req,res)=>{
  const aid = req.body.aid;
  user = req.cookies.rollno;

  let query = `select * from users where roll_no =?`;
  connection.query(query,[user],(err,result)=>{
    if (err){
      res.status(500).send({success:false});
    }
    else{
      user = result[0].user_id;
      let query = `select * from likedanswers where answer_id = ?`;
connection.query(query, [aid], (err, result) => {
    if (err) {
        console.log("error1");
        res.status(500).send({ success: false });
    } else {
        let likeslen = result.length;
        console.log(user);

        let query = `insert into likedanswers (user_id,answer_id) values (?,?)`;
        connection.query(query, [user, aid], (err, result) => {
            if (err) {
                console.log("error2", err);
                res.status(500).send({ success: false });
            } else {
              likeslen+=1;
                let query = `select * from disliked where answer_id =?`;
                connection.query(query, [aid], async (err, result) => {
                    if (err) {
                        console.log("error3");
                        res.status(500).send({ success: false });
                    } else {
                        let dislikeslen = result.length;
                        if (result.length > 0) {
                            let query = `delete from disliked where user_id = ? and answer_id = ?`;
                           connection.query(query, [user, aid], (err, result) => {
                                if (err) {
                                    console.log("error4");
                                    res.status(500).send({ success: false });
                                } else {
                                    dislikeslen -= 1;
                                    res.status(200).send({ success: true, likescount: likeslen, dislikescount: dislikeslen });
                                }
                            });
                        }
                        else{
                        console.log("came here")
                        res.status(200).send({ success: true, likescount: likeslen, dislikescount: dislikeslen });
                        }
                    }
                });
            }
        });
    }
});

    }
  })
})


app.post('/adddislike',(req,res)=>{
  const aid = req.body.aid;
  user = req.cookies.rollno;

  let query = `select * from users where roll_no =?`;
  connection.query(query,[user],(err,result)=>{
    if (err){
      res.status(500).send({success:false});
    }
    else{
      user = result[0].user_id;
      let query = `select * from disliked where answer_id = ?`;
connection.query(query, [aid], (err, result) => {
    if (err) {
        console.log("error1");
        res.status(500).send({ success: false });
    } else {
        dislikeslen = result.length;
        console.log(user);

        let query = `insert into disliked (user_id,answer_id) values (?,?)`;
        connection.query(query, [user, aid], (err, result) => {
            if (err) {
                console.log("error2");
                res.status(500).send({ success: false });
            } else {
              dislikeslen+=1;
                let query = `select * from likedanswers where answer_id =?`;
                connection.query(query, [aid], async (err, result) => {
                    if (err) {
                        console.log("error3");
                        res.status(500).send({ success: false });
                    } else {
                        likeslen = result.length;
                        if (result.length > 0) {
                            let query = `delete from likedanswers where user_id = ? and answer_id = ?`;
                            connection.query(query, [user, aid], (err, result) => {
                                if (err) {
                                    console.log("error4");
                                    res.status(500).send({ success: false });
                                } else {
                                    likeslen -= 1;
                                    console.log("camehere")
                                    res.status(200).send({ success: true, likescount: likeslen, dislikescount: dislikeslen });
                                }
                            });
                        }
                        else{
                        console.log("camehere")
                        res.status(200).send({ success: true, likescount: likeslen, dislikescount: dislikeslen });
                        }
                    }
                });
            }
        });
    }
});

    }
  })
})

app.post('/display4' , (req,res)=>{
  const aid = req.body.aid;

  let user = req.cookies.rollno;

  let query = `select * from users where roll_no =?`;
  connection.query(query,[user],(err,result)=>{
    if (err){
      res.status(500).send({success:false});
    }
    else{
      let user = result[0].user_id;
      console.log("user:",user);
      let query = `select * from likedanswers where answer_id = ?`
      let likeslen =0
      connection.query(query,[aid],(err,result)=>{
        if(err){
          res.status(500).send({success:false});
        }
        else{
          likeslen+=result.length;
          let query = `select * from likedanswers where user_id =? and answer_id =?`;
          connection.query(query,[user,aid],(err,results)=>{
            if(err){
              console.log("error here");
              res.status(500).send({success:false});
            }
            else{
              console.log("ans:",aid,results.length);
              if (results.length>0){
                res.status(200).send({success:true,likeslen:likeslen});
              }
              else{
                res.status(200).send({success:false,likeslen:likeslen});
              }
            }
          })

          
        }
      })
    }
  })


})


app.post('/display5' , (req,res)=>{
  const aid = req.body.aid;

  let user = req.cookies.rollno;

  let query = `select * from users where roll_no =?`;
  connection.query(query,[user],(err,result)=>{
    if (err){
      res.status(500).send({success:false});
    }
    else{
      let user = result[0].user_id;

      query = `select * from disliked where answer_id = ?`
      let dislikeslen =0
      connection.query(query,[aid],(err,result)=>{
        if(err){
          res.status(500).send({success:false});
        }
        else{
          dislikeslen+=result.length;
          let query = `select * from disliked where user_id =? and answer_id =?`;
          connection.query(query,[user,aid],(err,results)=>{
            if(err){
              console.log("error here");
              res.status(500).send({success:false});
            }
            else{
              if (results.length>0){
                res.status(200).send({success:true,dislikeslen:dislikeslen});
              }
              else{
                res.status(200).send({success:false,dislikeslen:dislikeslen});
              }
            }
          })

          
        }
      })
    }
  })


})

app.post('/openprofile' , (req,res)=>{
  res.cookie('profileuser' , req.body.user);
  res.status(200).send({success:true});
})

app.post('/inopenprofile', (req, res) => {
  let user = req.cookies.profileuser;
  let query1 = `SELECT * FROM logindata WHERE rollno = ?`;
  connection.query(query1, [user], (err1, result1) => {
      if (err1) {
          console.error("error1", err1);
          return res.status(500).send({ success: false, message: "Error retrieving user data" });
      }
      if (result1.length === 0) {
          return res.status(404).send({ success: false, message: "User not found" });
      }

      let rollno = user;
      let name = result1[0].Name;
      let email = result1[0].Email;

      let query2 = 'SELECT * FROM users WHERE roll_no = ?';
      connection.query(query2, [rollno], (err2, result2) => {
          if (err2) {
              console.error("error2", err2);
              return res.status(500).send({ success: false, message: "Error retrieving user data" });
          }
          if (result2.length === 0) {
              return res.status(404).send({ success: false, message: "User not found" });
          }

          let user_id = result2[0].user_id;

          let query3 = `SELECT * FROM questions WHERE userposted = ?`;
           connection.query(query3, [rollno], (err3, result3) => {
              if (err3) {
                  console.error("error3", err3);
                  return res.status(500).send({ success: false, message: "Error retrieving questions data" });
              }

              let queslen = result3.length;

              let query4 = `SELECT * FROM answers WHERE userpostedans = ?`;
              connection.query(query4, [rollno], (err4, result4) => {
                  if (err4) {
                      console.error("error4", err4);
                      return res.status(500).send({ success: false, message: "Error retrieving answers data" });
                  }

                  let anslen = result4.length;
                  let likeslen = 0;
                  async function getLikesLength() {
                      for (let i = 0; i < result4.length; i++) {
                          let row = result4[i];
                          let query5 = `SELECT * FROM likedanswers WHERE answer_id = ?`;
                          try {
                              const likedAnswers = await queryPromise(connection, query5, [row.answer_id]);
                              likeslen += likedAnswers.length;
                          } catch (err) {
                              console.error("error5", err);
                              return res.status(500).send({ success: false, message: "Error retrieving liked answers data" });
                          }
                      }
                      console.log("2");
                      console.log(rollno, name, queslen, likeslen, anslen);
                      console.log("3");
                      res.status(200).send({ rollno: rollno, name: name, email: email, queslen: queslen, likeslen: likeslen, anslen: anslen });
                      console.log("4");
                  }
                  console.log("first");
                  getLikesLength();
              });
          });
      });
  });
});
function queryPromise(connection, sql, args) {
  return new Promise((resolve, reject) => {
      connection.query(sql, args, (err, rows) => {
          if (err)
              return reject(err);
          resolve(rows);
      });
  });
}



app.post('/display8', (req, res) => {
  console.log("came here")
  
      const queryQuestions = `SELECT * FROM questions order by question_id desc limit 5`;

      connection.query(queryQuestions, [], (err, questionsResult) => {
        if (err) {
          console.error('Error qq1', err);
          res.status(500).send({ success: false, message: 'Error qq1' });
          return;
        }

        const resultsArray = [];

        questionsResult.forEach((row) => {
          const qid = row.question_id;
          const queryAnswers = `SELECT * FROM answers WHERE question_id = ?`;

          connection.query(queryAnswers, [qid], (err, answersResult) => {
            if (err) {
              console.error('Error fetching answers', err);
              res.status(500).send({ success: false, message: 'Error fetching answers' });
              return;
            }

            const anslen = answersResult.length;

            resultsArray.push({
              qid: qid,
              question: row.question_text,
              answers: anslen,
              user: row.userposted
            });

            if (resultsArray.length == questionsResult.length) {
              res.status(200).send({ status: true, questions: resultsArray });
            }
          });
        });
      });
    });


app.listen(process.env.PORT1 , ()=>{
  console.log("server has started....")
})



