"use strict";
var express = require('express'),
    router = express.Router(),
    Work = require('../db/work');

router.get('/', function(req, res) {
  var works = Work.getWorksList(function(err,works){     
    if(err) console.error(err);
    else{
      res.json(works);
    }
  });      
});

router.post('/',function(req,res){
  var searchcontent = req.body.searchcontent;
  if(searchcontent == ''){
    Work.getWorksList(function(err,works){     
      if(err) console.error(err);
      else res.json(works);
    });
  }else{
    Work.getWorks(searchcontent,function(err,works){
      if(err) console.error(err);
      else res.json(works);
    });
  }
});

router.post('/addHotRate',function(req,res){
  var workid = req.body.workid || '';
  console.log('req.body.hotrate='+req.body.hotrate);
  var hotrate = (+(req.body.hotrate || ''))+1;
  Work.addHotRate(workid,hotrate,function(err,msg){
    if(err) console.log(err);
    else{
      res.status(200);
      res.send({
        'code':1,
      })
    }
  })
  
});

module.exports = router;