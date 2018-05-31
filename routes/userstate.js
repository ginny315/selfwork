"use strict";
var express = require('express'),
    router = express.Router();

router.get('/api/usercome',function(req,res){
  if(req.session.useremail == undefined){
    res.status(200);
    res.send({
      'code':0
    })
  }else{
    res.status(200);
    res.send({
      'code':2,
      'username':req.session.username
    })
  }
});

router.get('/api/userleave',function(req,res){
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
      } else {
          res.status(200).send({
              code: 1
          });
      }
  });
});

module.exports = router;