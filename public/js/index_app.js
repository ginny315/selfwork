var flag = 0;
$('document').ready(function(){
	var footer = $('footer');
	var choose_li = $('.index_choose li');
	var time = setInterval(turn,5000);

	for(var i=0 ; i<4 ;i++){		
		$(choose_li[i]).on('mouseenter',function(){
			turn(this.innerHTML);
			clearInterval(time);
		});
		$(choose_li[i]).on('mouseout',function(){
			time = setInterval(turn,5000);
		});
	}
});


function turn(value){
	var p_ul = $('#turnPic ul');
	var choose_ul = $('.index_choose ul');
	var choose_li = $('.index_choose li');

	var	translate = 0;

	if (value == null){
		$(choose_li[flag]).css('height','0px');
		if(flag == 3){
			flag = 0;
			for(var i=0 ; i<4 ;i++){
				$(choose_li[i]).css('height','40px');
			}
		}
		else
			translate = -25*(++flag);
			$(choose_li[flag]).css('height','0px');
	}else{
		flag = parseInt(value)-1;
		translate = -25*(--value);
	}
	p_ul.css({'transition':'transform 1s','transform':'translate3d(' + translate+'%,0,0)'});
}

