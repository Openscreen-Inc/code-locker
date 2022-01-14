# Brand Protection

> Additionnal information regarding this example and other sample applications
> can be found in the [Code Locker][LOCKER] section of the developer [documentation][DOCS].
> Please note that these sample applications are for demonstration purposes only
> and should not be used in production applications.

This web-based reference app built in ReactJS and Serverless demonstrates how to leverage  [Openscreen](https://www.openscreen.com)  and  [Openscreen's Node.js SDK](https://www.docs.openscreen.com)  to create a brand protection app using QR codes and SMS to register and get the information of the product scanned. This app reference is a good starting point for seeing how an Openscreen application can be built.

Access to the source code should help you understand how to use the Openscreen's Assets, QR Codes, Contacts and SMS templates to speed up your development.

## Requirements

- React
- Serverless
- Localtunnel
- Openscreen SDK

## Installing / Getting started

After putting your environment variables in the `.env` in brand-protection/back-end and brand-protection/front-end

```bash
git clone https://github.com/Openscreen-Inc/code-locker.git
cd brand-protection/back-end
npm install
cd ../front-end
npm install
```



### Initial Configuration

The following configuration values can be found after you've created an account
and signed into your Openscreen [dashboard][DASH].

**API Key:** The API key associatedrelated to your account

**API Secret:** Your account secret key

**Project Id:** The ID of the project you wish to use for this sample application.

**Sub Domain name** This is the subdomain string name that is passed on to localtunnel while tunneling localhost to a public domain.
Put these values in the `.env` file. For reference, `.env.example` is added where an `.env` is expected.


#### Start your React App

You will need to start your React app server and expose the ReactJS application via  [localtunnel](https://github.com/localtunnel/localtunnel). A public server is required so that Openscreen can locate your local server and forward scanners to your app. Before using this app you will need to [install localtunnel](https://ngrok.com/download) then run the followng commands:

Start your local react server on your client
`npm run start`

Tunnel your localhost:3000 to the subdomain
`node server.js`



### Deploying Backend on AWS Lambda

You're now ready to deploy your Serverless backend and start using Openscreen to keep track of your soil bag workflows.

Run the following script to deploy your API:

```bash
cd ../back-end
sls deploy
```



### Creating your Product's QR code and a SMS template
With your Openscreen credentials setup in your `.env` file we can now create our first Brand Product and QR Code.

`node initScript.js`

Once this script runs you will see a created Asset object logged in your console, you will also see a created QR Code logged. This QR Code will be saved locally in the back-end directory. Open the file and you will see your first QR code! (Keep this QR since we will need it later).

Now that our Asset and QR Code has been created, we scan the QR code and register ourselves as an owner of the product! 


### Scan your QR Code
Your app is finally ready to use! Scan the QR code that you created before and start the registering process. If you complete the form then scan the QR again, you will see that the app moved onto showing your name as the owner of the product.

You will receive SMS notifications for the first time, that is when you are registered as an owner .


## Links

[Openscreen website][Openscreen]

[Developer Documentation][DOCS]

[JavaScript SDK][SDK]

[Additional Examples and Use Cases][LOCKER]

[Openscreen]: https://www.openscreen.com
[DASH]: https://www.app.openscreen.com
[SDK]: https://github.com/openscreen-tv/openscreen-sdk
[LOCKER]: https://docs.openscreen.com/docs/developer-portal/node-sdk/code-locker/overview/
[DOCS]: https://docs.openscreen.com/docs/
