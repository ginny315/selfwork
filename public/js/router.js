"use strict";
var express = require('express');
var router = express.Router();

function Mywork(authorname,id,theme,describe,photo,hotrate){
  this.authorname = authorname;
  this.id = id;
  this.theme = theme;
  this.describe = describe;
  this.photo = photo;
  //this.hotrate = hotrate;
}

router.get('/api/index',function(req,res){
	var workOptions = {
    themes:['抽象派','黑白派','印象派']
  }
  var themes = workOptions.themes;
  var arr = new Array(3);
  var indexjson = {'data1':[arr],'data2':[arr],'data3':[arr]};
  var cnt = 0;
  var authorname = null;

  themes.forEach(function(theme,number){
    var works = Work.getWorks(theme,function(err,works){
      if(err) console.error(err);
      else{
        works.forEach(function(value,index){
          var nowdata = 'data'+(number+1);
          var authorname = (value.name ? value.name : '匿名' );
          indexjson[nowdata][index] = new Mywork(authorname,value.id,value.theme,value.describe,'authorphoto/'+value.photo);
        });
      }//else
      cnt++;
      if(cnt == 3){
      res.status(200);
      res.json(indexjson); 
    }    
    });      
  });//themes.forEach
});