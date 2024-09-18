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

## Examples of websocket requests and responses :

1. Connection to the websocket occurs via the http protocol.  
   In the connection request, the user token must be passed in the header.

example of invalid token error:

```js
Error: Unexpected server response: 401
Handshake Details
Request URL: http://localhost:3000/
Request Method: GET
Status Code: 401 Unauthorized
Request Headers
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: aWKsrCP2KvNFlmstQdVEDA==
Connection: Upgrade
Upgrade: websocket
Authorization: Bearer 1eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlbWFpbEBtYWlsLmNvbTAiLCJmaXJzdE5hbWUiOiJQYXRyaWNrMCIsImlhdCI6MTY5MDU0NzU3NiwiZXhwIjoxNjkwNjMzOTc2fQ.AqE87IwBoyI0XlUDnVShjyQGZQd_IQB6L1-bdO_HnhM
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
Host: localhost:3000
Response Headers
Online

```

2. list of recent chats with latest messages:  
   Example:

```js
{
  "type": "listLastMessage",
  "params": {
    "limit": 5,
    "page": 1
  }
}

```

Response:

```js
{
    "type": "listLastMessage",
    "success": true,
    "params": {
        "data": [
            {
            "id": 65,
            "senderId": 2,
            "senderName": "Patrick1",
            "receiverId": 1,
            "receiverName": "Patrick0",
            "groupId": null,
            "groupName": null,
            "content": "Hi",
            "createdAt": "2023-07-28T13:20:09.896Z",
            "updatedAt": "2023-07-28T13:20:09.896Z",
            "deletedAt": null
            },
            // other chats
        ],
        "message": null,
        "senderName": null
    }
}

```

3. Recent private messages:

   Example:

```js
{
  "type": "getlatestMessageDialog",
  "params": {
    "receiverId":1,
    "limit": 5,
    "page": 1
  }
}

```

Response:

```js
{
    "type": "getlatestMessageDialog",
    "success": true,
    "params": {
        "data": [
            {
             "sender_id": 1,
             "receiver_id": 2,
             "receverName": "Patrick1",
             "content": "Message from 1",
             "created_at": "2023-07-18T17:16:10.669Z"
            },
            // other messages
        ],
        "message": null,
        "senderName": null
    }
}

```

4. Recent messages in the group:

   Example:

```js
{
  "type": "getlatestMessageGroup",
  "params": {
    "groupId": 1,
    "limit": 5,
    "page": 1
  }
}

```

Response:

```js
{
    "type": "getlatestMessageGroup",
    "success": true,
    "params": {
        "data": [
            {
             "sender_id": 8,
             "senderName": "Patrick7",
             "group_id": 1,
             "created_at": "2023-07-18T17:16:10.612Z",
             "content": "Message from 8"
            },
            // other messages
        ],
        "message": null,
        "senderName": null
    }
}
```

5. Creating a group:

   Example:

```js
{
  "type": "newGroup",
  "params": {
    "groupName": "new name"
  }
}

```

Response:

```js
{
    "type": "newGroup",
    "success": true,
    "params": {
        "data": null
        "message": null,
        "senderName": null
    }
}
```

6. Adding users to a group:

   Example:

```js
{
  "type": "addUserInGroup",
  "params": {
    "groupId": 1,
    "userId": 1
  }
}

```

Response:

```js
{
    "type": "addUserInGroup",
    "success": true,
    "params": {
        "data": null
        "message": null,
        "senderName": null
    }
}
```

7. Leave the group:

   Example:

```js
{
  "type": "leaveGroup",
  "params": {
    "groupId": 1
  }
}

```

Response:

```js
{
    "type": "leaveGroup",
    "success": true,
    "params": {
        "data": null
        "message": null,
        "senderName": null
    }
}
```

8. Message in group:

   Example:

```js
{
  "type": "messageInGroup",
  "params": {
    "groupId": 1,
    "content": "lol"
  }
}

```

Response:

```js
{
    "type": "messageInGroup",
    "success": true,
    "params": {
        "data": null
        "message": null,
        "senderName": null
    }
}
```

8. Private message:

   Example:

```js
{
  "type": "privateMessage",
  "params": {
  "receiverId": 2,
  "content":"Hi"
  }
}

```

Response:

```js
{
    "type": "privateMessage",
    "success": true,
    "params": {
        "data": null
        "message": null,
        "senderName": null
    }
}
```

9. Message sending example:

Response:

```js
{
    "type": "privateMessage",
    "success": true,
    "params": {
        "data": null,
        "message": "Hi",
        "senderName": "Patrick0"
    }
}
```

10. Error example:

    Response:

```js
{
    "error": true,
    "type": "addUserInGroup",
    "message": "User is not a member of this group"
}
```

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
