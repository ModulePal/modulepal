## Backend

This directory contains the source code for the backend of ModulePal.

### Tech stack

  The backend uses the following technologies:
  
  * [Java Spring Boot](https://spring.io/projects/spring-boot)
  * [Maven](https://maven.apache.org/)
  * [H2 Database Engine](https://www.h2database.com/html/main.html) 
  * [Hibernate ORM](https://hibernate.org/orm/)
  * [Firebase Authentication](https://firebase.google.com/docs/auth)
  * [Google Firebase Realtime Database](https://firebase.google.com/docs/database)
  * [Warwick Tabula API](https://warwick.ac.uk/services/its/servicessupport/web/tabula/api/)
  * [Warwick OAuth](https://warwick.ac.uk/services/its/servicessupport/web/sign-on/help/oauth/apis)
  * [Heroku](https://www.heroku.com/)
  * [Mailchimp](https://mailchimp.com)
  
  and various libraries which can be found in the pom.xml.
  
  The backend is entirely free to run using these free services.
  
  Generally, the application read and writes to the Firebase Realtime Database, and caches data in an in-memory H2 database. Metrics are maintained in-memory in a continuous fashion (avoiding recomputation) with a nested hashmap data structure.
  
  ### Setup
  
  We recommend developing the backend using the [IntelliJ IDEA](https://www.jetbrains.com/idea/) IDE. You will need an [account on Heroku](https://www.heroku.com/) and the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed.
  
  Before running the backend, you will require:
  
  * A **private** Firebase project with [Authentication](https://firebase.google.com/docs/auth) and a [Realtime Database](https://firebase.google.com/docs/database).
  * A [Mailchimp audience](https://mailchimp.com/en-gb/help/getting-started-audience/) and [API Key](https://mailchimp.com/en-gb/help/about-api-keys/).
  * An SMTP server with TLS to recieve mail with respect to the backend's status (optional) e.g. using [gmail](https://kinsta.com/blog/gmail-smtp-server/).
  * An API key for the [Tabula API](https://warwick.ac.uk/services/its/servicessupport/web/tabula/api/).
  * A HMAC-SHA1 consumer key and client shared secret for [Warwick OAuth](https://warwick.ac.uk/services/its/servicessupport/web/sign-on/help/oauth/apis/) (obtain [here](https://warwick.ac.uk/services/its/servicessupport/web/sign-on/help/oauth/apis/registration/)).
  * An app on [Heroku](https://www.heroku.com/) for Java.
  
  The following steps will run the backend either locally or on Heroku:
  
  1. Copy the code into a local **private** git repository.
  1. Configure your IDE such that there are no errors. You may need to the use the plugin registry in IntelliJ IDEA, by going to Settings -> Build, Execution, Deployment -> Build Tools -> Maven -> Check 'Use plugin registry'.
  1. [Generate the private key for your Firebase service account](https://firebase.google.com/docs/admin/setup#initialize-sdk) and copy the file to the location `src/main/resources/firebase-service-account.json`. 
  1. Set the environment variables as listed in the below section, either locally or in your Heroku app if deploying to Heroku. In your Heroku app, go to the Settings tab and find Config Vars. Click 'Reveal Config Vars' and enter your environment variables and their values.
  1. Compile the application by running `mvn compile`. Do not proceed until this succeeds.
  1. Run locally via Maven (note, skip tests) or by running `java -jar target/dependency/webapp-runner.jar target/*.war` in this directory.
  1. The following remaining steps will deploy the app to Heroku (by following [this guide](https://devcenter.heroku.com/articles/java-webapp-runner)).
  1. Commit your changes to git: `git init` -> `git add .` -> `git commit -m "Ready to deploy"`.
  1. Upload the app on Heroku. If you do not have an existing Heroku app then run `heroku create`, otherwise run `heroku git:remote -a <app>` where `<app>` is your app's ID.
  1. Deploy the app on Heroku. Run `git push heroku master`.
 
  
  
  ### Environment variables
  
  The below table lists the environment variables. All are required.
  
  
  
  
  
