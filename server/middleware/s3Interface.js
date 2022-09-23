const AWS                                       = require('aws-sdk');
const config                                    = require('../config/config');
const fs                                        = require('fs');
const path                                      = require('path');
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
        Body: filecontent,
        contentType: 'application/pdf'
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.log(`Error: ${err}`);
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });

    next();
}

getFromS3 = async (req, res, next) => {

    let filename = req.params.filename;

    const params = {
        Bucket: config.aws.bucket,
        Key: `pdfs/${filename}`
    }
    try {
        const data = await s3
            .getObject(params)
            .promise();

        // const byte_string = Buffer.from(data.Body).toString('base64');
        const byte_string = data.Body.toString('base64');

        //res.attachment(filename);
        res.send(byte_string);

    } catch (err) {
        console.log(err);
    }
}

downloadFromS3 = async (req, res, next) => {

    let filename = req.params.filename;

    const params = {
        Bucket: config.aws.bucket,
        Key: `pdfs/${filename}`
    }
    try {
            const data = await s3
            .getObject(params)
            .promise();

        res.send(data.Body);
        res.end();

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    saveToS3,
    getFromS3,
    downloadFromS3,
}
