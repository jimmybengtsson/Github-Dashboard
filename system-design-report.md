# System Design Report

**Jimmy Bengtsson - jb223pu - 1dv612 - Web Application Architectures and Frameworks**


## 1. Introduction


### 1.1 Scope

The purpose of this system design report is to translate the requirements and processes into a technical design that will be used to develop the application.

### 1.2 System Introduction

The application will act as a notification-hub and dashboard for a users different Github organizations.
A user can list commits and releases for selected organizations and choose which ones he want to receive notifications from. So if an event occurs in any of the pre-selected organizations, the user will be notified.

If the user revisit the application, all new events on users Github-account since last visit will be presented.

If there is time to do it, I will also add some additional features, for example extra services to receive events from and more notification possibilities.


## 2. System Overview


### 2.1 Client

The client application will be deployed to Digital Ocean and will be built on the React-framework. 
When using React, handling navigation gets really simple with the help of state-handling. In React it is also easy to create components that can be reusable which gives me a consistent look and feel throughout the application and code-reuse (DRY) makes it easier to develop and maintain the application.
React also includes some great developer tools that can be installed as Chrome-extensions to facilitate the development.

**Risks:**

  * **Handling navigation with state -** If the user click on the browsers back-button he will exit the application. If this becomes a problem, routes will be added to handle the applications navigation.

### 2.2 Server

The server will be deployed and running on Firebase Cloud Functions. Functions as a Service (FaaS) as Firebase Functions are small server containers that handles scaling automatically, it therefore makes it ideal to host an API without having the knowledge of load balancing and only has to pay for the actual times the server is being used.

The server-application will running different functions on the Firebase Functions service. Firebase Functions makes it easy to handle requests from Github-webhooks and middlewares like Cors are built into the service which makes the server safer.


**Risks:**

  * Applications deployed to FaaS are often put to sleep when they're not being used. It can take up to 10 seconds before it starts running again. How will webhooks from Github be handled when a new event occur?
  
![System overview](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/systemNew.png)

## 3. Database design

All database-handling in the application will be handled with Firebase Database-service.

A user can be created with entities like, id, username. Settings for Github-teams will be saved as false and true. So if a user is signing in to Github through the application, users Github-data will be saved. He can then select which commits and releases that will generate webhooks in the application. Settings for each organisation and repo is saved as false by default.

![Database](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/databaseNew.png)

## 4. User Interface

Despite the large options available for creating components and more with React, a Material-ui library will be included. I believe the simplicity and look of Material-UI fits well with the design approach I’ve decided for the application.

**Dashboard**

![Dashboard](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/web-mockup.png)


**Github**

![Github](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/web-mockup-github.png)


**Settings**

![Settings](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/web-mockup-settings-github.png)



For each service the user adds, a new link will be added in the menu.

![Add menu](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/add-webhook.png)


## 5. Detailed design


### 5.1 Client

![Client](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/clientNew.png)

  * **App -** When a user enters the application it will check if a token is stored in the local storage. If it isn't the user will be asked to navigate to settings. If local storage contains a token it will be validated with the server and the user will be redirected to either the dashboard or asked to visit settings-page based on validity of the token. The App's state will be updated to signedIn when valid token is included.

 * **SettingsView -** The user can choose to sign in to Github and when signed in the user can navigate through organizations and set settings for Githubs-webhooks.
When chosing to sign in with Github, a popup will appear which asks the user to sign in. If the user is authorized an OAuth-token will be assigned and all available settings will show. This OAuth-token will be used for all requests to Github. A token for Firebase is also assigned but is handled by the Firebase-module.
The user can also choose to receive notifications to a Hue-server. When choosing this, a dialog with text-input for a server-url will appear. Users input will be saved to database so it is accessible for Firebase Functions when it receives a new webhook-request from Github.

  * **Github -** Will render if the App's state is signedIn and pageNavigation is set to Github. Renders a component for each organization and repository that is available for the authenticated user. All the latest commit, issues and releases are shown for each repo. If there is any new events since last time signed in, this will be shown in separate view.

  * **Dashboard -** Doing the same as Github-page but shows information about users own repositories.

### 5.2 Server

![Server](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/serverNew.png)

All server authentication and authorization is handled with Firebase Admin SDK.

  * **App -** Will initiate listen for incoming requests and forward them to Webhooks-module.

  * **Webhook -** Comparing incoming webhooks with users in database. If match all available notifications for the user will be checked and forwarded to Notification.module.
  
  * **Notification -** Will handle sending of notifications when a webhook is received.


### 5.3 Webhooks

When a user is signing in to Github through the application, a connection between Github and the application will be established and kept open to deliver new events occurring on Github.

**Extra:** Adding webhooks to other services like Slack if there is time.

### 5.4 Notifications

**Philips Hue API:**

The main plan for handling notifications in the application is to let a Philips Hue-Lamp in my house flash when a new notification is received. However at the time of writing this, the so called External Philips Hue API isn’t available to the public. They only provide a API that can handle lamps on an internal network.
I have applied for a key to use the externa API but haven't received any answer yet. So further down I present some alternate scenarios for handling notifications. 

If I don’t receive any credentials to use the external Philips Hue API I present two alternate scenarios for handling notifications.

**Alternative 1 - Service Worker:**

A service worker is registered when a user is using the application and sends notifications to the users browser.

**Alternative 2 - Connect to an Raspberry Pi on my network using the the Internal Philips Hue API:**

Creating a small server who’s running on a Raspberry Pi and acts as a ”middleman” to use the local Philips Hue API at my home. But one big issue by doing so is that it will only be available for me or for anyone using a Raspberry Pi with the same server controlling the local Philips Hue API. 

### 5.5 Authentication / Authorization

All authentication and authorization will be handled through and with help from Firebase with a JSON Web Token (JWT).  When the user is signing in to the application, a token is assigned for the user and saved in clients local storage together with a token for Github. 
That token has to be included in the header for requests made from client to server that needs authorization. 
If a token is already stored in clients local storage, it will be validated to see if it is still valid. If it isn’t the user will be asked to sign in again.

## 6. External systems

* **Firebase API & SDK -** All authentication and database-handling will be handled through Firebase.

  * **Github API -** All data from Github such as receiving webhooks and retrieving users organizations will be handled with help by the API provided from GitHub.

  * **Philips Hue Server -** Notifications will be sent to a server to let a light flash in my home when a new notification is received.

  * **Philips Hue API -** Notifications will be sent to the API to let a light flash in my home when a new notification is received.