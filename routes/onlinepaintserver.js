"use strict";
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    Work = require('../db/work');

router.post('/', function(req, res) {
  var img = ''+req.body.img;
  //console.log('img==='+img);
  //console.dir(req.body);
  var userid = req.session.userid || '',
      username = req.session.username || '';

  var newwork = new Work({
    'theme':'在线画板作品',
    'describe':'',
    'photo':img,
    'hotrate':0,
    'userid':userid,
    'username':username,
    'tag':'1'
  });
  newwork.save(function(err,newwork){
    console.log('dbsave');
    if(err){
      console.error(err);
    }else{
      res.status(200);
      res.send({
        'code' :'1',
        //'newwork':newwork
      });    
    }
  });
});

module.exports = router;