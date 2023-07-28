## Description

MVP Backend for messenger.

1. The backend implements using the HHTP protocol:  
   1.1 User registration.  
   1.2 User authorization.  
   1.3 Updating user data.  
   1.4 Deleting a user.

2. By Websocket:  
   2.1 Page loading of all latest chats.  
   2.2 Page loading of the latest messages in the chat.  
   2.3 Create a group.  
   2.4 Adding users to the group.  
   2.5 Leave the group.  
   2.6 Write a message in the group.  
   2.7 Private messages.

Stack: Node.js, Express, WS, PostgreSQL, Sequelize-typescript, JWT.

## Running the app

```bash

# In the console, run the database image with the command:
$ docker-compose up

# Create tables in the database using the "migrations" command:
$ npm run migrate:start

# Running the project in development mode:
$ npm run dev

```

## Links

Documentation (Swagger UI) is available at: [link] http://localhost:3000/api/

Websocket server: ws://localhost:3000

node v16.14.2
