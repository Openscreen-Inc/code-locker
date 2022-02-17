# Consumer Packaging

> Additionnal information regarding this sample application can be found in the
> [Code Locker][LOCKER] section of the Openscreen [documentation][DOCS]. Please note that
> these sample applications are for demonstration purposes only and should not
> be used in protection applications.

This web-based reference app built in Next.js demonstrates how to leverage Openscreen and Openscreen's Node.js SDK to create a consumer packaging app using QR codes to redirect customers to product information sites and track their engagement. This app reference is a good starting point for seeing how an Openscreen application can be built.

## Requirements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker][DOCKER]

## Installing / Getting started

First, checkout the repository to your workspace.

```bash
git clone https://github.com/freddyshim/openscreen-consumer-packaging.git
cd openscreen-consumer-packaging
```

### Docker Setup

This project uses [Docker][DOCKER] to containerize the application for development and production environments. Make sure that you have Docker installed and running on your system. When deploying the production build, you will need a Docker Hub account.

### Openscreen Setup

Create an Openscreen account if you have not done so. Once your account is created, generate a new project and obtain the following keys:

**API Key:** The API key associated with your account

**API Secret:** Your account secret key

**Project Id:** The ID of the project you wish to use for this sample application

### ngrok Setup

In order to generate QR codes that redirect to our web app in a local environment, we must expose our app to a public domain via [ngrok](https://ngrok.com). Once you have ngrok downloaded and set up, run the following command:

```bash
ngrok http 80
```

If successful, ngrok should create a **Public URL** that allows public access to your local web app.

### Create Environment Variables

Create a **.env** file with the following contents at the root directory of the workspace. Replace the bracketed values (along with the brackets) with the generated values from earlier.

```
OS_API_KEY={API Key}
OS_API_SECRET={API Secret}
PROJECT_ID={Project Id}
PUBLIC_URL={Public URL}
```

## Run Development Build

Run the following command to run our application at http://localhost:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

The application is now running and will hot reload on any changes to the source files.

## Deploy to Production

Create a **.env.prod** file that holds your production keys. The keys are the same as the ones in **.env**. Change the key values to ones that you have set up for your production environment (eg. the PUBLIC_URL key should be changed to the public domain on which you want to host the app).

From the root directory, build the app and proxy image and push them to their own Docker Hub repositories. Make sure to replace the bracketed values with your Docker Hub credentials.

```bash
docker build -t {Docker Hub id}/os-packaging-app .
docker build -t {Docker Hub id}/os-packaging-proxy ./proxy
docker push {Docker Hub id}/os-packaging-app
docker push {Docker Hub id}/os-packaging-proxy
```

Your production images are now saved on Docker Hub. You can now run the included **docker-compose.yml** file on the production server to build and run the production build of this project.

```
docker-compose up --build
```

PS. Make sure to change the bracketed values in **docker-compose.yml** to your Docker Hub ID!

## Links

[Openscreen website][OPENSCREEN]
[Developer Documentation][DOCS]
[JavaScript SDK][SDK]
[Additional Examples and Use Cases][LOCKER]

[OPENSCREEN]: https://www.openscreen.com
[DASH]: https://www.app.openscreen.com
[SDK]: https://github.com/openscreen-tv/openscreen-sdk
[LOCKER]: https://docs.openscreen.com/docs/developer-portal/code-locker/overview
[DOCS]: https://docs.openscreen.com/docs
[DOCKER]: https://docker.com
