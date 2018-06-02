
function credential(){
	return{
		cookieSecret:'put your cookie key here',
		mymail:{
			user:'penmanbox@qq.com',
			password:'pqrdtvnffhrrdcfi',
		},
		mongo:{
			development:{
				connectionString:'mongodb://localhost/penmanbox',
			},
			production:{
				connectionString:'mongodb://test:test@115.28.90.166/penmanbox'
			}
		},
		address:{
			development:"localhost:http://localhost:",
			production:""
		}			
	}
}
module.exports = credential;