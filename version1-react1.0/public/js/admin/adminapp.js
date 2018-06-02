//调用
$(document).ready(function(){
    $('#adminForm').bind('submit', function(){
        ajaxSubmit(this, function(data){
            if(data.code == '0')
            	alert('你没有登录权限！');
            else{
            	window.location = 'manager';
            }
        });
        return false;
    });
});

//将form转为AJAX提交
function ajaxSubmit(frm, fn) {
    var dataPara = getFormJson(frm);
    $.ajax({
        url: frm.action,
        type: frm.method,
        data: dataPara,
        success: fn,
        error: function(xhr, status, err) {
 	    console.error('admin/login', status, err.toString());
 	  }.bind(this)
    });
}

//将form中的值转换为键值对
function getFormJson(frm) {
    var o = {};
    var a = $(frm).serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });

    return o;
}