'use strict';
const { Openscreen } = require("@openscreen/sdk");
require('dotenv').config();
const os = new Openscreen().config({key: process.env.OS_API_KEY, secret: process.env.OS_API_SECRET});

// Input the project ID that you received in the Openscreen dashboard as a string, your project ID should look similar to the one provided below
const projectId = '0e871998-2d05-4e57-a0fe-140a86925ce6';


module.exports.handler = async (event) => {
    // Get scan id from params and firstName, lastName, mobileNumber from body
    const scanId = event.pathParameters.id;
    const {firstName, lastName, mobileNumber} = JSON.parse(event.body);
    console.log({scanId})
    console.log({
        firstName,
        lastName,
        mobileNumber
    })
    // Get Scanned object
    const scan = await os.scan(scanId).get();
    const assetId = scan.asset.assetId;
    try {
        let contactId;
        try {
            // get contact of this project by the phoneNumber
            const contactsObjPhone = await os.project(projectId).contacts().get({ phone: mobileNumber });
            if (contactsObjPhone.contacts) {
                console.log(`Contact already exists.`);
                console.log(JSON.stringify(contactsObjPhone.contacts,2));
                contactId = contactsObjPhone.contacts[0].contactId;
                console.log({contactId})
            }
        } catch (e) {
            console.error('Inside:', e); // catch 404 error i.e. contact 'DOES_NOT_EXIST'
            // if contact does not exist, create one
            const response = await os.scan(scanId).contacts().create({
                firstName,
                lastName,
                cellPhone: mobileNumber,
            })
            contactId = response.contact.contactId;
        }
        // link the contact with the asset with OWNER tag annd send an sms
        await os.asset(assetId).contact(contactId).link({type:'OWNER'});
        const sms = await os.scan(scanId).sms().create({
            smsTemplateName: "firstTemplate",
            // Input the phone number tied to the contact you created
            to: mobileNumber,
        })



        const contact = await os.contact(contactId).get()
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(
                {
                    message: 'Owner assigned successfully!',
                    contact,
                },
                null,
                2
            ),
        };
    }   catch(error){
    console.log({error});
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(
                {
                    message: 'Owner assignment failed!',
                },
                null,
                2
            ),
        };
    }

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
