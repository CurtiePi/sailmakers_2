const AWS                                       = require('aws-sdk');
const { PDFDocument, StandardFonts, rgb }       = require('pdf-lib');
const fs                                        = require('fs');
const config                                    = require('../config/config');

const writeQuoteDoc = async (req, res, next) => {
    const currDate = function formatDate(date) {
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const formatQuoteType = function formatText(someString) {
        var result = '';
        if (someString) {
            result = someString.toUpperCase();
        }
        return result;
    }

    const parseMultiLine = function formatLongText(longString) {

        var lines = [];
        if (longString) {
            var maxLength = 55;

            var startIdx = 0;

            for (var idx=0; idx < longString.length; idx++){
                if (55 < idx - startIdx) {
                    if (longString[idx] == ' ') {
                        lines.push(longString.slice(startIdx, idx));
                        startIdx = idx+1;
                    } else if (longString[idx] != ' ') {
                        var blankIdx = longString.lastIndexOf(' ', idx);
                        lines.push(longString.slice(startIdx, blankIdx));
                        idx = blankIdx;
                        startIdx = blankIdx + 1;
                    }
                } else if (longString[idx] === '\n') {
                    lines.push(longString.slice(startIdx, idx));
                    startIdx = idx+1;
                } else if (idx == longString.length - 1){
                    lines.push(longString.slice(startIdx));
                }
            }
        }
        return lines.join('\n');
    }

    let quote = req.body.payload;
    const doc = await PDFDocument.create();
    let page = doc.addPage();
    let pageNum = 1;

    // Retrieve needed fonts
    const boldObliqueFont = await doc.embedFont(StandardFonts.HelveticaBoldOblique);
    const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
    const zingbatFont = await doc.embedFont(StandardFonts.ZapfDingbats);

    /**
     * Text constants
     * 
     **/
    var txtVals = {
      'salesperson': `${quote.salesperson.fname} ${quote.salesperson.lname}`,
      'salesPersonPhone': `${quote.salesperson.phone}`,
      'name': `${quote.customer.fname} ${quote.customer.lname}`,
      'phone': quote.customer.phone,
      'email': quote.customer.email,
      'address': quote.customer.address,
      'boatType': quote.boat_model,
      'boatName': quote.boat_name,
      'sailReq': parseMultiLine(quote.sail_request),
      'battens': quote.battens,
      'reefPt': quote.reefing_pts,
      'numLogo': quote.num_logo,
      'furling': quote.furl_sys,
      'uvColor': quote.uv_color,
      'homePort': quote.home_port,
      'pickUp': quote.delivery_type,
      'sailType': parseMultiLine(quote.sailing_type),
      'notes': parseMultiLine(quote.notes)
    }

    Object.keys(txtVals).map((key, index) => {
        txtVals[key] = (txtVals[key] === undefined) ? '' : txtVals[key];
    });

    const hdrText = 'UKNY New Customer Info';
    const salespersonText = `${txtVals["salesperson"]}`;
    const localeText = '10 Midland Ave - M-04, Portchester NY, 10573';
    const salesPersonPhoneText = `${txtVals["salesPersonPhone"]}`;
    const workEmailText = 'dave@uksailmakers-ne.com';
    const officePhoneText ='914.600.8800';
    const webSiteText = 'www.uksailmakers-ny.com';
    const subHdrText = (quote.quote_type.length > 1) ? 'NEW CUSTOMER REQUEST' : `NEW ${formatQuoteType(quote.quote_type[0])} REQUEST`;
    const nameText = `Name: ${txtVals["name"]}`;
    const phoneText = `Phone#: ${txtVals["phone"]}`;
    const emailText = `Email: ${txtVals["email"]}`;
    const addressText = `Address: ${txtVals["address"]}`;
    const boatTypeText =`Boat Type: ${txtVals["boatType"]}`;
    const boatNameText = `Boat Name: ${txtVals["boatName"]}`;
    const sailReqText = `Sail Requested: ${txtVals["sailReq"]}`;
    const battensText =  `Battens - ${txtVals["battens"]}`;
    const reefPtText = `Reefing Points - ${txtVals["reefPt"]}`;
    const numLogoText = `Numbers/Logos - ${txtVals["numLogo"]}`;
    const furlingText = `Furling System - ${txtVals["furling"]}`;
    const uvColorText = `UV Color: ${txtVals["uvColor"]}`;
    const homePortText = `Home Port: ${txtVals["homePort"]}`;
    const pickUpText = `Sail pick up/Drop off: ${txtVals["pickUp"]}`;
    const sailTypeTitle = `Type of Sailing - `;
    const sailTypeText = `${txtVals["sailType"]}`;
    const notesTitle =  `Additional Notes - `;
    const notesText =  `${txtVals["notes"]}`;

    // Header text and options
    const header = [
        {'text': salespersonText, 'multi': false, 'options': {x: 175.128, y: 786.39, size: 15, font: boldFont, color: rgb(0, 0, 0)}},
        {'text': localeText, 'multi': false,  'options': {x: 175.128, y: 774.89, size: 10, color: rgb(0, 0, 0)}},
        {'text': salesPersonPhoneText, 'multi': false, 'options': {x: 175.128, y: 764.89, size: 10, color: rgb(0, 0, 0)}},
        {'text': workEmailText, 'multi': false, 'options' : {x: 175.128, y: 754.89, size: 10, color: rgb(0, 0, 0)}},
        {'text': officePhoneText, 'multi': false, 'options': { x: 175.128, y: 744.89, size: 10, color: rgb(0, 0, 0)}},
        {'text': webSiteText, 'multi': false, 'options': {x: 175.128, y: 734.89, size: 10, color: rgb(0, 0, 0)}},
        {'text': subHdrText, 'multi': false, 'options': {x: 29.764, y: 650, size: 18, font: boldObliqueFont, color: rgb(0, 0, 0)}},
    ]

    // Body text and options
    const body = [
        {'text': nameText, 'multi': false, 'length': 41},
        {'text': phoneText, 'multi': false, 'length': 53},
        {'text': emailText, 'multi': false, 'length': 41},
        {'text': addressText, 'multi': false, 'length': 60},
        {'text': boatTypeText, 'multi': false, 'length': 72},
        {'text': boatNameText, 'multi': false, 'length': 77},
        {'text': sailReqText, 'multi': true, 'length': 110, 'indent': 110},
        {'text': battensText, 'multi': false, 'length': 55},
        {'text': reefPtText, 'multi': false, 'length': 105},
        {'text': numLogoText, 'multi': false, 'length': 115},
        {'text': furlingText, 'multi': false, 'length': 107},
        {'text': uvColorText, 'multi': false, 'length': 64},
        {'text': homePortText, 'multi': false, 'length': 76},
        {'text': pickUpText, 'multi': false, 'length': 148},
        {'text': sailTypeTitle, 'multi': false, 'length': 105},
        {'text': sailTypeText, 'multi': true, 'length': 0, 'indent': 0},
        {'text': notesTitle, 'multi': false, 'length': 115},
        {'text': notesText, 'multi': true, 'length': 0, 'indent': 0}
    ];

    // Create the Banner
    const {width, height} = page.getSize();

    page.drawRectangle({x: 29.764, y: 801.89, width: width * .9, height: 30, color: rgb(0, 0.55, 0.81)});
    page.drawText(hdrText, {x: 178.584, y: 811.89, size: 20, color: rgb(0.99, 0.99, 0.99)});
   
    // Place the logo
    let logo_img = fs.readFileSync('public/images/sailmakers_logo.png');
    const  img = await doc.embedPng(logo_img);
    const imgDims = img.scale(0.60);
    page.drawImage(img, {x: 59.528, y: 724.13, width: imgDims.width, height: imgDims.height});

    // Create the header next to logo
    for (var content in header) {
        page.drawText(header[content]['text'], header[content]['options']);
    }

    // Draw the line for the subheader
    var line_start = 29.754;
    var line_end = line_start + subHdrText.length * 11.5;
    line_coords = { 'start': { 'x': line_start, 'y': 649}, 'end': { 'x': line_end, 'y': 649 } }
    page.drawLine(line_coords, {color: rgb(0, 0, 0)});

    // After the subheader set starting x and y positions
    var xpos = 29.764;
    var ypos = 625;
    var options = {size: 16, font: boldObliqueFont, maxWidth: (width - 60), color: rgb(0, 0, 0)};

    // Create the section specifying the type of quote.
    var q_types = ['new sail', 'sail repair', 'winter service', 'sail cover', 'other'];
    var offset = 5 + width / q_types.length;
    for (var idx = 0; idx < q_types.length; idx++) {
      options['x'] = xpos + (idx * offset);
      options['y'] = ypos;
      page.drawRectangle({x: options['x'], y: options['y'], width: 10, height: 10, borderColor: rgb(0, 0, 0),borderWidth: 1.5,});
      if (quote.quote_type.includes(q_types[idx])) {
          page.drawText("\u2713", {x: options['x'], y: options['y'], size: 18, font: zingbatFont});
      }    
      options['x'] += 12;
      page.drawText(q_types[idx], options);
    }
    
    // Create the body
    options['size'] = 15;
    for (var content in body) {
        ypos -= (body[content]['length'] != 0) ? 45 : 20;
        if (ypos < 80) {
            page.drawText(`${pageNum}`, {x: page.getWidth() / 2, y: 10, size: 12, font: boldObliqueFont, color: rgb(0, 0, 0)});
            pageNum++;
            page = doc.addPage();
            ypos = 775;
            options['y'] = ypos;
        }
        options['x'] = xpos;
        options['y'] = ypos;

        line_coords = { 'start': { 'x': xpos, 'y': ypos-1}, 'end': { 'x': xpos + body[content]['length'], 'y': ypos-1 } }
        if (body[content]['multi']) {
            var lines = body[content]['text'].split('\n');
            page.drawText(lines[0], options);
            var indent = body[content]['indent'];
            for (var idx = 1; idx < lines.length; idx++) {
                options['x'] = xpos + indent;
                ypos -= (5 + options['size']);
                options['y'] = ypos
                page.drawText(lines[idx], options);
            }
        } else {
            page.drawText(body[content]['text'], options);
        }
        if (body[content]['length'] != 0) {
            page.drawLine(line_coords, {color: rgb(0, 0, 0)});
        } else {
            ypos -= 15;
        }
    }

    // Insert the final page number
    page.drawText(`${pageNum}`, {x: page.getWidth() / 2, y: 10, size: 12, font: boldObliqueFont, color: rgb(0, 0, 0)});

    // Create the filename.
    var filedate = currDate(quote.createdAt);
    var quoteStr = (quote.quote_type.length > 1) ? 'customer_request' : `${quote.quote_type[0].replace(' ', '_')}_request`;


    let filename = `${quote.customer.lname}_${quote.customer.fname}_${quoteStr}_${filedate}.pdf`;
    filename = filename.replace(/[\(\)\&\']+/g,'_').replace(/__+/g, '_').replace(' ', '_');

    req.pdf_filename = filename;
    req.pdf_bytes = await doc.saveAsBase64();

    next();
}


removeQuoteDoc = (req, res, next) => {

    var pdf_list = (req.pdf_list) ? req.pdf_list : req.body.pdf_list;

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

    next();
}


module.exports = {
    writeQuoteDoc,
    removeQuoteDoc
}
