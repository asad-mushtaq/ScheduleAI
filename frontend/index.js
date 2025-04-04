import express from "express";
import "dotenv/config";
import { dirname } from 'path';

var app = express();
app.use(express.static('public'));

const __dirname = process.env.PWD

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/signup', function(req, res){
    res.sendFile(__dirname + '/public/signup.html');
});

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/home', function(req, res){
    res.sendFile(__dirname + '/public/home.html');
});

app.get('/profile', function(req, res){
    res.sendFile(__dirname + '/public/profile.html');
});

app.get('/event-details', function(req, res){
    res.sendFile(__dirname + '/public/event-details.html');
});

app.listen(process.env.FRONTEND_PORT, () => {
    console.log(`Example app on url: http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`)
  })