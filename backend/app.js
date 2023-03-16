const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./Router/googleSign");
const bodyParser = require('body-parser');
const dotenv =require('dotenv').config()


const session = require('express-session');
const passport =require('passport')
const GoogleStrategy =require('passport-google-oauth20').Strategy

// ===========================MIDDLEWARE============================
const allowedOrigins = ['https://deep-full-auth.vercel.app','http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

//================ Enable CORS for all routes
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
 
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ===========================ROUTER============================
app.use('/',router)


//==================GOOGLE=====================








module.exports = app;
