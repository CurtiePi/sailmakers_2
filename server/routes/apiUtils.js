const express               = require('express');
const uploadFilter          = require('../middleware/uploadfilter.js');
const marshaller            = require('../middleware/dashboard.js');
const s3                    = require('../middleware/s3Interface.js');
const routeController       = require('../controllers/routingController');
const multer                = require('multer');
const apiUtilsRouter        = express.Router();


const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file");
        error.code = "INCORRECT_FILETYPE";
        // error occured
        return cb(error, false)
    }
    cb(null, true);
}

const upload = multer({
    dest: './public/files/pdf',
    fileFilter
});

const attachment = multer({
    dest: './public/files/attachment'
});

module.exports  = apiUtilsRouter;

/*
 * Utility routes
 */

apiUtilsRouter.post('/upload', upload.single('file'), uploadFilter.checkUpload, uploadFilter.renameUpload, routeController.uploadFile);

apiUtilsRouter.post('/attach', attachment.single('attachment'), uploadFilter.renameUpload,
  (req, res, next) => {
      res.status(200).json({ 'attachment': req.file.originalName });
});

//apiUtilsRouter.get('/download/:name', (req, res, next) => {
//    var filepath = `./public/files/pdf/${req.params.name}`;
//    res.download(filepath);
//});

//apiUtilsRouter.get('/download/:filename', s3.getFromS3);
apiUtilsRouter.get('/download/:filename', s3.downloadFromS3);
    
apiUtilsRouter.get('/dashboard', routeController.getDashboardRawData, marshaller.marshalDashboardData, (req, res, next) => {
    res.status(200).json({ 'msg': 'You have the power', 'data': req.marshalledData });
});

