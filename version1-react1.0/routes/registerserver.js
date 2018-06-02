"use strict";
var express = require('express'),
    router = express.Router(),
    User = require('../db/user');

router.post('/api/register',function(req,res){
  var usernow = req.body;
  User.checkUser(usernow,function(err,user){        
    console.log('user='+user);
    if(err) console.error(err);
    else{
      if(user.length == 0){//not match email and psd        
        res.status(200);
        res.send({
          'code':0
        });
      }else{
        req.session.username = user[0].name;
        req.session.useremail = user[0].email;
        req.session.userid = user[0].id;
        console.log('req.session.userid='+req.session.userid);
        res.status(200);
        res.send({
          'code':2,
          'username':user[0].name
        });
      }
    }
  });
});

module.exports = router;