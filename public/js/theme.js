var _cover = null; //组件句柄

var Pic = React.createClass({
	handleImgClick:function(e){
		e.preventDefault();
		var theme = this.props.theme;
		var photo = 'authorphoto/'+this.props.photo;
		var describe = this.props.describe;
		var workid = this.props.workid;
		var hotrate = this.props.hotrate;

		$.ajax({
	      url: '/api/theme/addHotRate',
	      dataType: 'json',
	      type: 'POST',
	      data:{'workid':workid,'hotrate':hotrate},
	      success: function(data) {
	      	if(data.code == 1){
	      		
	      	} 
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });

		return _cover.handleCoverShow(photo,theme,describe);
	},
	render:function(){
		var name = this.props.name;
		var theme = this.props.theme;
		var head = 'head/penmanbox_dog.png';
		var photo = this.props.tag == '1' ? this.props.photo : 'authorphoto/'+this.props.photo;
		return (
			<div className="index_container_picwrap">
				<div className="index_container_pic" onClick={this.handleImgClick}>
					<img src={photo} />
				</div>
				<div className="index_container_word">
					<div className="index_container_author">
						<img src={head} />
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
	handleClose:function(){
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
				<div className="index_close" onClick={this.handleClose}>x</div>
			</div>
		)
	}
});

var Hot = React.createClass({
	render:function(){
		var Pics = this.props.data.map(function(value,index){
			return (
				<Pic key={index} workid={value._id} name={value.username} theme={value.theme} head={value.head} photo={value.photo} describe={value.describe} hotrate={value.hotrate} tag={value.tag}/>
			);
		});
		return (
			
			<div className="index_container_hot">
			<div className="index_container_line"></div>
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
	handlesearch:function(e){
		var searchcontent = this.refs.searchcontent.value.trim();
		$.ajax({
		      url: '/api/theme',
		      dataType: 'json',
		      type: 'POST',
		      data: {'searchcontent':searchcontent},
		      success: function(data) {
		      	this.setState({
		      		data:data
		      	})
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	},
	loadFormFromServer:function(){
		$.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache:false,
	      success: function(data) {
	        this.setState({
	        	data:data
	        });
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},
	getInitialState:function(){
		_cover = this;
		return {data:[],coverdata:{}}
	},
	// componentWillMount: function() {
 //    	this.loadFormFromServer();
 //  	},
  	componentDidMount: function(){
  		this.loadFormFromServer();
  		var dom = this.getDOMNode();
  		var searchinput = $('#searchinput');
  		searchinput.bind('keyup', function(event) {
	        if (event.keyCode == "13") {
	            //回车执行查询
	            $('#search').click();
	        }
	    });
  	},
  	componentWillUnmount:function(){
  		var searchinput = $('#searchinput');
  		searchinput.unbind();
  	},
	render:function(){
		return(
			<div>
			<header>
				<ul className='index_head'>
					<li className='index_head_pen'><a href="index.html">PenManBox</a></li>
					<li className='index_head_theme'><a href="theme.html">theme</a></li>
					<li className='index_head_comeon'><a href="comeon.html">来一发</a></li>
					<li className='index_head_home'><a href="home.html">home</a></li>
					<li className="index_log" id="index_log">
						<div>
							<input type="text" placeholder="theme search" className="theme_search" ref="searchcontent" id="searchinput"/>
							<div className="theme_searchlogo" id="search" onClick={this.handlesearch}>
								<img src="img/iconfont-search.png" />
							</div>
						</div>
					</li>
				</ul>
			</header>
				<div className="index_container">
				<Cover coverdata={this.state.coverdata}/>
				<Hot data={this.state.data}/>
				</div>
			</div>
		)
	}
});

ReactDOM.render(
	<HotContainer url="/api/theme"/>,
	document.getElementById('container')
)