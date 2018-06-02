var nodemailer = require('nodemailer'),
    credential = require('../credential/credential'),

    mymail = credential(),
    fromme = mymail.mymail.user;;

module.exports = function(){
    var transporter = nodemailer.createTransport({
        service: 'QQ',
        secureConnection:true,//use SSL
        port:465,
        auth: {
            user: mymail.mymail.user,
            pass: mymail.mymail.password
        }
    });

    return{
        send:function(tosb){
            var mailOptions = {
                from:fromme, 
                to: tosb, 
                subject: 'Hello',
                html: '<h1>Hello,welcome to penmanbox</h1>\n<p>ginny try to create a wonderful world for people her love!</p><p>Start your journey now!</p>' ,// html body
                generateTextFromHtml:true
            };  

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Message sent: ' + info.response);
                }
            });
        },
        delsend:function(tosb){
            var mailOptions = {
                from:fromme,
                to:sb,
                subject:'Apologize to my friend',
                html:'<p>I am ginny,the administrator of penmanbox website.I am sorry to tell that your work which is not in accrodance with our rules will be invisible.</p><p>Please reply this e-mail directly if you have any problem.</p><p>Thanks for your supporting!</p>'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Message sent: ' + info.response);
                }
            });

        },
        emailError:function(message,filename,exception){
            var body = '<h1>pen man box has a little problem</h1>'+'message:<br><pre>'+message+'</pre><br>';
            if(exception)
                body += 'exception:<br><pre>'+exception+'</pre></br>';
            if(filename)
                body += 'filename:<br><pre>'+filename+'</pre></br>';
            var mailOptions = {
                from:fromme, 
                to: tosb, 
                subject: 'penmanbox error',
                html: body,
                generateTextFromHtml:true
            };
            transporter.sendMail(mailOptions,function(err){
                if(err) console.error('Unable to send email:'+error);
            });
        }
    }
}