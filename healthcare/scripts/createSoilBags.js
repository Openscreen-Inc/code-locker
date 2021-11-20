require('dotenv').config();
const { Openscreen } = require('@openscreen/sdk');

// After starting your tunnel and running `npm run getTunnel`
//   tunnels.json will have your ngrok url
const { tunnels } = require('../tunnels.json')

const frontendUrl = tunnels ? tunnels.find(tunnel => tunnel.public_url.includes('https:')).public_url : null

if(!frontendUrl) throw 'Please start your Ngrok tunnel and run `npm run getTunnel` before running this script'

const os = new Openscreen().config({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
});

// create your Assets and QR codes
async function createAssetAndQr() {
  const { asset } = await os
    .project(process.env.PROJECT_ID)
    .assets()
    .create(
      {
        name: 'Soil Bag 2',
        description: 'Second Soil Bag',
        customAttributes: {
          soilSampleId: '123',
          batchId: '123',
        },
        qrCodes: [
          {
            intentType: 'DYNAMIC_REDIRECT_TO_APP',
            intent: `${frontendUrl}/bag`, // pass in your local tunnel url
          },
        ],
      },
    );

  console.log('ASSET', asset)

  for (let qrCode of asset.qrCodes) {
    const qrCodeResponse = await os.qrCode(qrCode.qrCodeId).get({ format: 'png' })
    console.log('QR CODE', qrCodeResponse)
    await os.saveQrImageDataToFile(qrCodeResponse, `${qrCode.qrCodeId}.png`); // QRCodes will be saved locally
  }
}

createAssetAndQr();
