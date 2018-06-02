var _cover = null; //组件句柄

var Pic = React.createClass({
	handleImgClick:function(){
		var theme = this.props.theme;
		var photo = this.props.photo;
		var describe = this.props.describe;
		return _cover.handleCoverShow(photo,theme,describe);
	},	
	render:function(){
		var name = this.props.name;
		var theme = this.props.theme;
		var head = 'head/penmanbox_dog.png';
		var photo = this.props.photo;
		return (
			<div className="index_container_picwrap">
				<div className="index_container_pic" onClick={this.handleImgClick}>
					<img src={photo} />
				</div>
				<div className="index_container_word">
					<div className="index_container_author">
						<img src={head}/>
					</div>
					<div className="index_container_describe">
						<div className="index_container_boss">boss:{name}</div>
						<div className="index_container_theme">theme:{theme}</div>
					</div>
				</div>
			</div>
		)
	}
});

var Cover = React.createClass({
	handlecoverclose:function(){
		_cover.handleCoverClose();
	},
	render:function(){
		var data = this.props.coverdata;
		var theme = data.theme;
		var describe = data.describe;
		var photo = data.photo;
		var top = data.top;
		var coverclose = data.coverclose;
		var coverStyle;
		if(coverclose){//=1,show
			coverStyle = {
				MozTransform:'translateX(0%)',
				OTransform:'translateX(0%)',
				WebkitTransform:'translateX(0%)',
				transform:'translateX(0%)',
				top:top
			}
		}else{//=0,hidden
			coverStyle = {
				MozTransform:'translateX(200%)',
				OTransform:'translateX(200%)',
				WebkitTransform:'translateX(200%)',
				transform:'translateX(200%)',
				top:top
			}
		}
		return (
			<div className="index_cover" style={coverStyle}>
				<div className="index_cover_pic">
					<img src ={photo}/>
				</div>
				<div className="index_cover_word">
					<div className="index_cover_theme">theme:{theme}</div>
					<div className="index_cover_describe">describe:{describe}</div>
				</div>					
				<div className="index_close" onClick={this.handlecoverclose}>x</div>
			</div>
		)
	}
});

var Hot = React.createClass({
	render:function(){
		var hotrate = this.props.area;
		var data = 'data'+hotrate;
		var Pics = this.props.data.map(function(value,index){
			return (
				<Pic key={index} name={value.authorname} theme={value.theme} describe={value.describe} head={value.head} photo={value.photo}/>
			);
		});
		return (
			<div className="index_container_hot">
			<div className="index_container_line"></div>
			<div className={hotrate != 1 ? "index_container_hot_r" : ""}></div>
			<div className={hotrate == 3 ? "index_container_hot_r1" : ""}></div>
			{Pics}
			</div>
		)
	}
});

var HotContainer = React.createClass({
	handleCoverClose:function(){//浮层隐藏
		this.setState({
			coverdata:{
				'coverclose':0,
			}
		});
	},
	handleCoverShow:function(photo,theme,describe){//浮层显示
		var scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
		this.setState({
			coverdata:{
				'coverclose':1,
				'theme':theme,
				'describe':describe,
				'photo':photo,
				'top':scrollTop
			}
		});
	},
	loadFormFromServer:function(){
		$.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache:false,
	      success: function(data) {
	      	//alert(window.localStorage.username+'www');
	        this.setState({data:
	        	{
	        	data1:data.data1,
	        	data2:data.data2,
	        	data3:data.data3
	        	}
	        });
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},
	getInitialState:function(){
		_cover = this;
		return {data:{data1:[],data2:[],data3:[]},coverdata:{}}
	},
	componentDidMount: function() {
    	this.loadFormFromServer();
  	},
	render:function(){
		return(
			<div>
			<Cover coverdata={this.state.coverdata}/>
				<Hot data={this.state.data.data1} area={1}/>
				<Hot data={this.state.data.data2} area={2}/>
				<Hot data={this.state.data.data3} area={3}/>
			</div>
		)
	}
})

ReactDOM.render(
	<HotContainer url="/api/index"/>,
	document.getElementById('index_hot')
)