var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest:path.join(__dirname, 'public/authorphoto')});
var cookie= require('cookie-parser');
var session = require('express-session');

var mail = require('./public/js/mail/mail');
//var myloadtest = require('./public/js/qa/myloadtest');
var credential = require('./public/js/credential/credential');

var app = express();

var LOGIN_FILE = path.join(__dirname, 'login.json');
var INDEX_FILE = path.join(__dirname, 'index.json');
var PHOTO_PATH = path.join(__dirname,'public/authorphoto');
var HEAD_PATH = path.join(__dirname,'public/head');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());

var mongoconnect = credential().mongo.development.connectionString;
var mongoopts = {
  server:{
    socketOptions:{keepAlive:1}
  }
};
var mongoose = require('mongoose');
mongoose.connect(mongoconnect,mongoopts);

var MongoStore = require('connect-mongo')(session);
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'penmanbox',
    key: 'penmanbox',//cookie name
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}//7 days
}));

var User = require('./db/user');
var Work = require('./db/work');
var db = mongoose.connection;
db.on('error', function(){
    console.log('db open error');
    console.dir(arguments);
});
db.once('open', function () {
    console.log('db open success');
    console.dir(arguments);
});

switch(app.get('env')){
  case 'development':
    app.use(require('morgan')('dev'));
    break;
  case 'production':
    app.use(require('express-logger')({
      path:__dirname + '/log/requests.log'
    }));
    break;
}

/*server for login*/
app.get('/api/login', function(req, res) {
  fs.readFile(LOGIN_FILE, function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/login', function(req, res) {
  var isnew = false;
  var login = {};
  var newlogin = req.body;
  login.name = newlogin.name;
  login.email = newlogin.email;
  login.psw = newlogin.psw;
  login.aliveTime = new Date();

  var reslogin = {};
  reslogin.name = newlogin.name;
  reslogin.email = newlogin.email;

  var checkuser = newlogin.email;

  /*connect to db,first to check,then save*/
  User.getUserByEmail(checkuser,function(err,userexist){
    if(err) console.error(err);
    else{    
      if(userexist.length != 0){//exist
        console.log('userexist='+userexist);
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
              console.log('success save!'+newuserEntity);
              req.session.username = newuserEntity.name;
              req.session.useremail = newuserEntity.email;
              req.session.userid = newuserEntity._id;
              console.dir(req.session);   
              res.status('200');
              res.json(reslogin); 
          }
        });          
      }//else      
    }
  })
});

function Mywork(authorname,id,theme,describe,photo,hotrate){
  this.authorname = authorname;
  this.id = id;
  this.theme = theme;
  this.describe = describe;
  this.photo = photo;
  //this.hotrate = hotrate;
}

/*server for index*/
app.get('/api/index', function(req, res) {
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

/*server for judge the user login state*/
app.get('/api/usercome',function(req,res){
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

app.get('/api/userleave',function(req,res){
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

/*server for theme*/
app.get('/api/theme', function(req, res) {
  var works = Work.getWorksList(function(err,works){      
    if(err) console.error(err);
    else{
      res.json(works);
    }//else
  });      
});

app.post('/api/theme',function(req,res){
  var searchcontent = req.body.searchcontent;
  Work.getWorks(searchcontent,function(err,works){
    if(err) console.error(err);
    else{
      res.json(works);
    }
  })
});

/*server for home*/
app.get('/api/home', function(req, res) {
  var userid = req.session.userid || '';
  if(userid != ''){
    var works = Work.getWorksByUserId(userid,function(err,works){      
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

/*server for register*/
app.post('/api/register',function(req,res){
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
        console.dir(req.session);
        console.log('req.session.userid='+req.session.userid);
        res.status(200);
        res.send({
          'code':2,
          'username':user[0].name
        })
      }
    }
  });
});


/*server for comeon*/
Date.prototype.Format = function(fmt){
  var o = { 
    //"y+" : this.getFullYear(),  
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  console.log('fmt='+fmt);
  return fmt;   
} 

var comeonfile = upload.fields([
  {name:'theme', maxCount: 1000},
  {name:'describe',maxCount:1000},
  {name:'photo',maxCount:10000}]);

app.post('/api/comeon',comeonfile,function(req,res){
  var filename = req.files["photo"][0]["filename"];
  var mimetype = req.files["photo"][0]["mimetype"];
  var imgtype = mimetype.toLowerCase().substring(6);
  var theme = req.body.theme;
  var describe = req.body.describe;
  var date = new Date();
  var userid = req.session.userid || '';
  var username = req.session.username || '';
  date = date.Format('yyyyMMddhhmmss');

  //change type for system
  if(imgtype == 'jpeg') imgtype = 'jpg';

  /*save to db*/
  var savename = theme+date;
  var newwork = new Work({
    'theme':theme,
    'describe':describe,
    'photo':savename + '.'+ imgtype,
    'hotrate':0,
    'userid':userid,
    'username':username
  });
  // newwork.save(function(err,newwork){
  //   if(err){
  //     console.error(err);
  //   }else{
  //     console.log('success work!'+newwork);
  //     // res.status('200');
  //     // res.send({
  //     //   'code' :'1',
  //     //   'newwork':newwork
  //     // });    
  //   }
  // });//newwork.save  
  
  Work.addWork(newwork,function(err){
    if(err) console.error(err);
    else{
      res.status('200');
      res.send({
        'code' :'1',
        'newwork':newwork
      });
    }
  }) 
  
  /*rename img in authorphoto*/
  var authorimg = PHOTO_PATH+'/'+theme+date+'.'+imgtype;
  fs.rename(PHOTO_PATH+'/'+filename,authorimg,function(err){
    if(err){
       console.error(err);  
    }else{
       console.log('renamed complete');
     }
  });
});

app.get('/api/comeon', function(req, res) {
  if(req.session.useremail == undefined || req.session.useremail == ''){
    res.status('200');
    res.send({
      'code':0
    });
    res.end();
  }else{
    res.status('200');
    res.send({
      'code':2
    });
    res.end();
  }
});

app.get('/logoshow',function(req,res){
  fs.readFile('public/img/penmanbox.png','binary',function(error,file){
  if(error){
    res.writeHead(500,{'Content-Type':'text/plain'});
    res.write(error+'\n');
    res.end();
  }else{
    res.writeHead(200,{'Content-Type':'image/png'});
    res.write(file,'binary');
    res.end();
  }
});
})

app.post('/api/deletework',function(req,res){
  var workid = req.body.workid;
  Work.deleteWorkById(workid,function(err){
    if(err) console.error(err);
    else{
      res.status(200);
      res.send({
        'code':1
      })
    }
  });
});

app.post('/api/updatework',function(req,res){
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
})

//500
app.use(function(err,req,res,next){
  var body = '<html style="background-color:#15adbc">'+
  '<head>'+
    '<meta charset="UTF-8">'+
  '</head>'+
  '<body>'+
    '<div style="width:40%;margin-left:30%;">'+
      '<img src="/logoshow" style="width:100%;">'+
    '</div>'+
    '<h1 style="text-align:center;color:#f8ecd4;">Error 500</h1>'+
    '<h2 style="text-align:center;color:#f8ecd4;">Ginny try to save the web! Discourage her!</h2>'+
  '</body>'+
  '</html>';
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(body);
    res.end();
});

//404
app.use(function(req,res){
  var body = '<html style="background-color:#15adbc">'+
  '<head>'+
    '<meta charset="UTF-8">'+
  '</head>'+
  '<body>'+
    '<div style="width:40%;margin-left:30%;">'+
      '<img src="/logoshow" style="width:100%;">'+
    '</div>'+
    '<h1 style="text-align:center;color:#f8ecd4;">Error 404</h1>'+
    '<h2 style="text-align:center;color:#f8ecd4;">Page is not here now!</h2>'+
  '</body>'+
  '</html>';
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(body);
    res.end();
});



app.listen(app.get('port'), function() {
  console.log('Express started in:'+app.get('env')+' Server started: http://localhost:' + app.get('port') + '/');
});
