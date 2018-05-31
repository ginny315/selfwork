"use strict";
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser');

router.get('/', function(req, res) {
  if(req.session.useremail == undefined || req.session.useremail == ''){
    res.status('200');
    res.send({
      'code':0
    });
  }else{
    res.status('200');
    res.send({
      'code':2
    })
  }
});

module.exports = router;