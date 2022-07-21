# ModulePal Backend

This directory contains the source code for the backend of ModulePal. We assume you are comfortable with the technologies used by the project.

## Tech stack

  The backend uses the following technologies:
  
  * [Java Spring Boot](https://spring.io/projects/spring-boot)
  * [Maven](https://maven.apache.org/)
  * [H2 Database Engine](https://www.h2database.com/html/main.html) 
  * [Hibernate ORM](https://hibernate.org/orm/)
  * [Google Firebase Authentication](https://firebase.google.com/docs/auth)
  * [Google Firebase Realtime Database](https://firebase.google.com/docs/database)
  * [Warwick Tabula API](https://warwick.ac.uk/services/its/servicessupport/web/tabula/api/)
  * [Warwick OAuth](https://warwick.ac.uk/services/its/servicessupport/web/sign-on/help/oauth/apis)
  * [Heroku](https://www.heroku.com/)
  * [Mailchimp](https://mailchimp.com)
  
  ... and various libraries which can be found in the pom.xml.
  
  The backend is entirely free to run using these free services.
  
  Generally, the application read and writes to the NoSQL Firebase Realtime Database, and caches data in an in-memory SQL H2 database. Metrics are maintained in-memory in a continuous fashion (avoiding recomputation) with a nested hashmap data structure. In the Firebase Realtime Database, static (non-changing) data (e.g. metadata for modules, departments, etc) is stored under the `staticDatabase` node. Changing data (relating to users, ratings, etc.) is stored under `mainDatabase`. A university user is tied to an anonymous Firebase Authentication session, which maintains the login state on the frontend and the association is managed on the backend.

  Originally the backend was hosted using Tomcat on a Linux VPS, however we recommend Heroku for ease of deployment and management (also free for basic use).
  
  ## Setup
  
  We recommend developing the backend using the [IntelliJ IDEA](https://www.jetbrains.com/idea/) IDE. You will need an [account on Heroku](https://www.heroku.com/) and the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed.
  
  Before running the backend, you will require:
  
  * A **private** Firebase Project with [Authentication](https://firebase.google.com/docs/auth) (only the 'Anonymous' sign-in-method) and a [Realtime Database](https://firebase.google.com/docs/database) - ensure it's private. This Firebase Project should be the same as the one used in the frontend.
  * A [Mailchimp audience](https://mailchimp.com/en-gb/help/getting-started-audience/) and [API Key](https://mailchimp.com/en-gb/help/about-api-keys/).
  * An SMTP server with TLS to recieve mail with respect to the backend's status (optional) e.g. using [gmail](https://kinsta.com/blog/gmail-smtp-server/).
  * An API key for the [Tabula API](https://warwick.ac.uk/services/its/servicessupport/web/tabula/api/).
  * A HMAC-SHA1 consumer key and client shared secret for [Warwick OAuth](https://warwick.ac.uk/services/its/servicessupport/web/sign-on/help/oauth/apis/) (obtain [here](https://warwick.ac.uk/services/its/servicessupport/web/sign-on/help/oauth/apis/registration/)).
  * An app on [Heroku](https://www.heroku.com/) for Java.
  
  The following steps will run the backend either locally or on Heroku:
  
  1. Copy the code into a local **private** git repository.
  1. Configure your IDE such that there are no errors. You may need to the use the plugin registry in IntelliJ IDEA, by going to Settings -> Build, Execution, Deployment -> Build Tools -> Maven -> Check 'Use plugin registry'.
  1. [Generate the private key for your Firebase service account](https://firebase.google.com/docs/admin/setup#initialize-sdk) and copy the file to the location [src/main/resources/firebase-service-account.json](/backend/src/main/resources/firebase-service-account.json). 
  1. Set the environment variables as listed in the below section, either locally or in your Heroku app if deploying to Heroku. In your Heroku app, go to the Settings tab and find Config Vars. Click 'Reveal Config Vars' and enter your environment variables and their values.
  1. Compile the application by running `mvn compile`. Do not proceed until this succeeds.
  1. Run locally via Maven (note, skip tests) or by running `java -jar target/dependency/webapp-runner.jar target/*.war` in this directory.
  1. The following remaining steps will deploy the app to Heroku (by following [this guide](https://devcenter.heroku.com/articles/java-webapp-runner)).
  1. Commit your changes to git: `git init` -> `git add .` -> `git commit -m "Ready to deploy"`.
  1. Upload the app on Heroku. If you do not have an existing Heroku app then run `heroku create`, otherwise run `heroku git:remote -a <app>` where `<app>` is your app's ID.
  1. Deploy the app on Heroku. Run `git push heroku master`.
  1. If this is your first time running the backend, populate your Firebase Realtime Database with the necessary data from the Tabula API (modules, departments, etc.) under the `staticDatabase` node by making a POST request to the `/admin/database/importRealData` endpoint (by using e.g. Postman).
  1. Since Heroku free Dynos automatically shutdown after no web requests for 30 minutes, we recommend you add your Heroku app to http://kaffeine.herokuapp.com/ to keep it alive by pinging it every 30 minutes.
  1. :rocket:
  
  ## Environment variables
  
  The below table lists the environment variables. All are required.

  | Environment variable                | Description                                                                                                                                                                      |
|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `TABULA_API_HTTP_AUTH_HEADER_VALUE` | Authorisation header (API key) for the Tabula API. E.g. `Basic <...>`                                                                                                            |
| `MAILCHIMP_API_KEY`                 | Mailchimp API Key.                                                                                                                                                               |
| `MAILCHIMP_LIST_ID`                 | ID of your Mailchimp audience ([guide](https://mailchimp.com/en-gb/help/find-audience-id/)).                                                                                     |
| `FIREBASE_DB_URL`                   | URL of your Firebase Realtime Database, e.g, `https://<...>.<...>.firebasedatabase.app/`                                                                                         |
| `SPRING_AUTH_USERNAME`              | Username for Spring services, e.g. HTTP Basic Authentication and H2 database.                                                                                                    |
| `SPRING_AUTH_PASSWORD`              | Password for Spring services, e.g. HTTP Basic Authentication and H2 database. Should be **secure**, e.g. 16 characters.                                                          |
| `MAIL_SENDER_HOST`                  | SMTP server domain for email (e.g. `smtp.gmail.com` for gmail).                                                                                                                  |
| `MAIL_SENDER_PORT`                  | Port of SMTP server (usually 587).                                                                                                                                               |
| `MAIL_SENDER_USERNAME`              | Username of SMTP server.                                                                                                                                                         |
| `MAIL_SENDER_PASSWORD`              | Password of SMTP server.                                                                                                                                                         |
| `OAUTH_CONSUMER_KEY`                | Warwick OAuth consumer key.                                                                                                                                                      |
| `OAUTH_CLIENT_SHARED_SECRET`        | Warwick OAuth client secret.                                                                                                                                                     |
| `STARTUP_PRODUCTION_DB`             | `true` to set the database mode to production, under the `mainDatabase` node of the Realtime Database, `false` for test, under the `testDatabase` node of the Realtime Database. |
| `STARTUP LOAD DB`                   | `true` to load the contents of the Firebase Realtime Database into the H2 cache at startup, `false` otherwise (should be `true` unless testing locally).                         |
| `MAIL`                              | `true` to send status emails of the backend, `false` otherwise.                                                                                                                  |
| `MAIL_RECIPIENT`                    | Email to send the backend status emails to (e.g. personal email).                                                                                                                                     |

  