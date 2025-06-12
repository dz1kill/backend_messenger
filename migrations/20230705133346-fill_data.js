const { getRandomIntInclusive, hashPassword } = require("./helper/common.js");

const NUMBER_OF_USERS = 40;
const NUMBER_OF_GROUPS = 20;
const NUMBER_OF_MESSAGES_PER_CHAT = { min: 40, max: 80 };
const NUMBER_OF_IMAGES_PER_USER = { min: 3, max: 10 };
const THREE_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const FIRST_NAMES = [
  "Alex",
  "Anna",
  "Max",
  "Sophia",
  "Daniel",
  "Olivia",
  "Michael",
  "Emma",
  "David",
  "Emily",
  "James",
  "Charlotte",
  "Robert",
  "Amelia",
  "John",
  "Mia",
  "William",
  "Harper",
  "Richard",
  "Evelyn",
  "Joseph",
  "Abigail",
  "Thomas",
  "Elizabeth",
  "Charles",
  "Sofia",
  "Christopher",
  "Avery",
  "Matthew",
  "Ella",
];
const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];
const GROUP_NAMES = [
  "Work Team",
  "Family Chat",
  "College Friends",
  "Book Club",
  "Gaming Squad",
  "Travel Buddies",
  "Music Lovers",
  "Fitness Group",
  "Foodies United",
  "Tech Enthusiasts",
  "Art Collective",
  "Study Group",
  "Neighborhood Watch",
  "Parents Association",
  "Sports Fans",
  "Movie Buffs",
  "Photography Club",
  "Entrepreneurs Network",
  "Language Exchange",
  "Volunteer Team",
];
const MESSAGE_TEXTS = [
  "Hey, how are you doing?",
  "What's up?",
  "Did you see the news?",
  "Let's meet this weekend!",
  "I'll be late for the meeting",
  "Check out this link",
  "Can you help me with something?",
  "Thanks for your help!",
  "Happy birthday!",
  "Did you finish the project?",
  "What are your plans for today?",
  "I'm running about 10 minutes late",
  "Let me know when you're free",
  "That sounds great!",
  "I don't think that will work",
  "Can we reschedule?",
  "Have you seen my keys?",
  "What time should we meet?",
  "Bring your laptop tomorrow",
  "The meeting is cancelled",
];

const createUser = async (queryInterface) => {
  const users = [];

  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const firstName =
      FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const resultHash = await hashPassword("1234");

    const user = {
      first_name: firstName,
      last_name: lastName,
      email: `email${i}@mail.com`,
      password: resultHash,
      created_at: new Date(),
      updated_at: new Date(),
    };
    users.push(user);
  }

  await queryInterface.bulkInsert("users", users);
};

const deleteUsers = async (queryInterface) => {
  await queryInterface.sequelize.query("DELETE FROM users");
};

const createGroups = async (queryInterface) => {
  const groups = [];

  for (let i = 0; i < NUMBER_OF_GROUPS; i++) {
    const groupName =
      GROUP_NAMES[i % GROUP_NAMES.length] +
      (i > GROUP_NAMES.length
        ? ` ${Math.floor(i / GROUP_NAMES.length) + 1}`
        : "");

    const group = {
      name: groupName,
      created_at: new Date(),
      updated_at: new Date(),
    };

    groups.push(group);
  }

  await queryInterface.bulkInsert("groups", groups);
};

const deleteGroups = async (queryInterface) => {
  await queryInterface.sequelize.query("DELETE FROM groups");
};

const createUsersGroups = async (queryInterface) => {
  const users = (
    await queryInterface.sequelize.query("SELECT id FROM users", {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    })
  ).map((u) => u.id);
  const groups = (
    await queryInterface.sequelize.query("SELECT id FROM groups", {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    })
  ).map((g) => g.id);

  for (const groupId of groups) {
    const numMembers = getRandomIntInclusive(5, 15);
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffledUsers.slice(0, numMembers);

    for (const userId of selectedUsers) {
      try {
        await queryInterface.insert(null, "users_groups", {
          user_id: userId,
          group_id: groupId,
          created_at: new Date(),
          updated_at: new Date(),
        });
      } catch (e) {
        continue;
      }
    }
  }

  const additionalConnections = Math.floor(users.length * 5);
  for (let i = 0; i < additionalConnections; i++) {
    const randomUserId = users[getRandomIntInclusive(0, users.length - 1)];
    const randomGroupId = groups[getRandomIntInclusive(0, groups.length - 1)];

    try {
      await queryInterface.insert(null, "users_groups", {
        user_id: randomUserId,
        group_id: randomGroupId,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } catch (e) {
      continue;
    }
  }
};

const deleteUsersGroups = async (queryInterface) => {
  await queryInterface.sequelize.query("DELETE FROM users_groups");
};

const createMessages = async (queryInterface) => {
  const now = new Date();
  const users = (
    await queryInterface.sequelize.query("SELECT id FROM users", {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    })
  ).map((u) => u.id);
  const groups = (
    await queryInterface.sequelize.query("SELECT id FROM groups", {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    })
  ).map((g) => g.id);

  for (let i = 0; i < users.length; i++) {
    const senderId = users[i];
    const numContacts = getRandomIntInclusive(5, 15);
    const shuffledUsers = [...users]
      .filter((id) => id !== senderId)
      .sort(() => 0.5 - Math.random());
    const contacts = shuffledUsers.slice(0, numContacts);

    for (const receiverId of contacts) {
      const numMessages = getRandomIntInclusive(
        NUMBER_OF_MESSAGES_PER_CHAT.min,
        NUMBER_OF_MESSAGES_PER_CHAT.max
      );

      for (let j = 0; j < numMessages; j++) {
        const isSender = Math.random() > 0.5;
        const currentSender = isSender ? senderId : receiverId;
        const currentReceiver = isSender ? receiverId : senderId;
        const randomTimeOffset = Math.floor(Math.random() * THREE_DAYS_MS);
        const messageTime = new Date(now.getTime() - randomTimeOffset);

        const message = {
          sender_id: currentSender,
          receiver_id: currentReceiver,
          content:
            MESSAGE_TEXTS[Math.floor(Math.random() * MESSAGE_TEXTS.length)],
          created_at: messageTime,
          updated_at: messageTime,
        };

        await queryInterface.insert(null, "messages", message);
      }
    }
  }

  for (const groupId of groups) {
    const groupMembers = (
      await queryInterface.sequelize.query(
        `SELECT user_id FROM users_groups WHERE group_id = ${groupId}`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ).map((m) => m.user_id);

    if (groupMembers.length === 0) continue;

    const numMessages = getRandomIntInclusive(
      NUMBER_OF_MESSAGES_PER_CHAT.min * 2,
      NUMBER_OF_MESSAGES_PER_CHAT.max * 2
    );

    for (let i = 0; i < numMessages; i++) {
      const randomMember =
        groupMembers[getRandomIntInclusive(0, groupMembers.length - 1)];
      const randomTimeOffset = Math.floor(Math.random() * THREE_DAYS_MS);
      const messageTime = new Date(now.getTime() - randomTimeOffset);

      const message = {
        sender_id: randomMember,
        group_id: groupId,
        content:
          MESSAGE_TEXTS[Math.floor(Math.random() * MESSAGE_TEXTS.length)],
        created_at: messageTime,
        updated_at: messageTime,
      };

      await queryInterface.insert(null, "messages", message);
    }
  }
};

const deleteMessages = async (queryInterface) => {
  await queryInterface.sequelize.query("DELETE FROM messages");
};

const createImages = async (queryInterface) => {
  const now = new Date();
  const messages = await queryInterface.sequelize.query(
    "SELECT id, sender_id FROM messages ORDER BY RANDOM() LIMIT 1000",
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  for (const message of messages) {
    const numImages = getRandomIntInclusive(1, 3);

    for (let i = 0; i < numImages; i++) {
      const imageTypes = ["jpg", "png", "gif"];
      const randomType =
        imageTypes[Math.floor(Math.random() * imageTypes.length)];
      const randomTimeOffset = Math.floor(Math.random() * ONE_WEEK_MS);
      const imageTime = new Date(now.getTime() - randomTimeOffset);

      const image = {
        message_id: message.id,
        name: `image_${message.sender_id}_${Date.now()}.${randomType}`,
        url: `https://example.com/images/${message.sender_id}/${Math.random()
          .toString(36)
          .substring(7)}.${randomType}`,
        created_at: imageTime,
        updated_at: imageTime,
      };

      await queryInterface.insert(null, "images", image);
    }
  }
};

const deleteImages = async (queryInterface) => {
  await queryInterface.sequelize.query("DELETE FROM images");
};

module.exports = {
  async up(queryInterface) {
    await createUser(queryInterface);
    await createGroups(queryInterface);
    await createUsersGroups(queryInterface);
    await createMessages(queryInterface);
    await createImages(queryInterface);
  },

  async down(queryInterface) {
    await deleteImages(queryInterface);
    await deleteMessages(queryInterface);
    await deleteUsersGroups(queryInterface);
    await deleteGroups(queryInterface);
    await deleteUsers(queryInterface);
  },
};
