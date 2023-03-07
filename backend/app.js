const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./Router/userRouter");
const bodyParser = require('body-parser');
const dotenv =require('dotenv').config()

// ===========================MIDDLEWARE============================

 
app.use(express.json());
app.use(cors()); 
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ===========================ROUTER============================
app.use('/',router)


module.exports = app;
