## About

This web-based reference app built with ReactJS and Express demonstrates how to leverage  [Openscreen](https://www.openscreen.com)  and  [Openscreen's Node.js SDK](https://www.docs.openscreen.com) to create a realestate direct mail app using QR codes. This app reference is a good starting point for seeing how an Openscreen application can be built.

Access to the source code should help you understand how to use the Openscreen's SDK methods to speed up your development.

### How it works

This reference app allows you to upload .csv file of contacts and create dynamic QR codes for direct mail marketing!

Once you upload your .csv file, the application will start communicating with the Openscreen Platform to create contacts and generate a downloadable .zip file with dynamic and personalized QR codes, each labelled with its respective assetListingId as noted in the uploaded .csv file. Whenever a QR code is scanned, the application UI will populate the direct mail address and prompt the customer to confirm their contact details and share their consent choice. 

### Technology stack

-   [React](https://reactjs.org/)
-   [Chakra UI](https://chakra-ui.com/)
-   [Express](https://expressjs.com/)

## Features

-   Create a downloadable .zip file of QR Codes that redirect to your app.
-   Engage customers and update their contact details based on scan information.

## Setup

### Requirements

-   [Node.js v10+](https://nodejs.org/en/download/)
-   NPM v6+ (comes installed with newer Node versions)

### Openscreen Account Settings

Openscreen Account Key: This information can be found on the [Openscreen Dashboard](https://app.openscreen.com/signin)

Openscreen Secret: This information can be found on the [Openscreen Dashboard](https://app.openscreen.com/signin)

Openscreen Project Id: You can find one once you have created a project on the [Openscreen Dashboard](https://app.openscreen.com/signin)

Openscreen .csv contacts template: You can find it in this repo as an empty file 'csv-template.csv'. You will find the following row headings in the .csv file which are all required. Please do not alter them.

* assetListingId
* assetName
* assetDescription
* assetLocation
* firstName
* lastName
* emailAddress
* url
* consentedAt
* consented
* address
* city
* provinceOrState
* country
* postalOrZip
* cellPhone
* state

### Local Development

#### 1. Clone the repository

`$ git clone git@github.com:Openscreen-Inc/code-locker.git`

#### 2. Navigate to the Personalized Direct Mail App Folder

`$ cd personalized-direct-mail`

#### 3. Install Dependencies

`$ npm install --prefix=backend && npm install --prefix=frontend`

This application uses Openscreen credentials to create and modify your Openscreen contacts, assets, and tokens (i.e. unique QR codes with state that redirect to your app). Create a  `.env` file and add the following parameters:

```
OPENSCREEN_KEY="XXXXXXX-XXXXXXXX"
OPENSCREEN_SECRET="XXXXXXXXX-XXXXXXXX"
NGROK_URL="https://YOUR_APP.ngrok.io" // you will change this in the next step
```

#### 4. Start your React App

You will need to start your React app server and expose the ReactJS application via  [ngrok](https://ngrok.com/). An ngrok server is required so that Openscreen can locate your local server and forward scanners to your app. Before using this app you will need to [download ngrok](https://ngrok.com/download) then run the following commands:

`$ npm run build --prefix=frontend && ~/ngrok http 3000`

Once your app is started, you will need to replace the Ngrok url in your `.env` file `NGROK_URL="https://YOUR_APP.ngrok.io"` with the one provided in your terminal.

#### 5. Start your backend

You're now ready to start your Node.JS server and start using Openscreen to upload contacts and mass generate dynamic QR Codes. 

Run the following script to start your server:

`$ npm start --prefix=backend`

#### 6. Upload your .csv file 

Open your browser and enter one of the following addresses: `localhost:3000` or `https://YOUR_APP.ngrok.io`. If everything is setup correctly, then you will see the following realestate app UI. Either drag and drop your .csv file of contacts into the designated area or simply initiate upload by clicking on the designated area in the UI.  

<img width="1042" alt="Screen Shot 2021-10-15 at 1 39 27 PM" src="https://user-images.githubusercontent.com/5770541/137529940-9e26f22b-c83a-4050-a8d9-a64516696b14.png">

Click 'Submit' and please wait approximately 30 seconds (for a file of 30 contacts) while Openscreen's SDK works its magic to create a downloadable file with base64 dynamic and personalized QR Codes.

#### 7. Scan your QR code

Your app is finally ready to use! Unzip your downloaded zipped file with QR code images and give it a go. When your customers' scan their QR code, they will be redirected to your website's contact form where they can update their contact details and share their consent choice.