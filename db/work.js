var mongoose = require('mongoose');

/**
 * 一个作品类
 *
 * @class  Work
 * @constructor
 * @example
 * 	var newwork = new Work();
 */

/**
 * 表示作品主题
 *
 * @property {String} theme
 * @private
 */

/**
 * 表示作品描述
 *
 * @property {String} describe
 * @private
 */

/**
 * 表示用户头像地址
 *
 * @property {String} head
 * @private
 */

/**
 * 表示作品地址
 *
 * @property {String} photo
 * @private
 */

/**
 * 表示作品热度
 *
 * @property {String} hotrate
 * @private
 */

/**
 * 表示作品的作者ID
 *
 * @property {String} userid
 * @private
 */

/**
 * 表示作品的作者姓名
 *
 * @property {String} username
 * @private
 */

/**
 * 表示作品的标签(1表示在线创作)
 *
 * @property {int} tag
 * @private
 */
var workSchema = new mongoose.Schema({
	theme:String,
	describe:String,
	head:String,
	photo:String,  // theme+date
	hotrate:Number,
	userid:String,
	username:String,
	tag:String
},{
	minimize:false
});

/**
 * 通过主题获取作品
 * 
 * @method  getWorks
 * @param  {Object} theme 
 * @return {Object} works  查到关于这个主题的所有作品
 */
workSchema.static('getWorks', function (theme, cb) {
    return this.find({"theme":theme}).exec(cb);
});

/**
 * 获取所有作品
 * 
 * @method  getWorksList
 * @param  {} 
 * @return {Object} works  查到所有作品
 */
workSchema.static('getWorksList',function(cb){
	return this.find().exec(cb);
});

/**
 * 通过用户id获取作品
 * 
 * @method  getWorksByUserId
 * @param  {Object} userid 
 * @return {Object} works  查到关于这个用户的所有作品
 */
workSchema.static('getWorksByUserId', function (userid, cb) {
    return this.find({"userid":userid}).exec(cb);
});

/**
 * 通过作品id删除作品
 * 
 * @method  deleteWorkById
 * @param  {Object} workid 用户身份信息(邮箱、密码)
 * @return 
 */
workSchema.static('deleteWorkById',function(workid,cb) {
	return this.findByIdAndRemove(workid).exec(cb);	
});

/**
 * 通过作品id、主题、描述更新作品
 * 
 * @method  updateWork
 * @param  {String} workid
 * @param {String} theme
 * @param {String} descibe
 * @return 
 */
workSchema.static('updateWork', function (workid,theme,describe, cb) {
    return this.update({
        '_id': workid
    }, {'theme': theme,'describe': describe}).exec(cb);
});

workSchema.static('addHotRate',function(workid,hotrate,cb) {
	console.log('db hotrate'+hotrate)
	return this.update({
		'_id':workid
	},{
		'hotrate':hotrate
	}).exec(cb);
});

var WorkModel = mongoose.model('Work',workSchema);
module.exports = WorkModel;