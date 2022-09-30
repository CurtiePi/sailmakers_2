import AWS from 'aws-sdk';
import config from '../config/config.js';

const s3 = new AWS.S3({
    accessKeyId: config.aws.id,
    secretAccessKey: config.aws.key
});

const saveToS3 = async (req, res, next) => {

    let filename = req.pdf_filename;
    let filecontent = req.pdf_bytes;
    const params = {
        Bucket: config.aws.bucket,
        Key: `pdfs/${filename}`,
        Body: filecontent,
        ContentType: 'application/pdf',
    };

    try {
        const data = await s3.upload(params).promise();

        console.log(`File uploaded successfully. ${data.Location}`);

    } catch (error) {
        console.log(`Error: ${error}`);
    }

    next();
}

const getFromS3 = async (req, res, next) => {

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

const downloadFromS3 = async (req, res, next) => {

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

const uploadToS3 = async (req, res, next) => {

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

const removeFromS3 = async (req, res, next) => {

    var pdf_list = (req.pdf_list) ? req.pdf_list : req.body.pdf_list;

    let s3_keys = [];
    for (let idx = 0; idx < pdf_list.length; idx++) {
        s3_keys.push({ Key: `pdfs/${pdf_list[idx]}`});
    }
 
    const params = {
        Bucket: config.aws.bucket,
        Delete: {
            Objects: s3_keys,
            Quiet: false
        }
    };

    try {
        const data = await s3.deleteObjects(params).promise();

        console.log(`File(s) deleted successfully. ${data}`);

    } catch (error) {
        console.log(`Error: ${error}`);
    }

    next();
}

export { saveToS3, getFromS3, downloadFromS3, uploadToS3, removeFromS3 };
