const { hashPassword, getRandomIntInclusive } = require("./helper/common.js");
const crypto = require("crypto");

const NUMBER_OF_USERS = 20;
const NUMBER_OF_GROUPS = 30;
const MESSAGES_PER_CONVERSATION_MIN = 20;
const MESSAGES_PER_CONVERSATION_MAX = 30;
const GROUPS_PER_USER_MIN = 7;
const GROUPS_PER_USER_MAX = 14;
const MESSAGE_TEMPLATES = [
  "Hey, how's it going?",
  "Did you see the update?",
  "Let's meet up tomorrow.",
  "I'll send the file soon.",
  "Can we talk about the project?",
  "Nice work on the last task!",
  "Are we still on for tonight?",
  "Check this out!",
  "Thanks for the quick response.",
  "Got it, thanks!",
  "What time is the meeting?",
  "That's awesome!",
  "Talk to you later.",
  "No worries, take your time.",
  "I totally agree with you.",
];

const groupNames = [
  "Tech Geeks",
  "Movie Buffs",
  "Wanderlust",
  "Bookworms United",
  "Fitness Freaks",
  "Startup Founders",
  "Gamers Arena",
  "Food Lovers",
  "Crypto Crew",
  "Music Makers",
  "Photography Club",
  "History Nerds",
  "Science Squad",
  "Pet Owners",
  "Eco Warriors",
  "Coffee Addicts",
  "Minimalist Life",
  "Design Hub",
  "Developers Den",
  "Investors Circle",
  "Language Learners",
  "Poetry Lounge",
  "Fantasy Fans",
  "Meme Factory",
  "Yoga Retreat",
  "Travel Junkies",
  "Anime World",
  "Parents Group",
  "Remote Workers",
  "Board Games Club",
];

const userNames = [
  ["Alice", "Johnson"],
  ["Bob", "Smith"],
  ["Charlie", "Brown"],
  ["Diana", "Miller"],
  ["Ethan", "Davis"],
  ["Fiona", "Wilson"],
  ["George", "Taylor"],
  ["Hannah", "Moore"],
  ["Ian", "Anderson"],
  ["Julia", "Thomas"],
  ["Kevin", "Jackson"],
  ["Laura", "White"],
  ["Mike", "Harris"],
  ["Nina", "Martin"],
  ["Oscar", "Lee"],
  ["Paula", "Clark"],
  ["Quentin", "Lewis"],
  ["Rachel", "Walker"],
  ["Steve", "Young"],
  ["Tina", "Hall"],
];

const getRandomMessage = () => {
  return MESSAGE_TEMPLATES[
    Math.floor(Math.random() * MESSAGE_TEMPLATES.length)
  ];
};

const getRandomDateWithinLast5Days = () => {
  const now = new Date();
  const past = new Date(now);
  past.setDate(past.getDate() - 5);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime())
  );
};

module.exports = {
  async up(queryInterface) {
    // USERS
    const users = [];
    for (let i = 0; i < NUMBER_OF_USERS; i++) {
      const [first_name, last_name] = userNames[i];
      const password = await hashPassword("1234");
      users.push({
        first_name,
        last_name,
        email: `email${i}@mail.com`,
        password,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert("users", users);

    // GROUPS
    const groups = groupNames.map((name) => ({
      id: crypto.randomUUID(),
      name,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await queryInterface.bulkInsert("groups", groups);

    // Fetch created users & groups
    const createdUsers = (
      await queryInterface.sequelize.query("SELECT id FROM users")
    )[0];
    const createdGroups = (
      await queryInterface.sequelize.query("SELECT id FROM groups")
    )[0];

    // USERS_GROUPS
    const usersGroups = [];
    for (const user of createdUsers) {
      const groupCount = getRandomIntInclusive(
        GROUPS_PER_USER_MIN,
        GROUPS_PER_USER_MAX
      );
      const shuffledGroups = [...createdGroups].sort(() => 0.5 - Math.random());
      for (let i = 0; i < groupCount; i++) {
        usersGroups.push({ user_id: user.id, group_id: shuffledGroups[i].id });
      }
    }
    await queryInterface.bulkInsert("users_groups", usersGroups);

    // MESSAGES
    const messages = [];

    // Generate private conversations (each pair of users)
    for (let i = 0; i < createdUsers.length; i++) {
      for (let j = i + 1; j < createdUsers.length; j++) {
        const messageCount = getRandomIntInclusive(
          MESSAGES_PER_CONVERSATION_MIN,
          MESSAGES_PER_CONVERSATION_MAX
        );

        for (let k = 0; k < messageCount; k++) {
          // Alternate sender between the two users
          const sender_id =
            k % 2 === 0 ? createdUsers[i].id : createdUsers[j].id;
          const receiver_id =
            k % 2 === 0 ? createdUsers[j].id : createdUsers[i].id;

          messages.push({
            id: crypto.randomUUID(),
            sender_id,
            receiver_id,
            content: getRandomMessage(),
            created_at: getRandomDateWithinLast5Days(),
            updated_at: new Date(),
          });
        }
      }
    }

    // Generate group conversations
    for (const group of createdGroups) {
      const groupUsers = usersGroups
        .filter((ug) => ug.group_id === group.id)
        .map((ug) => ug.user_id);

      if (groupUsers.length === 0) continue;

      const messageCount = getRandomIntInclusive(
        MESSAGES_PER_CONVERSATION_MIN,
        MESSAGES_PER_CONVERSATION_MAX
      );

      for (let i = 0; i < messageCount; i++) {
        const sender_id =
          groupUsers[Math.floor(Math.random() * groupUsers.length)];

        messages.push({
          id: crypto.randomUUID(),
          sender_id,
          group_id: group.id,
          content: getRandomMessage(),
          created_at: getRandomDateWithinLast5Days(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert("messages", messages);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("messages", null);
    await queryInterface.bulkDelete("users_groups", null);
    await queryInterface.bulkDelete("groups", null);
    await queryInterface.bulkDelete("users", null);
  },
};
