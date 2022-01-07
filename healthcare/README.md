
## About

This web-based reference app built in ReactJS and Serverless demonstrates how to leverage
[Openscreen](https://www.openscreen.com) and 
[Openscreen's Node.js SDK](https://www.docs.openscreen.com) to create a healthcare
app that provides touchless prescriptions.
 
Using QR codes and SMS, this app demonstrates a secure flow for a patient to
receive a prescription and transfer it to a pharmacy without complicated forms, web interfaces,
or physical touch.

This app reference is a good starting point for seeing how an Openscreen application can be built.

Access to the source code should help you understand how to use the Openscreen's Assets, 
QR Codes, Contacts and SMS templates to speed up your development.

### How it works

### Technology stack

-   [React](https://reactjs.org/)
-   [Chakra UI](https://chakra-ui.com/)
-   [Serveless](https://www.serverless.com/framework/docs/getting-started)

## Features

## Setup

### Requirements

-   [Node.js v14+](https://nodejs.org/en/download/)
-   NPM v6+ (comes installed with newer Node versions)
-   [Severless v2.64.1+](https://www.serverless.com/framework/docs/getting-started)

### Openscreen API Key

You generate your API key using the [Openscreen Dashboard](https://www.app.openscreen.com).
Check out the "let's get started with Openscreen" section on your Dashboard when you
have your first account, or create a new account.

The key and secret are displayed in the API Key section of the dashboard.
Be sure to save the Secret at the time that you generate it.
You will not be able to view the secret again and if you forget it you 
will need to regenerate the secret.

#### Project Id

You can find the project id once you have created a project on the [Openscreen Dashboard](https://www.app.openscreen.com)

### Local Development

#### 1. Clone the repository

`$ git clone git@github.com:openscreen-tv/code-locker.git`

#### 2. Navigate to the App

`$ cd healthcare`

#### 3. Install Dependencies in all the sub-component directories:

From the `scripts` directory run:
`$ npm install`

From the `api` directory run:
`$ npm install`

From the `client` directory run:
`$ npm install`

This application uses Openscreen credentials to create and modify your Openscreen Assets, Contacts and QR Codes. Create a  `.env` file and add the following parameters:

```
OS_KEY="XXXXXXX-XXXXXXXX"
OS_SECRET="XXXXXXXXX-XXXXXXXX"
OS_DEBUG="REQUEST,RESPONSE,ERROR"
PROJECT_ID="XXXXXXXXX"
```

#### 4. Start your React App

You will need to start your React app server and expose the ReactJS application via  [ngrok](https://ngrok.com/). An ngrok server is required so that Openscreen can locate your local server and forward scanners to your app. Before using this app you will need to [download ngrok](https://ngrok.com/download) then run the followng commands:

Start your local react server on your client
`$ npm start --prefix=client`

Start an Ngrok tunnel on to your localhost:3000
`$  ~/ngrok http 3000`

We'll need to save your current tunnel url and pass it into the QR Code that we create. You can do that by running:
`$  npm run getTunnel`

#### 5. Create a p

With your Openscreen credentials setup in your `.env` file we can now create our first Soil Bag and QR Code.

`$ ./scripts/set-up

Once this script runs you will see a created Asset object logged in your console, you will also see a created QR Code logged. This QR Code will be saved locally in the soilBagApp directory. Open the file and you will see your first QR code! (Keep this QR since we will need it later).

Now that our Asset and QR Code has been created, we will create the contacts needed to make our app work. We need the following Contacts for this use case:

- Farmer
	- The farmer who owns the land that the soild will be collected from
- Agronomist
	- The agronomist who will collect the soil sample from the field
- Lab Technician
	- The technician who will inspect the soil once it reaches the lab
- Validator
	- A carbon validator who will validate the carbon levels reported

Run this script to create the above contacts in Openscreen:
 `$ node scripts/createContacts.js`

#### 6. Create Your SMS Templates with a Script

The next step is to add our SMS templates to our Project. SMS Templates can easily be used to send SMS messages and notifications to Contacts in your app:

Run this script to add these templates to your project:

`$ node backend/createSmsTemplates.js`

#### 7. Start your backend

You're now ready to deploy your Serverless backend and start using Openscreen to keep track of your soil bag workflows. 

Run the following script to deploy your API:

`$ sls deploy`

#### 8. Scan your QR code

Your app is finally ready to use! Scan the QR code that you created before and start the chain of custody process. If you complete a step then scan the QR again, you will see that the app moved onto the next step of the process.

You will receive SMS notifications for each step that is completed so make sure you use your real phone number when creating Contacts.
