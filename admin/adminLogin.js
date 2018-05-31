"use strict";
var express = require('express');
var router = express.Router();
var Admin = require('../db/admin');
var User = require('../db/user');

router.get('/',function(req,res){
  console.log('render admin');
  res.render('login');
});

router.post('/login',function(req,res){
  var newadmin = new Admin(req.body);       
  //       newadmin.save(function(err,newadminEntity){
  //         if(err) console.error(err);
  //         else{            
  //             console.log('success save!'+newadminEntity);  
  //             res.redirect('/')
  //         }
  //       });  
  Admin.checkAdmin(newadmin,function(err,admin){   
    console.log('admin---'+admin);     
    if(err) console.error(err);
    else{
      if(admin.length == 0){//not match email and psd        
        res.status(200);
        res.send({
          'code':0
        });
      }else{
        console.log('ddddd');
        req.session.auth = 1;
        res.redirect('/manager');
      }
    }
  });
});

module.exports = router;