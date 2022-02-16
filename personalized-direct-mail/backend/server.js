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
var zipdir = require('zip-dir');

//------------------------------------------ debugging for development purposes --
process.env.OS_DEBUG = 'all';

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
let projectId = process.env.OS_PROJECT_ID;
let consentUrl;

//------------------------------------------------------------ get scan details --
let scanId;
app.get('/scan/:scanId', async (req, res) => {
  scanId = req.params.scanId;

  let contact;
  try {
    const scanObj = await os.scan(scanId).get();
    contact = scanObj.contacts[0];
  } catch(error) {
    console.log(error.data);
  }

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
    consent
  } = req.body;

  const props = {
    firstName,
    lastName,
    emailAddress,
    mailingAddress: { address, city, provinceOrState, country, postalOrZip },
    cellPhone: `+1${cellPhone}`,
    consent: [{
      url: consentUrl,
      consented: consent,
      consentedAt: new Date().toISOString(),
    }],
  };

  const updatedContactInfo = await os.contact(contactId).update(props);

  res.json({ updatedContactInfo });
});

//--------------------------------------------------- upload CSV from front-end --
app.post('/uploads', uploadCSV.single('csv'), async (req, res) => {
  let arrOfQrCodeImagePaths = [];
  let file = null;
  let today = new Date();
  let sameDay = new Date(today);

  // rename a file at the given path
  fs.renameSync(req.file.path, `file/uploads/${req.file.originalname}`, (err) => {
    if (err) throw err;
  });
 
  const csvFilePath = `file/uploads/${req.file.originalname}`;
  const csvRows = await csv().fromFile(csvFilePath);
  consentUrl = csvRows[csvRows.length - 1].url;

  const arrOfQrCodes = [];
  const qrCodes = [];

  for (let csvRow of csvRows) {
    try {
      const contactObject = generateContactObj(csvRow);

      // 1. create contact (address) for each direct mail piece
      const contact = await os.project(projectId).contacts().create(contactObject);
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
      await os.asset(assetId).contact(contactId).link({type: 'OWNER'});

      const qrCodes = asset.asset.qrCodes;

      // 4. create qr code for each asset
      for (let qrCodeObj of qrCodes) {
        const qrCodeId = qrCodeObj.qrCodeId;

        const singleQrCode = await os.qrCode(qrCodeId).get({format: 'png'});

        arrOfQrCodes.push({
          ...singleQrCode,
          listingId: csvRow.assetListingId,
        });

        // 5. save qrCode images in local folder 'qrCodes'
        await os.saveQrImageDataToFile(singleQrCode, path.join(__dirname + `/qrCodes/${csvRow.assetListingId}.png`));

        arrOfQrCodeImagePaths.push({
          path: path.join(__dirname + `/qrCodes/${csvRow.assetListingId}.png`),
          name: `${csvRow.assetListingId}.png`,
        });
      }

    } catch (error) {
      console.log(error);
    }
  }

  await zipdir(path.join(__dirname + `/qrCodes`), {
    saveTo: path.join(__dirname + `/${sameDay}.zip`),
  })

  file = path.join(__dirname + `/${sameDay}.zip`)

  // set disposition and send it.
  res.download(file, (err) => {
    if (err) {
      res.send('Error downloading zip file. Please try again.')
    }
    fs.unlinkSync(file)
    arrOfQrCodeImagePaths.forEach((qr) => fs.unlinkSync(qr.path))
  });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/../frontend/build/index.html')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Listeing on port ${PORT}`));
