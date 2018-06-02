"use strict";
var express = require('express'),
    router = express.Router(),
    Work = require('../db/work'),
    path = require('path'),
    fs = require('fs');

router.get('/', function(req, res) {
  var userid = req.session.userid || '';
  if(userid != ''){
    var works = Work.getWorksByUserId(userid,function(err,works){ 
    console.log('works-----------')
    console.log(works)     
      if(err) console.error(err);
      else{
        res.status(200);
        res.json(works);
      }//else
    }); 
  } else{
    res.status(200);
    res.send({
      'code':0
    })
  }    
});

router.post('/deletework',function(req,res){
  var workid = req.body.workid;
  Work.deleteWorkById(workid,function(err,works){
    var photo = works.photo;
    if(err) console.error(err);
    else{
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

router.post('/updatework',function(req,res){
  var workid = req.body.id;
  var theme = req.body.theme;
  var describe = req.body.describe;
  Work.updateWork(workid,theme,describe,function(err){
    if(err) console.error(err);
    else{
      res.status(200);
      res.send({
        'code':1
      })
    }
  });
});

module.exports = router;