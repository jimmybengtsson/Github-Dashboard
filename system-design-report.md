# System Design Report

**Jimmy Bengtsson - jb223pu - 1dv612 - Web Application Architectures and Frameworks**


## 1. Introduction


### 1.1 Scope

The purpose of this system design report is to translate the requirements and processes into a technical design that will be used to develop the application.

### 1.2 System Introduction

The application will act as notification-hub and dashboard for a users different Github organizations.
A user can list commits and releases for selected organizations and choose which ones he want to receive notifications from. So if an event occurs in any of the pre-selected organizations, the user will be notified.

If the user exit the application, all new events on users Github-account since last visit will be presented.

If there is time to it, I will also add some extra features like adding extra services that the user can receive events from and more possibilities for notifications.


## 2. System Overview


### 2.1 Client

The client application will be deployed to Digital Ocean and will be built on the React-framework. 
When using React, handling navigation get really simple with the help of state-handling. In React it is also easy to create components that can be reusable which gives me a consistent look and feel throughout the application and code-reuse (DRY) makes it easier to develop and maintain the application.
React also includes some great developer tools that can be installed as Chrome-extensions to facilitate the development.

**Risks:**

  * **Handling navigation with state -** If the user click on the browsers back-button he will exit the application. I this becomes a problem, routes will be added to handle the applications navigation.

### 2.2 Server

The server will be deployed and running on Firebase Cloud Functions. Functions as a Service (FaaS) as Firebase Functions are small server containers that handles scaling automatically which makes it ideal to host an API without having the knowledge of load balancing and only has to pay for the actual times the server is being used.

The server-application will be based on Express instead of only running different functions on the cloud-service. By adding Express, middleware’s can be added and used with ease in the application. 


**Risks:**

  * Applications deployed to FaaS are often put to sleep when they're not being used. It can take up to 10 seconds before it starts running again. How will webhooks from Github be handled when a new event occur?
  
![System overview](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/system-overview.png)

## 3. Database design

All database-handling in the application will be handled with Firebase Database-service.

A User can be created with entities like, id, username, password hashed with bcrypt and more. Settings for Github-teams will be saved as false and true. So if a user is signing in to Github through the application, a token that is hashed with Bcrypt is saved. He can then select which commits and releases that will be reported in the application. Settings for each team and repo is saved as false by default.

![Database](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/database.png)

## 4. User Interface

Despite the large options available for creating components and more with React, a bootstrap-library will be included. I believe the simplicity and look of Twitter’s bootstrap fits well with the design approach I’ve decided for the application.

**Dashboard**

![Dashboard](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/web-mockup.png)


**Github**

![Github](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/web-mockup-github.png)


**Settings**

![Settings](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/web-mockup-settings-github.png)



For each service the user is adding a new link will be added in menu.

![Add menu](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/add-webhook.png)


## 5. Detailed design


### 5.1 Client

![Client](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/client.png)

  * **App -** When a user enters the application it will check if a token is tored in the local storage. If it isn't the user will be redirected to the sign in page. If local storage contains a token it will be validated with the server and the user will be redirected to either the dashboard or sign in page based on validity of token. The App's state will be updated to signedIn.
  
  * **LoginView -** Users input will be compared with servers data. If correct a autho-token will be assigned and saved in local storage and the user will be redirected to dashboard.
  
  * **RegisterView -** Users input will be saved as a user-object and sent to server. A autho-token will be assigned and saved in local storage and the user will be redirected to settings.
  
  * **JWTAuth -** Is acting as a middleman between client and server where all requests who requires authorization is being handled.
  
  * **User -** Creates a new user to be sent to the server. Will also update users settings.
  
  * **DashboardView -** Start page of the application if the App's state is signedIn. Representing a summary with data from all services the user has signed in to and set to show in settings.
  
  * **SettingsView -** Start page if App's state is signedIn but the user has not signed in to any service or set any data to show.
  
  * **WebhookView -** Will render if the App's state is signedIn and pageNavigation is set to Webhook. A component for each service signed in to will be rendered where information from actual service will be shown.

### 5.2 Server

![Server](https://github.com/1dv612/jb223pu-examination/raw/master/wiki-img/server.png)

  * **App -** Will initiate Express server and add middlewares.

  * **Routes -** Will handle and forward all incoming requests to the controllers.
  
  * **Autho -** Will handle all authentication such as create, delete or update an user.
  
  * **Notifications -** Will handle sending of notifications when a webhook is received.
  
  * **Webhooks -** Used to initiate webhooks and forward incoming hooks to notifications.
  
  * **Settings -** Changed settings for webhhooks and notifications is updated in the database.
  
  * **UserDB -** Initiates a User-schema and handles connections to Firebase Database.
  
  * **JWT -** Creates and validates tokens used for authorization.

### 5.3 Webhooks

When a user is signing in to Github through the application, a connection between Github and the application will be established and kept open to deliver new events occurring on Github.

**Extra:** Adding webhooks to other services like Slack if having time.

### 5.4 Notifications

**Philips Hue API:**

The main plan for handling notifications in the application is to let a Philips Hue-Lamp in my house flash when a new notification is received. But as for the time if writing this, the so called Externa Philips Hue API isn’t available to the public. They only provide a API that can handle lamps on an internal network.
I have applied for a key to use the externa API but hasn’t recessen any answer yet. So further down I present some alternate scenarios for handling notifications. 

If I don’t receive any credentials to use the external Philips Hue API I present two alternate scenarios for handling notifications.

**Alternative 1 - Service Worker:**

A service worker is registered when a user is using the application and sends notifications to the users browser.

**Alternative 2 - Connect to an Raspberry Pi on my network using the the Internal Philips Hue API:**

Creating a small server who’s running on a Raspberry Pi and acts as a ”middleman” to use the local Philips Hue API at my home. But one big issue by doing so is that it will only be available for me or for anyone using a Raspberry Pi with the same server controlling the local Philips Hue API. 

### 5.5 Authentication / Authorization

All authentication and authorization will be handled by a JSON Web Token (JWT).  When the user is signing in to the application, a token is assigned for the user and saved in clients local storage.
That token has to be included in the header for requests made from client to server that needs authorization. 
If a token is already stored in clients local storage, it will be validated to see if it is still valid. If it isn’t the user will be asked to sign in again.

## 6. External systems

  * **Github API -** All data from Github such as receiving webhooks and retrieving users organizations will be handled with help by the API provided from GitHub.

  * **Philips Hue API -** Notifications will be sent to the API to let a light flash in my home when a new notification is received.
