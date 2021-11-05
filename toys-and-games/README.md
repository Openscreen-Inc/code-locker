## About

This web-based reference app built with ReactJS and Express demonstrates how to leverage  [Openscreen](https://www.openscreen.com)  and  [Openscreen's Node.js SDK](https://www.docs.openscreen.com) to create a trivia game application using QR codes. This app reference is a good starting point for seeing how an Openscreen application can be built.

Access to the source code should help you understand how to use the Openscreen's SDK methods to speed up your development.

### How it works

This sample app provides an example of how to use a QR Code scan counter to cycle a specific game through a series of questions. For example, a sports trivia category could be represented by a specific QR Code, and every time the code is scanned, the scan counter is increased by 1 triggering a different question. 

Here’s an example of the workflow:
* The game maker will create a website with a set of URLs that scan to various questions corresponding to the scan counter
* The game maker will use Openscreen to:
    * Create a QR Code that is tied to that question 
    * Direct the QR scan to the game URL
    * Pass scan counter data to the game to determine which question is shown

### Technology stack

-   [React](https://reactjs.org/)
-   [Chakra UI](https://chakra-ui.com/)
-   [Express](https://expressjs.com/)

## Features

-   Create dynamic QR Codes with Assets that store a library of trivia questions.
-   Create an interactive gaming application through the use of dynamic QR Codes.
-   Receive new trivia questions from a QR Code each time it is scanned. 

## Setup

### Requirements

-   [Node.js v10+](https://nodejs.org/en/download/)
-   NPM v6+ (comes installed with newer Node versions)

### Openscreen Account Settings

Openscreen Account Key: This information can be found on the  [Openscreen Dashboard](https://www.app.openscreen.com)

Openscreen Secret: This information can be found on the  [Openscreen Dashboard](https://www.app.openscreen.com)

Openscreen Project Id: You can find one once you have created a project on the  [Openscreen Dashboard](https://www.app.openscreen.com)


### Local Development

#### 1. Clone the repository

`$ git clone git@github.com:Openscreen-Inc/code-locker.git`

#### 2. Navigate to the Personalized Direct Mail App Folder

`$ cd trivia-game`

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


#### 5. Create your QR Codes  

Run this script to generate the three trivia QR Codes and save them locally as png files: 

`$ node backend/createQrCodes.js`

#### 6. Scan your QR code

Your app is finally ready to use! When you scan the QR Code you will be given a trivia question based on the theme of the QR Code that was scanned. Each time the QR Code is scanned, you will receive a new question from the trivia theme library. 
