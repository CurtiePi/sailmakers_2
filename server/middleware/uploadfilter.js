const fs = require('fs'); 
const path = require('path'); 
const fsPromises = fs.promises;

const checkUpload = (err, req, res, next) => {
    if (err.code === "INCORRECT_FILETYPE") {
        res.status(422).json({ 'error': 'Only PDF files are allowed'});
        return;
    }

    next();
}

const renameUpload = (req, res, next) => {
    var file_path = req.file.destination;
    var filename = req.file.path;
    var new_filename = `${file_path}/${req.file.originalname}`;

    fs.rename(filename, new_filename, () => {
      console.log(`File Renamed from ${filename} to ${new_filename}!`);
      next();
    })
}

const findPath = async (req, res, next) => {
    var directory = 'public/files';

    const search = async function (directory) {
        let directories;
        try {
            directories = await fsPromises.readdir(directory);
            return directories;
        } catch (err) {
            console.log(err);
        }
    }


    var paths = await search(directory);
    paths = paths.filter(d => d !== '.DS_Store');

    for (idx in paths) {
        var dir_path = `${directory}/${paths[idx]}`;
        directories = await search(dir_path);
        var path = directories.filter(f => f === req.body.attachment);
        if (path.length !== 0) {
            req.attachment_path = `${dir_path}`;
            break;
        }  
    }

   next();
}

module.exports = {
    checkUpload,
    renameUpload,
    findPath
}
