const { Openscreen } = require("@openscreen/sdk");
require('dotenv').config();
const os = new Openscreen().config({key: process.env.OS_API_KEY, secret: process.env.OS_API_SECRET});

// Input the project ID that you received in the Openscreen dashboard as a string/in .env
const projectId = process.env.OS_PROJECT_ID;
async function main(){

    // Create an asset for a new listing product LV-Premium Luggage Set 01 with id = P635271-05
    const res = await os.project(projectId).assets().create({
        name: 'LV-Premium Luggage Set 01',
        description: 'Premium Luggage Set by LV',
        customAttributes: {
            uniqueItemNumber: 'P635271-05'
        },
        qrCodes: [
            {
                intentType: 'DYNAMIC_REDIRECT_TO_APP',
                intent: `https://${process.env.SUBDOMAIN}.loca.lt/id`, // pass in your local tunnel url
            },
        ],
    });

    // Returns a scannable QR Code
    const { qrCodeId } = res.asset.qrCodes[0];
    const qrCode = await os.qrCode(qrCodeId).get({format: 'png'})
    // Save your qr code locally
    await os.saveQrImageDataToFile(qrCode, 'LV-Premium Luggage Set 01_5.png');

    // View the new asset that you have created
    console.log('Asset:', JSON.stringify(res, '',2));
    // Register an SMS template with the asset
    const smsTemplate = await os.project(projectId).smsTemplates().create({
        body: "Congratulations, your Designer Co. {{asset.name}} {{asset.customAttributes.uniqueItemNumber}} has been registered with us.",
        smsTemplateName: "firstTemplate"
    });

    console.log('created smsTemplate:', smsTemplate)

}

main().catch((err) => {
    console.error(err);
});