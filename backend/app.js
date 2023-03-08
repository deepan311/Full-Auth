const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./Router/userRouter");
const bodyParser = require('body-parser');
const dotenv =require('dotenv').config()

// ===========================MIDDLEWARE============================
const allowedOrigins = ['https://deep-full-auth.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

//================ Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
 
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ===========================ROUTER============================
app.use('/',router)


module.exports = app;
