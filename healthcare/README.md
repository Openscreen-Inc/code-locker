
## About

This Code Locker application is a proof of concept implementation
for a QR code use case in a healthcare setting. The scenario is outlined [here](https://docs.openscreen.com/docs/developer-portal/code-locker/health-care/)
on the [Openscreen developer documentation portal](https://docs.openscreen.com/docs/). 
It demonstrates a simple touchless fulfillment scenario for prescriptions.

 * A patient, called Lucy, is given a script from her doctor at her clinic.
 * The script has a QR code on it which gives allows her to "drop off" 
the prescription at a pharmacy.
 * She scans the QR code, enters her phone number to verify her identity, and then 
selects her pharmacy from a list associated with her records.
 * A link to the prescription is sent by text to her pharmacy and the pharmacist
clicks on the link to see the prescription and begin the fulfillment process.
 * Lucy receives a notification that her prescription is being fulfilled and
that she'll receive a notification when it's ready.
 * Once the pharmacist has Lucy's prescription ready, he clicks on a second link
provided in the original text to indicate that it's ready.
 * Lucy receives a text notification informing that the prescription is ready,
and a link that displays a QR code which that pharmacy can use to locate her information.
 * When she arrives at the pharmacy, she presents the QR code to the person at 
the pick-up counter who scans it and gives Lucy her medication, completing the
prescription fulfillment process.


### How it works

At the clinic office the prescription system uses Openscreen to:
* Store a digital copy of the prescription as an Asset in Openscreen
* To generate a QR code for the prescription
* To associated Lucy's contact information with the Asset
* To associated the list of Lucy's usual pharmacies with the Asset
* To generate a QR code that Lucy will present to the pharmacy when she picks up
her drugs.

All of the data surrounding the workflow is associated with the Asset in Openscreen.

When either of the QR codes is scanned, Openscreen launches the client app
and the client app is able to access the data for the transaction and also 
update the state of the asset.

The clients app sends messages directly to the participants using Openscreen 
and providing links to trigger the next steps.

Openscreen tracks scans and manages the Asset state.

### Technology stack

This app is build entirely with JavaScript both and has two parts.

A command line `new-prescription` command that generates the fictitious prescription
and a small set of cloud services implemented as AWS API Gateway lambdas
and deployed using [Serveless](https://www.serverless.com/framework/docs/getting-started)

That's it. The mobile "app" part of the application is a single HTML page that 
processes the acceptance of the prescription by Lucy.
The other interactions happen through text messages, links, and QR codes.

## Setup

To get ready to run the app and do the demo 

### Requirements

-   [Node.js v14+](https://nodejs.org/en/download/)
-   NPM v6+ (comes installed with newer Node versions)
-   [Severless v3.7.1+](https://www.serverless.com/framework/docs/getting-started)

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

#### 5. Create a Prescription

With your Openscreen credentials setup in your `.env` file we can now create our first 
Prescription and the QR codes associated with that.

`$ ./scripts/set-up

Set-up create SMS templates used to send text messages to the patient and pharmacist and 
adds the contact information of the various actors in the scenario.

It uploads a prescription document associated with the prescription and generates two QR codes,
one for the patient, and the other for the pharmacist.

#### 7. Start your backend

You're now ready to deploy your Serverless backend and start using Openscreen to keep track of your soil bag workflows. 

Run the following script to deploy your API:

`$ sls deploy`

#### 8. Test your app

