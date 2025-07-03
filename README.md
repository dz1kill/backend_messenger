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

1. Connection to the server via websocket is organized in two ways, testing and for work.

You can use Postman then when connecting in the header we must pass the token.
Or connecting a client:  
example connect

```js
new WebSocket(url, ["auth", token]);
```

2. list of recent chats with latest messages:  
   Example:

```js
{
  "type": "listLastMessage",
  "params": {
    "limit": 5,
    "cursorCreatedAt": null
  }
}

```

Response:

```js
{
    "type": "listLastMessageResponse",
    "success": true,
    "params": {
        "data": [
            {
                "messageId": "2d44a4a3-1a75-4e64-9dd6-99876d750de3",
                "senderId": "8f2cf7a5-688c-47d8-a8b7-2c14d63a665b",
                "senderName": "Ian",
                "receiverId": null,
                "receiverName": null,
                "groupId": "4be49da0-df09-49d5-9de1-9a84553b2ef9",
                "groupName": "Design Hub",
                "content": "Thanks for the quick response.",
                "createdAt": "2025-07-01T15:24:16.941Z",
                "updatedAt": "2025-07-01T15:43:28.339Z",
                "deletedAt": null
            },
            // other chats
        ],
        "isBroadcast": false
        "item":null
    }
}

```

3. Recent private messages:

   Example:

```js
{
  "type": "getlatestMessageDialog",
  "params": {
    "receiverId":"3989f7d0-7a78-4914-b7eb-bff07c619e97",
    "limit": 5,
    "cursorCreatedAt": null
  }
}

```

Response:

```js
{
    "type": "getlatestMessageDialogResponse",
    "success": true,
    "params": {
        "data": [
            {
                "messageId": "a439b5bc-c2ec-4487-b2cd-29ceb8345d27",
                "senderId": "3989f7d0-7a78-4914-b7eb-bff07c619e97",
                "senderName": "Alice",
                "receiverId": "c6674a8e-7619-4198-9897-d2ed90572568",
                "receiverName": "Charlie",
                "content": "I'll send the file soon.",
                "createdAt": "2025-07-01T12:05:55.586Z"
            },
            // other messages
        ],
         "isBroadcast": false,
         "item":null
    }
}

```

4. Recent messages in the group:

   Example:

```js
{
  "type": "getlatestMessageGroup",
  "params": {
    "groupId": "75b3f7bc-41d5-407d-b0ec-20e2490266de",
    "limit": 5,
    "cursorCreatedAt": null
  }
}

```

Response:

```js
{
    "type": "getlatestMessageGroupResponse",
    "success": true,
    "params": {
        "data": [
            {
                "messageId": "322ad6fa-7f30-4efc-a7e1-dbe351d3f125",
                "senderId": "639862ba-7be1-48b4-ae7a-34457581c09a",
                "senderName": "Laura",
                "groupId": "75b3f7bc-41d5-407d-b0ec-20e2490266de",
                "groupName": "Movie Buffs",
                "content": "Hey, how's it going?",
                "createdAt": "2025-06-30T00:12:53.094Z"
            },
            // other messages
        ],
         "isBroadcast": false,
         "item":null
    }
}
```

5. Creating a group:

   Example:

```js
{
  "type": "newGroup",
  "params": {
    "groupId": "322ad4fa-7f30-4efc-a7e1-dbe351d3f125",
    "groupName": "new name"
  }
}

```

Response:

```js
{
    "type": "newGroupResponse",
    "success": true,
    "params": {
        "data": null,
        "isBroadcast": false,
        "item":null
    }
}
```

6. Adding users to a group:

   Example:

```js
{
  "type": "addUserInGroup",
  "params": {
    "groupId": "aefb7d52-5bf6-4851-a2d3-c902f12d007f",
    "userId": "10ca546a-dab4-470f-b93c-787de10d46c1"
  }
}

```

Response:

```js
{
    "type": "addUserInGroupResponse",
    "success": true,
    "params": {
        "data": null,
        "isBroadcast": false,
        "item":null
    }
}
```

7. Leave the group:

   Example:

```js
{
  "type": "leaveGroup",
  "params": {
    "groupId": "aefb7d52-5bf6-4851-a2d3-c902f12d007f"
  }
}

```

Response:

```js
{
    "type": "leaveGroupResponse",
    "success": true,
    "params": {
        "data": null,
        "isBroadcast": false,
        "item":null
    }
}
```

8. Message in group:

   Example:

```js
{
  "type": "messageInGroup",
  "params": {
    "messageId":"3989f7d0-7a78-4914-b7eb-bff07c619e97",
    "groupName": "Tech Geeks",
    "groupId": "4be49da0-df09-49d5-9de1-9a84553b2ef9",
    "content": "Hi"
  }
}

```

Broadcast:

```js
{
    "type": "messageInGroup",
    "success": true,
    "params": {
        "item": {
            "groupId": "9fd7ff5c-10c4-4852-81aa-84055052f29c",
            "groupName": "Language Learners",
            "messageId": "6e472b55-7e69-4a68-bd64-0729840e96ef",
            "message": "Hi",
            "senderName": "Bob",
            "senderId": "525c8f71-b19a-4dc5-a516-ac1fe5e6120a",
            "createdAt": "2025-07-03T12:41:04.944Z"
        },
        "data": null,
        "isBroadcast": true
    }
}

```

Response:

```js
{
    "type": "leaveGroupResponse",
    "success": true,
    "params": {
        "data": null,
        "isBroadcast": false,
        "item":null
    }
}
```

8. Private message:

   Example:

```js
{
  "type": "privateMessage",
  "params": {
  "messageId":"3979f7d0-7a78-4914-b7eb-bff07c619e97",
  "receiverId": "7e7c8487-9cc2-45d5-8c8d-7c37356cec06",
  "content":"Hi"
  }
}

```

Broadcast:

```js
{
    "type": "privateMessage",
    "success": true,
    "params": {
        "item": {
            "messageId": "5f0da29b-93b9-4f4e-bb16-ba75f4d7af06",
            "message": "Hi",
            "senderName": "Bob",
            "senderId": "525c8f71-b19a-4dc5-a516-ac1fe5e6120a",
            "createdAt": "2025-07-03T10:16:06.340Z"
        },
        "data": null,
        "isBroadcast": true
    }
}
```

Response:

```js
{
    "type": "privateMessage",
    "success": true,
    "params": {
        "item": null
        "data": null,
        "isBroadcast": false
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

Documentation (Swagger UI) is available at: [link] http://localhost:3001/api/

Websocket server: ws://localhost:3001/

node v16.14.2
