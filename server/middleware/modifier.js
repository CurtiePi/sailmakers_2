const PDFJS                                     = require('pdfjs-dist/es5/build/pdf');
const fs                                        = require('fs');

const modifyQuote = async (req, res, next) => {
    console.log(req.file);

    var filename = req.file.path;
    console.log(filename);

    var loadingTask = PDFJS.getDocument(filename);
    var pdfDoc = await loadingTask.promise;
    var total = pdfDoc.numPages;
    console.log(`Total number of pages ${total}`);
    var price = 0.0
    var keyStr = 'Total';
    for (var idx = 1; idx <= total; idx++) {
        var page = await pdfDoc.getPage(idx);
        var textContent = await page.getTextContent();
        var textItems = textContent.items;
        for (var i = 0; i < textItems.length; i++) {
            var item = textItems[i];
            console.log(`index ${i} ==> *****${item.str}*****`);
            if (item.str.trim() == keyStr) {
                console.log(`incoming key string ${keyStr}`)
                var offset = 1;
                priceStr = textItems[i + offset].str;
                price = parseFloat(priceStr.replace(/\$|,/g, '')).toFixed(2);
                if (price === 'NaN') {
                  keyStr = "Deposit Due";
                }
            }
            console.log(`outgoing key string ${keyStr}`)
        }
    }
    req.totalprice = price;
    console.log(`Total price ${price}`);

    next();
}

module.exports = {
    modifyQuote
}
