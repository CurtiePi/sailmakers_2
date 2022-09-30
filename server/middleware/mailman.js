import config from '../config/config.js';
import nodemail from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import signature from '../config/signature.js';

const transporter = nodemail.createTransport(smtpTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: config.mail.office,
        pass: config.mail.access
    },
    tls: {
        ciphers: 'SSLv3'
    }
}));

const deliverEmail = (req, res, next) => {
    var data = req.body

    var messageBody = `${data.body}<p>` + signature + '</p>';
    var recipients = data.recipients.join(', ');

    var mailOptions = {
        from: 'dave@uksailmakers-ne.com;',
        subject: data.subject,
        html: messageBody,
        attachments: [{
            filename: 'sailmakers_logo.jpg',
            path: './public/images/sailmakers_logo.jpg',
            cid: 'dave@uk-sailmakers-ne.com'
        },
        {
            filename: 'signature.png',
            path: './public/images/signature.jpg',
            cid: 'dave-signature'
        },
        ]
    };

    if (data.isBulk) {
        mailOptions['bcc'] = recipients;
    } else {
        mailOptions['to'] = recipients;
    }

    if (data.attachments) {
        let attachmentData = {};
        for (let filename in data.attachments) {
            attachmentData['filename'] = filename;
            attachmentData['content'] = data.attachments[filename];
            attachmentData['encoding'] = 'base64';
        }
        mailOptions['attachments'].push(attachmentData);
    }

    
    transporter.sendMail(mailOptions, function (error, info) {
           if (error){
               console.log('Error: ' + error);
               next(error);
           }

           console.log(`Message ${info.messageId} sent: ${info.response}`);
           req.infoMessage = info.messageId
           next();
    })
}

export default deliverEmail; 
