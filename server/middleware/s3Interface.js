const AWS                                       = require('aws-sdk');
const config                                    = require('../config/config');
const s3 = new AWS.S3({
    accessKeyId: config.aws.id,
    secretAccessKey: config.aws.key
});


saveToS3 = (req, res, next) => {

    let filename = req.pdf_filename;
    let filecontent = req.pdf_bytes;
    const params = {
        Bucket: config.aws.bucket,
        Key: `pdfs/${filename}`,
        Body: filecontent
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.log(`Error: ${err}`);
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });

    next();
}


module.exports = {
    saveToS3
}
