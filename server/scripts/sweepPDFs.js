const fs            = require('fs');
const mongoose      = require('mongoose');
const Quote         = require('../models/quotes');
const Customer      = require('../models/customers');

const removeQuoteEntry = (fileList) => {
    console.log("Removing expired PDFs from database....");
    fileList.forEach(async (file) => {

        let quote = await Quote.findOne({doc_path: file})
                               .populate('customer');
        
        if (quote) {
            let name = `${quote.customer.fname} ${quote.customer.lname}`
            let updatedQuote = await Quote.updateOne({_id: quote._id}, {$pull: {doc_path: file} });

            if (updatedQuote) {
                console.log(`Removed file ${file} for ${name}`);
            }
        }
    });
}   

const removeQuoteDoc = (pdf_list) => {
    console.log("Removing expired PDFs from file system....");

    const removeFtn = function removeFile(fileList, callback) {
        var size = fileList.length;
        const file = fileList.pop();
        if (file == undefined) {
            callback();
        } else {
            const pathToFile = `./public/files/pdf/${file}`;
            fs.unlink(pathToFile, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(`${pathToFile} successfully deleted`);
                }
            });
            removeFile(fileList, callback);
        }
    }

    const callback = function printMessage() {
        console.log('All Done');
    }

    if (pdf_list.length > 0 ) {
        removeFtn(pdf_list, callback);
    } else {
        console.log('No files to delete');
    }
}

const getPDFKillList = async () => {

    console.log("Getting list of expired PDFs....");
    const pathToPDFs = `./public/files/pdf`;
    let resultList = [];

    const getDirectoryFiles = function getFileList() {
        return new Promise((resolve, reject) => {
            fs.readdir(pathToPDFs, (err, files) => {
                if (err) {
                    reject('Unable to scan directory');
                }

                resolve(files);
            });
        });
    }

    const getKillList = function filterFiles(fileList) {
        let promises = [];
        fileList.forEach((file) =>  {
            promises.push(determineFileAge(file));
        });
        return promises;
    }
   
    const determineFileAge = function storeOldFile(file) {
        return new Promise((resolve, reject) => {
            fs.stat(`${pathToPDFs}/${file}`, (err, stats) => {
                if (err) {
                    console.log(`Unable to get info for file ${file} due to ${err}`);
                }

                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

                if (+threeMonthsAgo > +stats.mtime) { 
                    resolve(file);
                }
                else {
                    resolve('')
                }
            });
        });
    }

    let fileListing = await getDirectoryFiles()
        .then((result) => {
            return result;
        })
        .catch((err) => {console.log(err)});

    if (fileListing.length > 0) {
        let pdf_list = await Promise.all(getKillList(fileListing))
            .then((files) => {
                return (files);
            })
            .catch((error) => {console.log(error)});

         resultList = pdf_list.filter((element) => {element != ''});
    }

    return resultList;
}

module.exports = {
    removeQuoteEntry,
    removeQuoteDoc,
    getPDFKillList
}
