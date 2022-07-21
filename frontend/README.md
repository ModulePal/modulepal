# ModulePal Frontend

This directory contains the source code for the frontend of ModulePal (React, TypeScript) hosted using Firebase Hosting. We assume you are comfortable with the technologies used by the project.

## Tech stack

We use the following technologies:

* [React](https://reactjs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [Bootstrap](https://getbootstrap.com)
* [Google Firebase Authentication](https://firebase.google.com/docs/auth)
* [Google Firebase Hosting](https://firebase.google.com/docs/hosting)

... and various other libraries detailed in the package.json. It should be noted we use [Reactstrap](https://reactstrap.github.io/) for using Boostrap in React. We utilise Firebase Authentication for session management purposes only (hence, we only use the Anonymous sign-in-provider, and perform university account to Firebase session ID association on the backend).

## Setup

We recommend using the [Visual Studio Code](https://code.visualstudio.com/) IDE for development. You will need [Yarn](https://yarnpkg.com/cli/install) (or if you prefer, npm, but we do not provide instructions for it).

You will need the backend running either on the cloud or locally for the frontend to function properly. You must use the same **private** Firebase Project as the backend for the frontend.

The following steps will run the frontend either locally or via Firebase Hosting:

1. In your Firebase Project, ensure that Firebase Authentication is setup with only the Anonymous sign-in-method.
1. If deploying via Firebase Hosting, ensure that you have setup Firebase Hosting (but do not run the requested commands), and install the [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli). After, Run `firebase login` to login to the Firebase CLI, and login to the account which contains your Firebase Project.
1. Open [src/services/rest/rest.ts](/frontend/src/services/rest/rest.ts) and enter your backend's base URL (before `/api`, e.g. `https://modulepal-backend.com`) into `baseUrl`, and the to-be-deployed frontend's base URL (e.g. `http://localhost:3000` if locally) into `frontendBaseUrl`.
1. Open [.firebaserc](/frontend/.firebaserc) and enter your Firebase Project ID under `projects.default`.
1. Open [firebase.json](/frontend/firebase.json) and enter your Firebase Project ID under `hosting.site`.
1. Open [src/services/firebase/firebase.ts](/frontend/src/services/firebase/firebase.ts) and modify `firebaseConfig` with your [Firebase Config object](https://firebase.google.com/docs/web/learn-more#config-object).
1. Run `yarn` to install the dependencies. This will take a while.
1. If deploying locally for development, run `yarn start`. If deploying via Firebase Hosting, run `yarn build` followed by `firebase deploy --project <projectid>` where `<projectid>` is your Firebase Project ID.
1. :rocket: