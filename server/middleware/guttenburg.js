import PDFDocument from 'pdfkit';
import config from '../config/config.js';

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


    let quote = req.body.payload;

    // Text constants 

    var txtVals = {
      'salesperson': `${quote.salesperson.fname} ${quote.salesperson.lname}`,
      'salesPersonPhone': `${quote.salesperson.phone}`,
      'name': `${quote.customer.fname} ${quote.customer.lname}`,
      'phone': quote.customer.phone,
      'email': quote.customer.email,
      'address': quote.customer.address,
      'boatType': quote.boat_model,
      'boatName': quote.boat_name,
      'sailReq': quote.sail_request,
      'battens': quote.battens,
      'reefPt': quote.reefing_pts,
      'numLogo': quote.num_logo,
      'furling': quote.furl_sys,
      'uvColor': quote.uv_color,
      'homePort': quote.home_port,
      'pickUp': quote.delivery_type,
      'sailType': quote.sailing_type,
      'notes': quote.notes
    }

    Object.keys(txtVals).map((key, index) => {
        txtVals[key] = (txtVals[key] === undefined) ? '' : txtVals[key];
    });

    const hdrText = 'UKNY New Customer Request Info';
    const salespersonText = `${txtVals["salesperson"]}`;
    const localeText = '10 Midland Ave - M-04, Portchester NY, 10573';
    const salesPersonPhoneText = `${txtVals["salesPersonPhone"]}`;
    const workEmailText = 'dave@uksailmakers-ne.com';
    const officePhoneText ='914.600.8800';
    const webSiteText = 'www.uksailmakers-ny.com';
    const nameText = `Client: ${txtVals["name"]}`;
    const phoneText = `Phone#: ${txtVals["phone"]}`;
    const emailText = `Email: ${txtVals["email"]}`;
    const addressText = `Address: ${txtVals["address"]}`;
    const boatTypeText =`Boat Type: ${txtVals["boatType"]}`;
    const boatNameText = `Boat Name: ${txtVals["boatName"]}`;
    const sailReqLabel = "Sail Requested:";
    const sailReqText = txtVals["sailReq"];
    const battensVal = (!!txtVals["battens"]) ? txtVals["battens"] : "N/A";
    const battensText =  `Battens: ${battensVal}`;
    const reefPtVal = (!!txtVals["reefPt"]) ? txtVals["reefPt"] : "N/A";
    const reefPtText = `Reefing Points: ${reefPtVal}`;
    const numLogoVal = (!!txtVals["numLogo"]) ? txtVals["numLogo"] : "N/A";
    const numLogoText = `Numbers/Logos: ${numLogoVal}`;
    const furlingVal = (!!txtVals["furling"]) ? txtVals["furling"] : "N/A";
    const furlingText = `Furling System: ${furlingVal}`;
    const uvColorVal = (!!txtVals["uvColor"]) ? txtVals["uvColor"] : "N/A";
    const uvColorText = `UV Color: ${uvColorVal}`;
    const homePortLabel = "Home Port:";
    const homePortText = txtVals["homePort"];
    const pickUpLabel = "Sail pick up/Drop off:";
    const pickUpText = txtVals["pickUp"];
    const sailTypeTitle = `Type of Sailing: `;
    const sailTypeText = `${txtVals["sailType"]}`;
    const notesTitle =  `Additional Notes - `;
    const notesText =  `${txtVals["notes"]}`;

    const doc = new PDFDocument;
    doc.registerFont('FreeSerif', './public/files/fonts/freefont/FreeSerif.ttf')

    let origXPos = doc.x;

    // Print Banner
    doc.roundedRect(50, 50, 500, 30, 10)
       .fillAndStroke("#2D8CCF");
    doc.fill('#FFF').stroke();
    doc.fontSize(16);
    
    let options = { width: 500, align: 'center', linebreak: false };
    let height = 30;
    doc.text(hdrText,doc.x, doc.y - (height - doc.heightOfString(hdrText, options)), options);

    // Print logo
    doc.image('public/images/sailmakers_logo.png', doc.x, doc.y + 5, {scale: 0.70});

    // Print Header
    doc.fill('#000').stroke()
       .font('Helvetica-Bold')
       .fontSize(14)
       .text(salespersonText, doc.x + 150, doc.y + 5);

    doc.fontSize(10)
       .font('Helvetica')
       .text(localeText)
       .text(salesPersonPhoneText)
       .text(workEmailText)
       .text(officePhoneText)
       .text(webSiteText)

    doc.moveDown(3.0);

    // Print client information
    let linePos = doc.y;
    doc.font('Helvetica-Bold')
       .fontSize(12)
       .text(nameText, origXPos, linePos, { align: 'left'})
       .text(phoneText, doc.x + 100, linePos,{ align: 'right' })
       .text('Address:', origXPos, linePos + 20, { align: 'left'})
       .text(addressText.slice(8), origXPos + 50, linePos + 20, { width: 250})
       .text(emailText, doc.x + 100, linePos + 20, { align: 'right'});

    doc.moveDown(1.5);
    linePos = doc.y;
    doc.text(boatTypeText, origXPos, linePos, {align: 'left'})
       .text(boatNameText, origXPos + 100, linePos,  {align: 'right'});

    doc.moveDown(2.5);

    // Print the request type(s)
    doc.font('Courier-BoldOblique')
       .fontSize(18)
       .text('Request Type(s):', origXPos, doc.y, { align: 'left', underline: true});

    var q_types = ['new sail', 'sail repair', 'winter service', 'sail cover', 'other'];
    let colPos = origXPos;
    let labelspace = 15;
    linePos = doc.y;

    for (let idx = 0; idx < q_types.length; idx++) {
        doc.font('Helvetica-Bold')
           .rect(colPos, linePos, 10, 10)
           .stroke();

        if (quote.quote_type.includes(q_types[idx])) {
            doc.font('FreeSerif')
               .fontSize(14)
               .text('\u2713', colPos + 3, linePos - 5);
        }

        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text(q_types[idx], colPos + labelspace, linePos);

        colPos += 95;
    }


    doc.x = origXPos;

    // Print the request specifics
    doc.moveDown(4);

    doc.fontSize(13)
       .text(sailReqLabel, {underline: true})
       .fontSize(12)
       .text(sailReqText);

    doc.moveDown();
    linePos = doc.y;

    doc.fontSize(10)
       .text(battensText, origXPos, linePos)
       .text(reefPtText, origXPos + 150, linePos)
       .text(numLogoText, origXPos + 300, linePos)
    doc.moveDown();

    linePos = doc.y;
    doc.text(furlingText, origXPos + 65, linePos)
       .text(uvColorText, origXPos + 225, linePos);

    doc.moveDown(3.0);
    linePos = doc.y;

    // Print the home port and pick up/drop off point
    doc.fontSize(13)
       .text(homePortLabel, origXPos, linePos, {underline: true, align: 'left'})
       .text(pickUpLabel, origXPos + 300, linePos, {underline: true, align: 'right'})

    doc.moveDown();
    linePos = doc.y;

    doc.fontSize(10)
       .text(homePortText, origXPos, linePos, {align: 'left'})
       .text(pickUpText, origXPos + 300, linePos, {align: 'right'});

    doc.moveDown(2.0);

    // Print the type of sailing done
    doc.fontSize(13)
       .text(sailTypeTitle, origXPos, doc.y, {underline: true})
       .fontSize(10)
       .text(sailTypeText, origXPos , doc.y);

    doc.moveDown(2.0);

    // Print any additional notes
    doc.fontSize(13)
       .text(notesTitle, origXPos, doc.y, {underline: true})
       .fontSize(10)
       .text(notesText, origXPos , doc.y)

    doc.end();

    // Create the filename.
    var filedate = currDate(quote.createdAt);
    var quoteStr = (quote.quote_type.length > 1) ? 'customer_request' : `${quote.quote_type[0].replace(' ', '_')}_request`;
    let filename = `${quote.customer.lname}_${quote.customer.fname}_${quoteStr}_${filedate}.pdf`;

    req.pdf_filename = filename.replace(/[\(\)\&\']+/g,'_').replace(/__+/g, '_').replace(' ', '_');
    req.pdf_bytes = doc;

    next();
}

export { writeQuoteDoc }
