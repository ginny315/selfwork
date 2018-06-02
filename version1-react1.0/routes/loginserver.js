"use strict";
var express = require('express'),
    router = express.Router(),
    User = require('../db/user'),
    fs = require('fs'),
    path = require('path'),
    mail = require('../public/js/mail/mail');

router.get('/', function(req, res) {
  var data = {
    "name": "警察蜀黍",
    "email": "110@110.com",
    "psw": "110"
  }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(data);
});

router.post('/', function(req, res) {
  var isnew = false,
      login = {},
      newlogin = req.body,
      reslogin = {},
      checkuser = newlogin.email;

  login.name = newlogin.name;
  login.email = newlogin.email;
  login.psw = newlogin.psw;
  login.aliveTime = new Date();

  reslogin.name = newlogin.name;
  reslogin.email = newlogin.email;

  mail().send(checkuser);

  /*connect to db,first to check,then save*/
  User.getUserByEmail(checkuser,function(err,userexist){
    if(err) console.error(err);
    else{    
      if(userexist.length != 0){
        res.status(200);
        res.send({
          'code':0
        });
      }else{
        /*save to db*/
        var newuser = new User(login);       
        newuser.save(function(err,newuserEntity){
          if(err) console.error(err);
          else{            
              req.session.username = newuserEntity.name;
              req.session.useremail = newuserEntity.email;
              req.session.userid = newuserEntity._id;  
              res.status('200');
              res.json(reslogin); 
          }
        });          
      }//else      
    }
  })
});

module.exports = router;