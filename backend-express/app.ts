import { NextFunction } from "express";
import { User } from "./model";
import BookTypeRouter from "./routes/bookTypes";
import BookInstanceRouter from "./routes/bookInstances"
import LoginRouter from "./routes/login"

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

const req = require('express/lib/request');
require('./model/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: "abc123",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 24 * 1000 }, // 一天过期
  })
);


app.use('/api/bookTypes',BookTypeRouter);
app.use('/api/bookInstances',BookInstanceRouter)
app.use('/api/login', LoginRouter)

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});



app.listen('3005', ()=>{
  console.log('server start 3005');
})

module.exports = app;
