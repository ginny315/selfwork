"use strict";
var express = require('express'),
    router = express.Router(),
    Admin = require('../db/admin'),
    User = require('../db/user'),
    Work = require('../db/work'),
    fs = require('fs'),
    path = require('path'),
    mail = require('../public/js/mail/mail');

function AdminWork(_id,work,author,theme,describe){
  this._id = _id;
  this.work = work;
  this.author = author;
  this.theme = theme;
  this.describe = describe;
}

router.get('/',function(req,res){
  console.log('manager');
  Work.getWorksList(function(err,works){
    if(err) console.error(err);
    else{
      var workjson = works;
      res.render('adminmanager',{workjson:workjson});
    }
  });
});

router.post('/delwork',function(req,res){
  var workid = req.body.workid.replace(/\"/g, "");;

  Work.deleteWorkById(workid,function(err,works){
    var photo = works.photo;
    if(err) console.error(err);
    else{
      console.log('success');
      res.status(200);
      res.send({
        'code':1
      });
    }
    fs.unlink(path.join(__dirname,'../public/authorphoto',photo),function(err){
      if(err) console.error(err);
    });
  });
});

module.exports = router;