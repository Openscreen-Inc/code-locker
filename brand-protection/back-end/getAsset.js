'use strict';
const { Openscreen } = require("@openscreen/sdk");
require('dotenv').config();
const os = new Openscreen().config({key: process.env.OS_API_KEY, secret: process.env.OS_API_SECRET});


module.exports.handler = async (event) => {
    try {
        const scanId = event.pathParameters.id;
        console.log({scanId})
        // Get Scan Object from scanId
        const response = await os.scan(scanId).get()
        if (response.error) {
            // return error if any
            console.log(JSON.stringify(response.error, 2))
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(
                    {
                        message: 'Wrong scanId!',
                        scanId,
                        error: JSON.stringify(response.error, 2),
                    },
                    null,
                    2
                ),
            };
        }
        console.log(response);
        // get the contacts of this asset
        const res = await os.asset(response.asset.assetId).contacts().get();
        let contact;
        // if number of contacts is 0, then contact is null
        if (res.numberOfContacts == 0) contact = null;
        // else set contact as the last element of the list
        else contact = res.contacts[res.contacts.length - 1];
        console.log({res});
        // return the scanned asset and its contact if any
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(
                {
                    message: 'Go Serverless v1.0! Your function executed successfully!',
                    asset: response.asset,
                    contact,
                },
                null,
                2
            ),
        };
    }
    catch(error){
        console.log(JSON.stringify(error,2));
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
        }
    }
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
