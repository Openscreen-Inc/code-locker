
## About

This web-based reference app built in ReactJS and Serverless demonstrates how to leverage  [Openscreen](https://www.openscreen.com)  and  [Openscreen's Node.js SDK](https://www.docs.openscreen.com)  to create a chain of custody app using QR codes and SMS to transfer keep track of physical goods. This app reference is a good starting point for seeing how an Openscreen application can be built.

Access to the source code should help you understand how to use the Openscreen's Assets, QR Codes, Contacts and SMS templates to speed up your development.

### How it works

Keeping a ‘digital tab’ on physical goods as they move through a customer, product or other lifecycle can be critical, especially when stakeholders need to know the custodian of a specific item. Chain of custody applications help to make sure the right product, is in the right hands, and that there is an auditable trail of transfer of custody as physical items move from one owner to another.

This sample app provides an example of how to use QR Codes to track the chain of custody for a sensitive item. It also shows how the state or context of the item can be reflected by the workflow triggered by the QR Code. In this example, unique QR Codes are placed on soil collection bags, used to collect soil which is sent to labs for quality and composition testing.  
  
The first time the QR Code is scanned, a chain of custody workflow is **_initiated_**  based on the scan counter going from zero to one. From there, scanning the QR Code will allow the owner to register or transfer custody as the soil sample moves from soil collector, to laboratory, to data management system.

Here’s an example of the workflow:

-   The soil collection firm auto-generates a number of QR Codes to be placed on, and to correspond with unique soil sample bags.
-   The QR Code will be defined with an intent workflow that works as follows:

	-   Upon the first scan of the QR, the soil collector can ‘register’ the sample as collected by entering field notes into the soil collection portal. Additional scan data such as time and location, are also captured and stored
	-   Upon subsequent scans, as the original soil data has been collected and stored, only a custody transfer workflow will be undertaken. For example, after the sample is collected and sent to the lab, the lab technician can scan the QR Code. Openscreen, recognizing the scan count is > 1, will direct the scanner to a chain of custody registry, rather than to the soil collection portal.

By tying QR Codes to items moving from place to place in a value chain lifecycle, systems can keep track not only of who the current custodian of the application is, but also of the provenance, or past chain of custody of the item.

### Technology stack

-   [React](https://reactjs.org/)
-   [Chakra UI](https://chakra-ui.com/)
-   [Serveless](https://www.serverless.com/framework/docs/getting-started)

## Features

-   Create Assets (Soil Bags) and QR Codes (Unique QR Codes with state that redirect to your app).
-   Confirm completed steps using Openscreen SMS templates.
-   Create contacts on Assets (Soil Bags).
-   Update app UI based on Scan information or Asset State.
-   Keep track of the chain of custody for a specific soild bag and the Contacts who have interacted with it.

## Setup

### Requirements

-   [Node.js v10+](https://nodejs.org/en/download/)
-   NPM v6+ (comes installed with newer Node versions)
-   [Severless v2.64.1+](https://www.serverless.com/framework/docs/getting-started)

### Openscreen Account Settings

Account Key

Openscreen Account Key. This information can be found on the  [Openscreen Dashboard](https://www.app.openscreen.com)

Openscreen Secret

Openscreen Secret. This information can be found on the  [Openscreen Dashboard](https://www.app.openscreen.com)

Project Id

An Openscreen Project Id. You can find one once you have created a project on  the  [Openscreen Dashboard](https://www.app.openscreen.com)

### Local Development

#### 1. Clone the repository

`$ git clone git@github.com:openscreen-tv/code-locker.git`

#### 2. Navigate to the Soil Bag App

`$ cd soilBagApp`

#### 3. Install Dependencies

From the `code-locker/soilBagApp` directory run:
`$ npm install`

This application uses Openscreen credentials to create and modify your Openscreen Assets, Contacts and QR Codes. Create a  `.env` file and add the following parameters:

```
OPENSCREEN_KEY="XXXXXXX-XXXXXXXX"
OPENSCREEN_SECRET="XXXXXXXXX-XXXXXXXX"
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

#### 5. Create Your Soil Bag and Contacts

With your Openscreen credentials setup in your `.env` file we can now create our first Soil Bag and QR Code.

`$ node scripts/createSoilBags.js`

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