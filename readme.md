# backend-starter-nodejs
The aim of this project is to provide a set of tools and configurations to facilitate the initialization of nodejs project api with a simple architecture. It provide CRUD for users and roles and also auth functionnalities.

# All dependencies :

- express js
- posgresql database
- sequelize and sequelize-cli ORM
- o2switch mail transporter config
- passport js and passport jwt strategy
- cors (configure to only accept request from localhost:4200)
- nodemon configs to restart the project on dev mode for ts
- hemlet to enhances security
- nodemailer
- crypto

# How to have it worked ?

To have it worked on your local machine you have to :

- clone the repository
- create postgresql database 
- install dependencies
- set correct parameter for the .env file
- create rsa keys (by running a script located in scripts folder )
- run migrations (by using package.json script part)
- run seeders (by using package.json script part)
- create first user (by running a script located in scripts folder )
- launch the project with start script command located in package.json file

NOW YOU CAN START YOUR WORK !!!
