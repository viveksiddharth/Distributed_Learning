const express = require('express');
require('dotenv').config();
const server1 = require('./server1');
const server2 = require('./server2');
const app = express();
const path = require('path');
app.use(express.static(__dirname));
app.use('/server1',server1);
app.use('/server2' , server2);

app.listen(process.env.PORT , ()=>{
    console.log("main server has started....")
})