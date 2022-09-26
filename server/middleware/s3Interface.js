const AWS                                       = require('aws-sdk');
const config                                    = require('../config/config');
const fs                                        = require('fs');
const path                                      = require('path');
const s3 = new AWS.S3({
    accessKeyId: config.aws.id,
    secretAccessKey: config.aws.key
});


saveToS3 = async (req, res, next) => {

    let filename = req.pdf_filename;
    let filecontent = req.pdf_bytes;
    const params = {
        Bucket: config.aws.bucket,
        Key: `pdfs/${filename}`,
        Body: filecontent,
        ContentType: 'application/pdf',
    };

    console.log(params);

    try {
        const data = await s3.upload(params).promise();

        console.log(`File uploaded successfully. ${data.Location}`);

    } catch (error) {
        console.log(`Error: ${error}`);
    }

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

        const byte_string = data.Body.toString('base64');

        req.pdf_base64 = (byte_string);

    } catch (err) {
        console.log(err);
    }

    next();
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

uploadToS3 = async (req, res, next) => {

    let filename = req.body.pdf_filename;
    const filecontent = Buffer.from(req.body.pdf_bytes, 'base64');

    const params = {
        Bucket: config.aws.bucket,
        Key: `pdfs/${filename}`,
        Body: filecontent,
        ContentType: 'application/pdf',
        ContentEncoding: 'base64',
    };


    try {
        const data = await s3.upload(params).promise();

        console.log(`File uploaded successfully. ${data.Location}`);

    } catch (error) {
        console.log(`Error: ${error}`);
    }

    next();
}

module.exports = {
    saveToS3,
    getFromS3,
    downloadFromS3,
    uploadToS3,
}
