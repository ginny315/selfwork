var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())),
	downEventName = device ? 'touchstart' : 'mousedown',
	moveEventName = device ? 'touchmove' : 'mousemove',
	upEventName = device ? 'touchend' : 'mouseup',
	clickEventName = 'click',
	paddingTop = 60;

$(document).ready(function(){
	//FastClick.attach(document.body);
	//alert(device);
	var $op_page1 = $('#op_page1'),
		$op_page2 = $('#op_page2'),
		$cr_choose = $('#cr_choose'),
		$cr_id = $('#cr_id'),
		$openCanvas = $('#openCanvas');

	$op_page1.on(clickEventName,function(e){
		if(e.target.id == 'createPaint'){
			creatroom();
		}else{
			$cr_choose.hide();
			$cr_id.show();
		} 
	});

	$openCanvas.on(clickEventName,function(e){
		var paintId = $('#paintId').val();
		joinroom(paintId);
	})
});

var opt = getParamValue('opt');
	//roomList = {};

$(document).ready(function(){
	var	$op_page1 = $('#op_page1'),
		$op_page2 = $('#op_page2'),
		mycanvas = document.getElementById('mycanvas'),
		context = mycanvas.getContext('2d'),
		brush = {},	canvasInit = {},
		$mycanvas = $('#mycanvas'),
		$palette = $('#palette'),
		$brushwidth = $('#brushwidth')
		$color = $('#color'),
		$colorpicker = $('#colorpicker'),
		$tool = $('#tool'),
		$tool2 = $('#tool2'),
		$sendMsg = $('#sendMsg');
		paintNow = false,//flag
		point = {},	
		curColor = '#000',
		curSize = 5,
		curTool = '画笔';

		brush = {
			clickX:[],
			clickY:[],
			clickDrag:[],//boolean(if brush drag is true)
			clickColor:[],
			clickSize:[]
		}

		if(device){
			canvasInit = {
				width:$(window).width(),
				height:$(window).width()*(2/3)
			};
			paddingTop = 100;
		}else{
			canvasInit = {
				width:600,
				height:400
			}
		}
		

		point.notFirst = false;

		mycanvas.setAttribute('width',canvasInit.width);
		mycanvas.setAttribute('height',canvasInit.height);


	if(opt) {
        $op_page1.hide();
        $op_page2.show();
        $('#onlineRoomId').text('room:'+opt);
        socket = io.connect('http://localhost:4000');

        socket.emit('createRoom', {room: opt,username:window.localStorage.username});

        socket.on('connect', function() {
            say('[旁友你要玩的开心哦～]');
      //       $('header').on(clickEventName,function(e){
		    // 	e.preventDefault();
		    // 	if(socket && confirm('你确定要离开房间嘛？你的作品会被删除哦！')){
		    // 		socket.emit('disconnect');
		    // 	}
		    // 	window.close();
    		// });
        });

        socket.on('userIn', function(data) {
        	var tmpname;
            if (data) {
                if (data.user)
                    tmpname = data.user.cname;
                else
                	tmpname = '一个围观的人';
                say('(' + tmpname + ') [进入]');
                if(!device){
                	showlist(data.room);
                }
          	}
        });

   //      socket.on('userOut', function(data) {
   //      	alert('lea')
   //          //var tmpname = $('#' + data.id + ' a').text();
   //          //delete roomList[data.id];
   //          say('(' + data.cname + ') [离开]');
   //          //showlist(roomList);
   //          //window.opener=null ;
			// //window.open("","_self") ;
		 //    window.close();
   //      });

        socket.on('draw', function(data) {
	      	return Draw(context,data.brush,true);
	  	});

        socket.on('say msg', function(data) {
            //var tmpname = $('#' + data.id + ' a').text();
            var tmptou = '说：';        
            say('(' + data.cname+ ')' + tmptou + data.txt)
        });        
    }


	//if mousedown,recond position now.
	$mycanvas.on(downEventName,function(e){
		//alert('downEvent!!!');
		paintNow = true;
		recondMove(curTool,brush,e.pageX - this.offsetLeft,e.pageY - paddingTop - this.offsetTop);
		Draw(context,brush);
	});

	$mycanvas.on(moveEventName,function(e){
		var mouseX = e.pageX - this.offsetLeft,
			mouseY = e.pageY - paddingTop - this.offsetTop;

		if(paintNow){
			recondMove(curTool,brush,mouseX,mouseY,true);
			Draw(context,brush);
		}
	});

	$mycanvas.on(upEventName,function(){
		paintNow = false;
	});

	$mycanvas.on('mouseleave',function(e){
		paintNow = false;
	});

	//handler choose color
	$palette.on('click',function(e){
		curColor = $(e.target).text();
	});

	$brushwidth.on('click',function(e){
		curSize = $(e.target).text();
		switch(curSize){
			case('特细'):
				curSize = 2;
				break;
			case('细'):
				curSize = 5;
				break;
			case('粗'):
				curSize = 10;
				break;
			case('特粗'):
				curSize = 15;
				break;
			default:
				curSize = 5;
		}
	});

	$tool.on('click',function(e){
		curTool = $(e.target).text();
	});

	$tool2.on('click',function(e){
		if($(e.target).text() == '清空'){
			if(confirm('你确定要清空画板？')){
				cleanCanvas(mycanvas,context,brush);
			}
		}else{
			var img = mycanvas.toDataURL('image/png');
			console.log(img);
			//$('#finish').attr('src',img);
			if(confirm('你确定要上传到你的主页吗？你也可以选择右键图片保存到本地哦。')){
				$.ajax({
			      url: '/onlinepaintserver',
			      dataType: 'json',
			      type: 'POST',
			      data:{'img':img},
			      cache: false,
			      success: function(value){
			      	if(value.code == '1')
		      		alert('upload success!');
		      		setTimeout(function(){
		      			window.location = 'home.html';
	      			},1000);
			      }.bind(this),
			      error: function(xhr, status, err) {
			        console.error(this.props.url, status, err.toString());
			      }.bind(this)
			    });
			}
		}
	});

	$sendMsg.on('click',function(e){
		var txt = $('textarea').val();
		var username = window.localStorage.username;
  		sendsay(txt,username);
	});	

	$('textarea').bind('keyup', function(e) {
        if (e.keyCode == "13") {
            //回车执行查询
            $sendMsg.click();
        }
    });
});

function creatroom() {
    var nowtime = new Date().getTime();
    var $myurl = window.location.origin + window.location.pathname + '?opt=' + nowtime;
    window.location.href = $myurl;
}

function joinroom(id) {
    if (id) {
        var $myurl = window.location.origin + window.location.pathname + '?opt=' + id;
        window.location.href = $myurl;
    } else {
        creatroom();
    }
}

function Draw(context,brush,ifSocket){
	context.lineJoin = "round";
	if(!ifSocket){
		socket.emit('drawClick',{'brush':brush});
	}
	
	while(brush.clickX.length > 0){
		point.bx = point.x;
		point.by = point.y;
		point.x = brush.clickX.pop();
		point.y = brush.clickY.pop();
		point.draw  = brush.clickDrag.pop();
		context.beginPath();
		if(point.draw && point.notFirst)
			context.moveTo(point.bx,point.by);
		else{
			point.notFirst = true;
			context.moveTo(point.x - 1,point.y);
		}
		context.lineTo(point.x,point.y);
		context.closePath();
		context.strokeStyle = brush.clickColor.pop();			
		context.lineWidth = brush.clickSize.pop();
		context.stroke();
	}
}

//recond x,y and dragging
function recondMove(curTool,brush,x,y,dragging){
	brush.clickX.push(x);
	brush.clickY.push(y);
	brush.clickDrag.push(dragging); 
	if(curTool == '橡皮') 
		brush.clickColor.push('#fff');
	else
		brush.clickColor.push(curColor);
	brush.clickSize.push(curSize);
}

function cleanCanvas(canvas,context,brush){
	brush = {
		clickX:[],
		clickY:[],
		clickDrag:[],//boolean(if brush drag is true)
		clickColor:[],
		clickSize:[]
	};
	 context.clearRect(0, 0, canvas.width, canvas.height);
}

function convertImageToCanvas(image) {
	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	canvas.getContext("2d").drawImage(image, 0, 60);
	return canvas;
}

function getParamValue(name) {
    function getUrlParams() {
        var search = window.location.search;
        var tmparray = search.substr(1, search.length).split("&");
        var paramsArray = new Array;
        if (tmparray != null) {
            for (var i = 0; i < tmparray.length; i++) {
                var reg = /[=|^==]/;
                var set1 = tmparray[i].replace(reg, '&');
                var tmpStr2 = set1.split('&');
                var array = new Array;
                array[tmpStr2[0]] = tmpStr2[1];
                paramsArray.push(array)
            }
        }
        return paramsArray
    }
    var paramsArray = getUrlParams();
    if (paramsArray != null) {
        for (var i = 0; i < paramsArray.length; i++) {
            for (var j in paramsArray[i]) {
                if (j == name) {
                    return paramsArray[i][j]
                }
            }
        }
    }
    return null;
}

function showlist(data) {
    var count = 0, htmlstr = '', cname = '';
    $('#userlist').empty();
    $.each(data, function(index, val) {
        console.log(val)
        count += 1;
        if (val.cname) {
            cname = val.cname;
        } else {
            cname = index;
        }
        htmlstr = ' <li id="' + index + '">' +cname+'</li>';
        $('#userlist').append(htmlstr)
    });
    $('#nowinline').html('在线' + count + '人');
}

function say(txt) {
    $('p').text(txt).appendTo($('#msgbox'));
}

function sendsay(txt,username) {
    if (txt) {
    	if(username){
    		//alert('username='+username);
	        socket.emit('say msgs', {'say': txt,'username':username});
	        say('(我):'+ txt);
        }else{
        	socket.emit('say msgs', {'say': txt});
	        say('(我):'+ txt);
        }
    }
}

