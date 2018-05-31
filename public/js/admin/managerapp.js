$(document).ready(function(){
	var workall = $('#worktable');
	var workcnt = $('tr').length-1;//数据总条数
	var index = 1;//当前页数
	var pre = $('.page_pre');
	var aft = $('.page_aft');
	console.log(workcnt);
	workall.on('click',function(e){
		var targetnode = e.target;
		var workid = $($(targetnode)[0]).attr('data-id');
		$.ajax({
			url: '/manager/delwork',
		      dataType: 'json',
		      type: 'POST',
		      data:{'workid':workid},
		      success: function(data) {
		      	if(data.code == 1){
		      		alert('delete success!');
		      		location.reload();
		      	}
		      }.bind(this),
		});
	});

	var pagelist = $('.pagelist');
	var licnt = Math.ceil(workcnt/10);
	for(var i=1 ; i<=licnt ; i++){
		if(i == 1){
			$('<li></li>').addClass('btn btn-primary btn-xs').text(i).appendTo(pagelist);
		}else{
			$('<li></li>').addClass('btn btn-default btn-xs').text(i).appendTo(pagelist);
		}
	}

	var li = $('li');
	li.on('click',function(){
		var thisindex = $(this).text();
		index = thisindex;
		li.removeClass().addClass('btn btn-default btn-xs');
		$(this).removeClass().addClass('btn btn-primary btn-xs');
		ini(thisindex);
	});

	pre.on('click',function(){
		if(index == 1){
			return false;
		}else{
			index--;
			li.removeClass().addClass('btn btn-default btn-xs');
			$(li[index-1]).removeClass().addClass('btn btn-primary btn-xs');
			//console.log('preindex='+index);
			ini(index);
			return index ;
		}
	});

	aft.on('click',function(){
		if(index == licnt){
			return false;
		}else{
			index++;
			li.removeClass().addClass('btn btn-default btn-xs');
			$(li[index-1]).removeClass().addClass('btn btn-primary btn-xs');
			//console.log('aftindex='+index);
			ini(index);
			return index;
		}
	})

	function ini(iniNum){
		var iniNum = iniNum-1;
		$($('tr')).hide();
		//console.log($('tr')[1]);
		for(var i=0 ; i<workcnt ; i++){
			for(var k=0 ; k<10 ; k++){
				$($('tr')[i*10+k]).hide();
			}
		}
		for(var j=1 ; j<=10 ; j++){			
			$($('tr')[(iniNum*10)+j]).show();
		}
	}

	ini(1);

});