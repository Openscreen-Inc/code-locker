const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const csv = require('csvtojson');
const multer = require('multer');
const uploadCSV = multer({ dest: 'file/uploads' });
const dotenv = require('dotenv');
dotenv.config();

//-------------------------------------------------------------- openscreen sdk --
const { Openscreen } = require('@openscreen/sdk');

//------------------------------------------------------------ relative imports --
const { generateContactObj, intentFlow } = require('./props');

//------------------------------------------------------------------ middleware --
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// setting frontend build to a static folder.
app.use(express.static(path.join(__dirname, '../frontend/build')));

//--------------------------------------------------------- openscreen API keys --
const os = new Openscreen().config({
  key: process.env.OS_API_KEY,
  secret: process.env.OS_API_SECRET,
});

//------------------------------------------------------------- setup a project --
let projectId = process.env.OS_PROJECT_ID

//------------------------------------------------------------ get scan details --
let scanId;
app.get('/scan/:scanId', async (req, res) => {
  scanId = req.params.scanId;
  const scanObj = await os.scan(scanId).get();
  let contact = scanObj.contacts[0];

  res.json({ contact });
});

//---------------------------------------------------------- update contact info --
app.post('/update', async (req, res) => {
  const scanObj = await os.scan(scanId).get();

  let contact = scanObj.contacts[0];

  const contactId = contact.contactId;

  const {
    firstName,
    lastName,
    emailAddress,
    address,
    city,
    provinceOrState,
    country,
    postalOrZip,
    cellPhone,
    accepted,
    revoked,
  } = req.body;

  const props = {
    firstName,
    lastName,
    emailAddress,
    mailingAddress: { address, city, provinceOrState, country, postalOrZip },
    cellPhone: `+${cellPhone}`,
    consent: {
      url: 'www.example.com',
      consented: accepted || revoked,
      consentedAt: new Date().toISOString(),
    },
  };

  const updatedContactInfo = await os.contact(contactId).update(props);

  res.json({ updatedContactInfo });
});

//--------------------------------------------------- upload CSV from front-end --
app.post('/uploads', uploadCSV.single('csv'), async (req, res) => {
  
  // rename a file at the given path
  fs.renameSync(req.file.path, `file/uploads/${req.file.originalname}`, (err) => {
    if (err) throw err;
  });
 
  const csvFilePath = `file/uploads/${req.file.originalname}`;
  const csvRows = await csv().fromFile(csvFilePath);

  const arrOfQrCodes = [];
  const qrCodes = [];

  for (let csvRow of csvRows) {
    try {
      const contactObject = generateContactObj(csvRow);

      // 1. create contact (address) for each direct mail piece
      const contact = await os
        .project(projectId)
        .contacts()
        .create(contactObject);
      const contactId = contact.contact.contactId;

      // 2. create asset and qrCode for each direct mail piece
      const asset = await os
        .project(projectId)
        .assets()
        .create({
          name: csvRow.assetName,
          description: csvRow.assetDescription,
          customAttributes: {
            location: csvRow.assetLocation,
            listingId: csvRow.assetListingId,
          },
          qrCodes: [intentFlow],
        });

      const assetId = asset.asset.assetId;
      
      // 3. link contact to asset for each direct mail piece
      await os.asset(assetId).contact(contactId).link('OWNER');

      const qrCodes = asset.asset.qrCodes;

      // 4. create qr code for each asset
      for (let qrCodeObj of qrCodes) {
        const qrCodeId = qrCodeObj.qrCodeId;
        const singleQrCode = await os.qrCode(qrCodeId).get({ format: 'png' });
      
        arrOfQrCodes.push({ ...singleQrCode, listingId: csvRow.assetListingId });
       
        // 5. save qrCode images in local folder 'qrCodes'  
        await os.saveQrImageDataToFile(singleQrCode, `./qrCodes/${csvRow.assetListingId}.png`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 6. prepare qr codes with associated assetListing Id for direct mail print shop 
  for (let qrCodeObj of arrOfQrCodes) {
    qrCodes.push({
      assetListingId: qrCodeObj.listingId,
      qrCodeBase64: qrCodeObj.image.data,
    });
  }

  res.json({ qrCodes });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/../frontend/build/index.html')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Listeing on port ${PORT}`));
