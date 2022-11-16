import { s3Client } from '../lib/clients.js';
import { DeleteObjectsCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import config from '../config/config.js';

/*
 * Save a newly (PDF) file to Amazon S3 storage.
 */

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
        const upload = new Upload({ 
            client: s3Client, 
            params: params });
        await upload.done();
       console.log('File uploaded successfully.');

    } catch (err) {
        console.log(`Error: ${err}`);
    }

    next();
}

/*
 * Retrieve a (PDF) file from Amazon S3 storage.
 * 
 * Return type is a base64 string to be used for viewing a PDF
 * onscreen using vue-pdf-embed library, and adding file as an
 * attachment to an email.
 */

const getFromS3 = async (req, res, next) => {
    let filename = req.params.filename;

    const params = {
        Bucket: config.aws.bucket,
        Key: `pdfs/${filename}`
    };

    try {
        // Create a helper function to convert a ReadableStream to a string.
        const streamToString = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on("data", (chunk) => chunks.push(chunk));
                stream.on("error", reject);
                stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
        });


        const command = new GetObjectCommand(params);
        const data = await s3Client.send(command);

        // Convert the ReadableStream to a string.
        const byte_string = await streamToString(data.Body);
        req.pdf_base64 = (byte_string);

    } catch (err) {
        console.log(`Error: ${err}`);
    }

    next();
}

/*
 * Retrieve a (PDF) file from Amazon S3 storage.
 * Return type is a Buffer to be used for downloading
 * a PDF to a user's local file storage.
 */

const downloadFromS3 = async (req, res, next) => {
    let filename = req.params.filename;

    const params = {
        Bucket: config.aws.bucket,
        Key: `pdfs/${filename}`
    };

    try {
        // Create a helper function to convert a ReadableStream to a Buffer.
        
        const streamToBuffer = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on("data", (chunk) => chunks.push(chunk));
                stream.on("error", reject);
                stream.on("end", () => resolve(Buffer.concat(chunks)));
        });
        
        const command = new GetObjectCommand(params);
        const data = await s3Client.send(command);

        // Convert the ReadableStream to a Buffer.
        const byte_buffer = await streamToBuffer(data.Body);
        res.send(byte_buffer);

        res.end();
    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

/*
 * Save a (PDF) file from local file stroage to Amazon S3 storage.
 */

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
      
        const upload = new Upload({ 
            client: s3Client, 
            params: params });

        await upload.done();
        console.log('File uploaded successfully.');

    } catch (err) {
        console.log(`Error: ${err}`);
    }

    next();
}

/*
 * Remove one or many (PDF) file(s) from Amazon S3 storage.
 */

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
        const command = new DeleteObjectsCommand(params);
        const data = await s3Client.send(command);

        console.log(`File(s) deleted successfully. ${data}`);
    } catch (err) {
        console.log(`Error: ${err}`);
    }

    next();
}

export { saveToS3, getFromS3, downloadFromS3, uploadToS3, removeFromS3 };
