var mongoose = require('mongoose');

/**
 * 与管理员相关的类
 * 
 * @class Admin
 * @constructor
 * @example
 * 	var newadmin = new Admin();
 */

/**
 * 表示管理员邮箱
 *
 * @property {String} email 数据可唯一
 * @private
 */

/**
 * 表示管理员密码
 *
 * @property {String} password
 * @private
 */
var adminSchema = new mongoose.Schema({
	email:{
		type:String,
		index:{unique:true}
	},
	password:String,
	auth:String
},{
	minimize:false
});

/**
 * 管理员身份核实
 * 
 * @method  checkAdmin
 * @param  {Object} value 管理员身份信息
 * @return {Object} admin  查到的关于这个管理员身份的所有信息
 */
adminSchema.static('checkAdmin', function ( value,cb) {
    return this.find({"email":value.email,"password":value.password}).exec(cb);
});

var AdminModel = mongoose.model('Admin',adminSchema);
module.exports = AdminModel;