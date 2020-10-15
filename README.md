# User Authentication Backend with Nodejs

This is the backend for the https://github.com/dimitrov9812/user-authentication-frontend app. It's made with Express. The passwords are being hashed with Bcrypt and after the user is successfully
registered a JsonWebToken is being generated for easier confirmation if the user is being logged in or not. The JWT is being passed in the header. All the inputs are being validated and validation
result is being sent to the front. This backend is hosted on netlify. The authentication is made by Joi library and the database we use in this project is MongoDb.
