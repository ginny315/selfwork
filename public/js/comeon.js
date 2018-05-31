// render hat
var ComeonHat = React.createClass({
	render:function(){
		return (
			<div className="comeon_hat">
				<div className="comeon_hat_roundup"></div>
				<div className="comeon_hat_rect"></div>
				<div className="comeon_hat_rectdown"></div>
				<div className="comeon_hat_rounddown"></div>
			</div>
		)
	}
});

// render glass
var ComeonGlass = React.createClass({
	render:function(){
		return(
			<div className="comeon_glass">
				<div className="comeon_glass_left"></div>
				<div className="comeon_glass_right"></div>
				<div className="comeon_glass_midrect"></div>
			</div>
		)
	}
});

//submit form
var ComeonNoteForm = React.createClass({
	handleSubmit:function(e){
		e.preventDefault();
		
	 	var fd = new FormData();
		var photo = $("#file_pic")[0].files[0];
		var theme = this.refs.theme.value.trim();
		var describe = this.refs.describe.value.trim();

		fd.append('theme',theme);
		fd.append('describe',describe);
		fd.append('photo',photo);

		$.ajax({
		  url: '/upload',
		  type: "POST",
		  data: fd,
		  processData: false,  // 告诉jQuery不要去处理发送的数据
		  contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
		  success: function(value) {
	      	if(value.code == '1')
	      		alert('upload success!');
	      		setTimeout(function(){
	      			window.location = 'home.html';
	      		},1000);
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error('/upload', status, err.toString());
	      }.bind(this)
		}); 
	},
	render:function(){
		return (
			<form encType="multipart/form-data" id="comeonform" name="comeonform" onSubmit={this.handleSubmit}>
				<div className="comeon_note_theme">theme:</div>
				<input type='text' className="comeon_note_themeinput" ref="theme"/>
				<div className="comeon_note_describe">describe:</div>
				<textarea className="comeon_note_describeinput" ref="describe">
				</textarea>
				<div className="comeon_note_pic">uploadpicture:</div>
				
				<input id='file_pic' type="file" accept="image/*" ref="photo"/>
				<button type='submit' className="comeon_note_submit">ok!</button>
			</form>
		)
	}
});

var ComeonNotePicShow = React.createClass({
	render:function(){
		return(
			<div className="comeon_pic_show" ><img src='head/penmanbox_dog.png'/></div>
		)
	}
})

var ComeonContainer = React.createClass({
	loadFormFromServer: function() {
	    $.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache: false,
	      success: function(data){
	        if(data.code == 0){
	        	alert('你还没登录或注册！');
	        	setTimeout(function(){
	        		window.location = 'login.html';
	        	},1000);
	        }
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	  },
	getInitialState: function() {
    	return {data:[{'theme':'theme','describe':'describe','photo':'authorphoto/38c390e36357609069b8de98e15dcc66'}]};
  	},
  	componentDidMount: function() {
    	this.loadFormFromServer();
  	},
	render:function(){
		return (			
			<div className="comeon_container">
			<ComeonHat />
			<ComeonGlass />
				<div className="comeon_note">
					<ComeonNoteForm onComeonFormSubmit={this.handleComeonFromSubmit}/>
					<ComeonNotePicShow  data={this.state.data}/>					
				</div>
			</div>
		)
	}
});


ReactDOM.render(
	<ComeonContainer url='/api/comeon'/>,
	document.getElementById('container')
)