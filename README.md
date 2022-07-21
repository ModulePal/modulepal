<p align="center">
<img src="https://raw.githubusercontent.com/omarathon/modulepal/main/frontend/src/img/logo-large-no-warwick.png" width="600" />
</p>

# ModulePal

Source code for ModulePal ([modulepal.com](https://modulepal.com/)).

This project was originally an attempt to learn Spring and React, but it evolved into something-of-a-product and exploded in complexity. While the code works, it's certainly not the best it could be, and a lot has been learned from the project.

Aspects of the code have been tidied up and separately open-sourced, e.g. OAuth1-HMAC: https://github.com/omarathon/oauth1-hmac.

## Tech stack

An overview of the tech stack is given below (more detail can be found in the README of the [frontend](/frontend/) and [backend](/backend/)). In general it's a high-performance CRUD application with optimisations in the backend for metric computations, and a secure OAuth authentication system for university student data. The backend is a monalith. The entire app is actually free to host and run (including the backend).

### Frontend

* [React](https://reactjs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [Bootstrap](https://getbootstrap.com)
* [Google Firebase Authentication](https://firebase.google.com/docs/auth)
* [Google Firebase Hosting](https://firebase.google.com/docs/hosting)

### Backend
  
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

## Setup

If you would like to run the site yourself, you should first make a private [Firebase Project](https://firebase.google.com/) that will be shared by both the frontend and the backend. Then, set up the [backend](/backend/), followed by the [frontend](/frontend/) (guides are provided in the respective directories' README). You will probably need to make additional changes after deploying via the guides. You'll need a few API keys from the University of Warwick, but the entire app should be free to host provided you use our stack.

## Assistance

If you'd like to become the maintainer of ModulePal or run it yourself and require assistance, I'd be happy to help. I'm aware there's a lot of details that have not been fully explained in the README files, and that aspects of it may be difficult to understand. There's plenty that can be improved. DM me on Discord: `omarathon#2226`.

## Data note

Please note that we do not provide the populated database of ModulePal in production (https://modulepal.com) here, as it contains sensitive student data. If you would like this data, please request it by DMing `omarathon#2226` on Discord.

## Acknowledgements

I'd like to acknowledge the following people for significant assistance on the project:

* Dr. Florin Ciucu - High-level steering, departmental assistance
* Vanshika Saxena - UI/UX mockups and implementation
* Warwick ITS team - Access to data, APIs and assistance

## License

This software is protected under the BSD 3-Clause license.

Copyright (c) 2022, Omar Tanner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

See [LICENSE](/LICENSE/) for further information.
