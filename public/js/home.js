var _updatecover = null;

var Pic = React.createClass({
	handleDelete:function(){
		if(confirm('Are you sure to delete?!!')){
			var workid = this.props.workid;
			$.ajax({
		      url: '/api/home/deletework',
		      dataType: 'json',
		      type: 'POST',
		      data:{'workid':workid},
		      success: function(data) {
		      	if(data.code == 1){
		      		window.location.reload();
		      	}
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	    }
	},
	handleUpdate:function(){	
		var workid = this.props.workid;
		return _updatecover.handleCovershow(workid);
	},
	render:function(){
		var name = this.props.name;
		var theme = this.props.theme;
		var head = this.props.head;
		var photo = this.props.tag == '1' ? this.props.photo : 'authorphoto/'+this.props.photo;
		var workid = this.props.workid;
		return (
			<div className="index_container_picwrap">
				<div className="index_container_pic">
					<img src={photo} />
				</div>
				<div className="index_container_word">
					<div className="index_container_describe">
						<div className="index_container_theme">theme:{theme}</div>
						<div className="home_button">
							<div className="home_delete" workid={workid} onClick={this.handleDelete}>删除</div>
							<div className="home_update" workid={workid} onClick={this.handleUpdate}>修改</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

var UpdataShow = React.createClass({
	handleSubmit:function(e){
		e.preventDefault();
		var theme = this.refs.theme.value.trim();
		var describe= this.refs.describe.value.trim();
		var id = this.props.updatecover.workid;
		var form = {
			'theme':theme,
			'describe':describe,
			'id':id
		};
		$.ajax({
	      url: '/api/home/updatework',
	      dataType: 'json',
	      type: 'POST',
	      data:form,
	      success: function(data) {
	      	if(data.code == 1){
	      		window.location.reload();
	      	}
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},
	handleCloseClick: function () {
		_updatecover.handleCoverClose();
	},
	render:function(){
		var coverclose = this.props.updatecover.coverclose;
		var top = this.props.updatecover.top;
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
		return(
			<div className="home_updateshow" style={coverStyle}>
			<form onSubmit={this.handleSubmit}>
				<div className="home_theme">theme:</div>
				<input type='text' className="home_themeinput" ref="theme"/>
				<div className="home_describe">describe:</div>
				<textarea className="home_describeinput" ref="describe">
				</textarea>
				<button type='submit' className="home_submit">ok!</button>
			</form>
			<div className="home_updateclose" onClick={this.handleCloseClick}>x</div>
			</div>
		)
	}
})

var AuthorInfo = React.createClass({
	handleChangeHead:function(){
		alert("功能尚未开启，你还是先当一只狗吧～");
	},
	render:function(){
		var haswork = this.props.haswork;
		if(haswork)
			return (
				<div className="home_anthorinfo">
				<div className="home_head">
					<img src="head/penmanbox_dog.png"/>
				</div>
				<div className="home_changehead" onClick={this.handleChangeHead}>换头</div>
				<div className="index_container_line" ></div>
			</div>
			);
		else
		return(
			<div className="home_anthorinfo">
				<div className="home_nowork">居然一个作品都没有，你也是够了。。。</div>
			</div>
		)
	}
})

var Hot = React.createClass({
	render:function(){
		var haswork = this.props.data.length;
		if(haswork){
			var Pics = this.props.data.map(function(value,index){
				return (
					<Pic key={index} name={value.username} theme={value.theme} head={value.head} photo={value.photo} workid={value._id} describe={value.describe} tag={value.tag}/>
				);
			});
		}
		return (
			<div className="index_container_hot">
			<AuthorInfo haswork={haswork}/>
			{Pics}
			</div>
		)
	}
});

var HotContainer = React.createClass({
	loadFormFromServer:function(){
		$.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache:false,
	      success: function(data) {
	      	if(data.code == 0){
	      		this.setState({
	      			data:[]
	      		})
	      	}else{
		        this.setState({
		        	data:data
		        });
	        }
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},
	handleCovershow:function(workid){
		var workid = workid;
		var scrollTop = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
		this.setState({
			updatecover:{
				workid:workid,
				coverclose:1,
				top:scrollTop,
			}
		});
	},
	handleCoverClose:function(){//浮层隐藏
		this.setState({
			updatecover:{coverclose:0}
		});
	},
	getInitialState:function(){
		_updatecover = this;
		return {data:[],updatecover:{coverclose:0,top:0,left:0}}
	},
	componentDidMount: function() {
    	this.loadFormFromServer();
  	},
	render:function(){
		return(
			<div>
				<UpdataShow updatecover={this.state.updatecover}/>
				<Hot data={this.state.data}/>
			</div>
		)
	}
});

ReactDOM.render(
	<HotContainer url="/api/home"/>,
	document.getElementById('index_hot')
)


