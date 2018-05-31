var mongoose = require('mongoose');

/**
 * 一个用户类
 * 
 * @class User
 * @constructor
 * @example
 * 	var newuser = new User(); 
 */

/**
 * 表示用户姓名
 *
 * @property {String} name
 * @private
 */

/**
 * 表示用户邮箱
 * 
 * @property {String} email 数据库唯一
 * @private
 */

/**
 * 表示用户密码
 *
 * @property {String} psw
 * @private
 */

var userSchema = new mongoose.Schema({
	name:String,
	email:{
		type:String,
		index: {unique: true}
	},
	psw:String,
	aliveTime:Date,//每次登陆时更新
},{
	minimize:false
});

/**
 * 用户身份核实
 * 
 * @method  checkUser
 * @param  {Object} value 用户身份信息(邮箱、密码)
 * @return {Object} user  查到的关于这个用户身份的所有信息
 */
userSchema.static('checkUser', function ( value,cb) {
    return this.find({"email":value.email,"psw":value.psw}).exec(cb);
});

/**
 * 获取所有用户信息
 *
 * @method getUser
 * @param {} 
 * @return {Object} users 查到所有用户的所有信息
 */

userSchema.static('getUser', function (cb) {
    return this.find().exec(cb);
});

/**
 * 通过邮箱信息获取用户信息
 *
 * @method getUserByEmail
 * @param {Object} value 用户邮箱
 * @return {Object} user 查到的关于这个用户身份的所有信息
 */
userSchema.static('getUserByEmail',function(value,cb){
	return this.find({"email":value}).exec(cb);
});

/**
 * 通过ID获取用户信息
 * 
 * @method getUserById
 * @param {Object} value 用户id
 * @return {Object} user 查到的关于这个用户身份的所有信息
 */
userSchema.static('getUserById',function(value,cb){
	return this.find({"_id":value}).exec(cb);
});

var UserModel = mongoose.model('User',userSchema);
module.exports = UserModel;