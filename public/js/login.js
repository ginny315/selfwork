var LoginWriteloginForm = React.createClass({
	handleSubmit:function(e){
		e.preventDefault();
		var name = this.refs.name.value.trim();
		var email = this.refs.email.value.trim();
		var psw = this.refs.psw.value.trim();
		var pswconfirm = this.refs.pswconfirm.value.trim();
		var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        
        if(!myreg.test(email)){
            alert('傻逼啊！邮箱懂不？？？');
            return false;
        }
        
		if(psw != pswconfirm){
			alert('傻逼啊，两次密码不一样都不知道！！！');
			return false;
		}
		this.props.onLoginFormSubmit({name:name,email:email,psw:psw});
		this.refs.name.value = '';
		this.refs.email.value = '';
		this.refs.psw.value = '';
		this.refs.pswconfirm.value = '';		
	},
	render:function(){
		return (
		<form className="login_writelogin_form" onSubmit={this.handleSubmit}>
			<input type='text' name='yourname' className='login_writelogin_name login_inputstyle' placeholder='your name:' ref='name'/>
			<input type='text' name='youremail' className='login_writelogin_email login_inputstyle' placeholder='your e-mail:' ref='email'/>
			<input type='password' name='yourpsw' className='login_writelogin_psw login_inputstyle' placeholder='your password:' ref='psw'/> 
			<input type='password' name='yourpswconfirm' className='login_writelogin_pswconfirm login_inputstyle' placeholder='your password again:' ref='pswconfirm'/>
			<button type='submit'className='login_writelogin_submit'>Touch!</button>
		</form>
		)
	}
});

var LoginAllowloginShow = React.createClass({
	render:function(){
		var name = this.props.name;
		var email = this.props.email;
		return (
			<div className="login_allowlogin_show">通行证
				<div className="login_allowlogin_showname login_allowlogin_showword">昵称：{name}</div>
				<div className="login_allowlogin_showemail login_allowlogin_showword">约么：{email}</div>
				<div className="login_allowlogin_photo">
					<img src="img/head.jpeg" />
				</div>
			</div>
		)
	}
})

// render show info
var LoginAllowLogin= React.createClass({
	render:function(){
		var name = this.props.data.name;
		var email = this.props.data.email;
		return (
			<div className={this.props.data.animateState ? "login_allowloagin animate":"login_allowloagin"} id="login_allowloagin">
				<div className="login_allowlogin_tranigle"></div>
				<div className="login_allowlogin_rectangle"></div>
				<div className="login_allowlogin_roundleft"></div>
				<div className="login_allowlogin_roundright"></div>
				<LoginAllowloginShow name={name} email={email}/>				
			</div>
		)
	}
});

// render sorrow
var LoginSorrow = React.createClass({
	render:function(){
		return (
			<div className={this.props.data?"login_sorrow animate":"login_sorrow"} id="login_sorrow">
				<img src="img/iconfont-zhuanwan 2.png" />
			</div>
		);
	}
});

var LoginContainer = React.createClass({
	/*change the data*/
	loadFormFromServer: function() {
	    $.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache: false,
	      success: function(data) {
	        this.setState({data: data});
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	  },
	/*load the message form server or just from temp json*/
	handleLoginFormSubmit:function(forminfo){
		var form = forminfo;
		var storage = window.localStorage;
		 $.ajax({
		      url: this.props.url,
		      dataType: 'json',
		      type: 'POST',
		      data: form,
		      success: function(value) {
		      	if(value.code == 0){
		      		alert('You are our VIP,please choose login');
		      		window.location = 'index.html';
		      	}
		      	else{
			      	console.log('value.name='+value.name);
			        this.setState({data:{
			        	'name': value.name,
			        	'email':value.email,
			        	'animateState':'true'
			        }});
			        storage.username = value.name;
			        setTimeout(function(){
	        			window.location = 'index.html';
	        		},1000);
		        }
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	},
	getInitialState: function() {
    	return {data: {'name':'1','email':'2','animateState':'false'}};
  	},
  	componentDidMount: function() {
    	this.loadFormFromServer();
  	},
	render:function(){
		return (
			<div>
			<LoginAllowLogin data={this.state.data}/>
			<LoginSorrow data={this.state.data.animateState}/>
			<div className='login_writelogin'>
				<LoginWriteloginForm onLoginFormSubmit={this.handleLoginFormSubmit}/>
			</div>
			</div>
		);
	}
});

ReactDOM.render(
	<LoginContainer url="/api/login"/>,
	document.getElementById('container')
)