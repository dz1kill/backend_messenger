# Messenger Backend MVP

## 📌 Overview

This is a minimum viable product (MVP) of a messenger, including:

- **Backend**: REST API for user management & WebSocket API for real-time messaging.
- **Frontend**: A companion web client : https://github.com/dz1kill/frontend_messenger

## ✨ Key Features

### 🔹 HTTP API (REST)

**User Management**

- ✅ User registration and authentication (JWT)
- ✏️ Profile updates and account deletion
- 🔍 User and group search functionality

**Operations**

- 🔍 Find users & my groups  
  _(Lists all users and the groups the requesting user belongs to)_
- 🔍 Find non-group members  
  _(Search users not in specified group)_
- 👥 Create new group
- 🧹 Delete dialog for user

### 🔹 WebSocket API

**Chat Functionality**

- 💬 Private and group messaging
- 📚 Paginated message history
- 📋 Chat list with latest messages

**Group Management**

- 👥 Add/remove members
- 👋 Leave groups
- 🗑️ Group deletion

## 🛠️ Technology Stack

| Component         | Technology             |
| ----------------- | ---------------------- |
| Backend Framework | Node.js + Express + TS |
| Realtime          | WS (WebSocket)         |
| Database          | PostgreSQL             |
| ORM               | Sequelize              |
| Auth              | JWT                    |
| API Docs          | Swagger UI             |

## ⚙️ System Architecture

- **REST API** for CRUD operations
- **WebSocket** for real-time events
- **PostgreSQL** for data persistence
- **Migrations** for schema management
- **Docker** - Containerized deployment

## 🏃 Running the app

```bash

# In the console, run the database image with the command:
$ docker-compose up

# Create tables in the database using the "migrations" command:
$ npm run migrate:start

# Running the project in development mode:
$ npm run dev

```

## 🔗 Links

Documentation (Swagger UI) is available at: [link] http://localhost:3001/api/

Websocket server: ws://localhost:3001/

node v16.14.2

## 💬 Examples of WebSocket Requests, Responses and Broadcast

1. Connection to the server via websocket is organized in two ways, testing and for work.

You can use Postman then when connecting in the header we must pass the token.
Or connecting a client.  
Example connect client:

```js
new WebSocket(url, ["auth", token]);
```

2. List of chats with latest messages:  
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
  "type": "listLastMessage",
  "success": true,
  "params": {
    "item": null,
    "data": [
      {
        "messageId": "fe411368-c2cf-4abc-8a11-94b70f772bd6",
        "senderId": "4636ae65-4a05-4546-b4b7-f174aa4fc135",
        "senderName": "Ethan",
        "senderLastName": "Davis",
        "receiverId": null,
        "receiverName": null,
        "receiverLastName": null,
        "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4",
        "groupName": "Music Makers",
        "content": "Ethan Davis добавил(a) в группу Ian Anderson",
        "createdAt": "2025-07-24T00:29:25.597Z",
        "updatedAt": "2025-07-24T00:29:25.597Z",
        "deletedAt": null
      }
       // other chats
    ],
    "isBroadcast": false
  }
}

```

3. Paginated loading of personal messages:

   Example:

```js
{
  "type": "getlatestMessageDialog",
  "params": {
    "receiverId": "4f65bafb-ceb6-4187-a23e-54e13cfdce0e",
    "limit": 12,
    "cursorCreatedAt": null
  }
}

```

Response:

```js
{
  "type": "getlatestMessageDialog",
  "success": true,
  "params": {
    "item": null,
    "data": [
      {
        "messageId": "e1c300be-bcb1-4791-8264-697b6ceb6574",
        "senderId": "4636ae65-4a05-4546-b4b7-f174aa4fc135",
        "senderName": "Ethan",
        "receiverId": "4f65bafb-ceb6-4187-a23e-54e13cfdce0e",
        "receiverName": "Diana",
        "content": "Can we talk about the project?",
        "createdAt": "2025-07-23T16:39:34.951Z"
      }
     // other messages
    ],
    "isBroadcast": false
  }
}

```

4. Paginated loading of group messages:

   Example:

```js
{
  "type": "getlatestMessageGroup",
  "params": {
    "groupName": "Music Makers",
    "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4",
    "limit": 12,
    "cursorCreatedAt": null
  }
}

```

Response:

```js
{
  "type": "getlatestMessageGroup",
  "success": true,
  "params": {
    "item": null,
    "data": [
      {
        "notification": true,
        "messageId": "fe411368-c2cf-4abc-8a11-94b70f772bd6",
        "senderId": "4636ae65-4a05-4546-b4b7-f174aa4fc135",
        "senderName": "Ethan",
        "senderLastName": "Davis",
        "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4",
        "groupName": "Music Makers",
        "content": "Ethan Davis добавил(a) в группу Ian Anderson",
        "createdAt": "2025-07-24T00:29:25.597Z"
      },
      {
        "notification": null,
        "messageId": "8df15fb7-c7df-45c2-aa87-d27ea03aa1d2",
        "senderId": "4636ae65-4a05-4546-b4b7-f174aa4fc135",
        "senderName": "Ethan",
        "senderLastName": "Davis",
        "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4",
        "groupName": "Music Makers",
        "content": "No worries, take your time.",
        "createdAt": "2025-07-23T16:40:18.714Z"
      }
       //other messages
    ],
    "isBroadcast": false
  }
}

```

5. Sending group messages:

   Example:

```js
{
  "type": "messageInGroup",
  "params": {
    "messageId": "e5be0b48-6ff1-4c93-97fd-314f88c4def5",
    "groupName": "Music Makers",
    "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4",
    "content": "hi"
  }
}

```

Response:

```js
{
  "type": "messageInGroup",
  "success": true,
  "params": { "item": null, "data": null, "isBroadcast": false }
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

6. Sending private messages:

   Example:

```js
{
  "type": "privateMessage",
  "params": {
    "messageId": "231505c0-6f32-4611-8a5b-03f600eee20b",
    "receiverId": "a675b290-cf28-49f9-90ed-a4ae1ee1af44",
    "content": "hi"
  }
}


```

Response:

```js
{
  "type": "privateMessage",
  "success": true,
  "params": { "item": null, "data": null, "isBroadcast": false }
}

```

Broadcast:

```js
{
  "type": "privateMessage",
  "success": true,
  "params": {
    "item": {
      "messageId": "231505c0-6f32-4611-8a5b-03f600eee20b",
      "message": "hi",
      "senderName": "Ethan",
      "senderLastName": "Davis",
      "senderId": "4636ae65-4a05-4546-b4b7-f174aa4fc135",
      "createdAt": "2025-07-24T09:19:36.436Z"
    },
    "data": null,
    "isBroadcast": true
  }
}


```

7. Adding a member to a group:

   Example:

```js
{
  "type": "addUserInGroup",
  "params": {
    "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4",
    "groupName": "Music Makers",
    "userId": "ae7cacd3-f2bf-4ace-8f4c-3a96d0bcc761",
    "messageId": "12e36557-e3e2-4c54-bed6-d45a621cb90d",
    "message": "Ethan Davis добавил(a) в группу Don Stell"
  }
}

```

Response:

```js
{
  "type": "addUserInGroup",
  "success": true,
  "params": {
    "item": {
      "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4",
      "groupName": "Music Makers",
      "messageId": "12e36557-e3e2-4c54-bed6-d45a621cb90d",
      "message": "Ethan Davis добавил(a) в группу Don Stell",
      "senderName": "Ethan",
      "senderId": "4636ae65-4a05-4546-b4b7-f174aa4fc135",
      "senderLastName": "Davis",
      "notification": true,
      "createdAt": "2025-07-24T09:26:25.675Z"
    },
    "data": null,
    "isBroadcast": false
  }
}
```

Broadcast:

```js
{
    "type": "addUserInGroup",
    "success": true,
    "params": {
        "item": {
            "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4",
            "groupName": "Music Makers",
            "messageId": "12e36557-e3e2-4c54-bed6-d45a621cb90d",
            "message": "Ethan Davis добавил(a) в группу Don Stell",
            "senderName": "Ethan",
            "senderId": "4636ae65-4a05-4546-b4b7-f174aa4fc135",
            "senderLastName": "Davis",
            "notification": true,
            "createdAt": "2025-07-24T09:26:25.675Z"
        },
        "data": null,
        "isBroadcast": true
    }
}

```

8. Leave the group:

   Example:

```js
{
  "type": "leaveGroup",
  "params": {
    "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4",
    "message": "Ethan Davis покинул(a) группу",
    "messageId": "1d166886-7913-43fe-b0ac-13e18acb021a",
    "groupName": "Music Makers"
  }
}

```

Response:

```js
{
  "type": "leaveGroup",
  "success": true,
  "params": {
    "item": { "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4" },
    "data": null,
    "isBroadcast": false
  }
}

```

Broadcast:

```js
{
    "type": "leaveGroup",
    "success": true,
    "params": {
        "item": {
            "groupId": "02d7b854-451d-4947-b03a-c2b620a991a4",
            "groupName": "Music Makers",
            "messageId": "1d166886-7913-43fe-b0ac-13e18acb021a",
            "message": "Ethan Davis покинул(a) группу",
            "senderName": "Ethan",
            "senderId": "4636ae65-4a05-4546-b4b7-f174aa4fc135",
            "senderLastName": "Davis",
            "notification": true,
            "createdAt": "2025-07-24T09:30:23.223Z"
        },
        "data": null,
        "isBroadcast": true
    }
}

```

8. Delete group:

   Example:

```js
{
  "type": "dropGroup",
  "params": { "groupId": "5ed09aa2-71d9-4b36-b44d-33f4c2157493" }
}


```

Response:

```js
{
  "type": "dropGroup",
  "success": true,
  "params": {
    "item": { "groupId": "5ed09aa2-71d9-4b36-b44d-33f4c2157493" },
    "data": null,
    "isBroadcast": false
  }
}

```

Broadcast:

```js
{
    "type": "dropGroup",
    "success": true,
    "params": {
        "item": {
            "groupId": "5ed09aa2-71d9-4b36-b44d-33f4c2157493"
        },
        "data": null,
        "isBroadcast": true
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
