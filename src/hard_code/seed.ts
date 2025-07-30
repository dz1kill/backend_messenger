import { hashPassword, getRandomIntInclusive } from "./helper";
import { Sequelize } from "sequelize-typescript";
import sequelize from "../models";
import { v4 as uuidv4 } from "uuid";
import { DIALOGUES, groupNames, userNames } from "./constants";
import { User } from "../models/user";
import { Group } from "../models/group";
import { UserGroup } from "../models/group_user";
import { Message } from "../models/message";
const DIALOGUES_PER_CHAT_MIN = 2;
const DIALOGUES_PER_CHAT_MAX = 4;
const GROUPS_PER_USER_MIN = 7;
const GROUPS_PER_USER_MAX = 14;
const WORKING_HOURS = { start: 9, end: 18 };
const shuffleArray = (array: any[]) => array.sort(() => 0.5 - Math.random());

const getRandomDayOffset = () => {
  const rand = Math.random();
  if (rand < 0.2) return getRandomIntInclusive(0, 1);
  else if (rand < 0.6) return getRandomIntInclusive(2, 3);
  else return getRandomIntInclusive(4, 5);
};

const getRandomTimeForDay = () => {
  const now = new Date();
  const date = new Date(now);
  const offset = getRandomDayOffset();
  date.setDate(date.getDate() - offset);

  if (offset === 0) {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    if (currentHour < WORKING_HOURS.start) {
      date.setDate(date.getDate() - 1);
      date.setHours(
        getRandomIntInclusive(WORKING_HOURS.start, WORKING_HOURS.end),
        getRandomIntInclusive(0, 59),
        0,
        0
      );
    } else if (currentHour < WORKING_HOURS.end) {
      date.setHours(
        getRandomIntInclusive(WORKING_HOURS.start, currentHour),
        currentHour === WORKING_HOURS.start
          ? getRandomIntInclusive(0, currentMinute)
          : getRandomIntInclusive(0, 59),
        0,
        0
      );
    } else {
      date.setHours(
        getRandomIntInclusive(WORKING_HOURS.start, WORKING_HOURS.end),
        getRandomIntInclusive(0, 59),
        0,
        0
      );
    }
  } else {
    date.setHours(
      getRandomIntInclusive(WORKING_HOURS.start, WORKING_HOURS.end),
      getRandomIntInclusive(0, 59),
      0,
      0
    );
  }

  return date;
};

export async function addSeed() {
  try {
    await sequelize.sync();

    // Users
    const users = await Promise.all(
      userNames.map(async ([firstName, lastName], i) => {
        return User.create({
          firstName,
          lastName,
          email: `email${i}@mail.com`,
          password: await hashPassword("1234"),
        });
      })
    );
    User.create({
      firstName: "Admin",
      lastName: "Aminovich",
      email: `admin@mail.com`,
      password: await hashPassword("310281"),
    });
    // Groups
    const now = new Date();
    const groups = await Promise.all(
      groupNames.map((name) =>
        Group.create({
          id: uuidv4(),
          name,
          createdAt: now,
          updatedAt: now,
        })
      )
    );

    // UsersGroups
    const userGroupEntries: { userId: string; groupId: string }[] = [];
    for (const user of users) {
      const groupCount = getRandomIntInclusive(
        GROUPS_PER_USER_MIN,
        GROUPS_PER_USER_MAX
      );
      const selectedGroups = shuffleArray([...groups]).slice(0, groupCount);
      for (const group of selectedGroups) {
        userGroupEntries.push({ userId: user.id, groupId: group.id });
      }
    }
    await UserGroup.bulkCreate(userGroupEntries);

    // Messages
    const messages: any[] = [];

    // Private messages
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const dialoguesCount = getRandomIntInclusive(
          DIALOGUES_PER_CHAT_MIN,
          DIALOGUES_PER_CHAT_MAX
        );
        const selectedDialogues = shuffleArray([...DIALOGUES]).slice(
          0,
          dialoguesCount
        );

        for (let k = 0; k < dialoguesCount; k++) {
          const dialogue = selectedDialogues[k];
          const dayStart = getRandomTimeForDay();
          if (dayStart > now) continue;

          for (const msg of dialogue.messages) {
            const msgTime = new Date(dayStart.getTime() + msg.delay * 60000);
            if (msgTime > now) continue;

            const sender = msg.delay % 2 === 0 ? users[i] : users[j];
            const receiver = msg.delay % 2 === 0 ? users[j] : users[i];

            messages.push({
              id: uuidv4(),
              senderId: sender.id,
              receiverId: receiver.id,
              content: msg.content,
              createdAt: msgTime,
              updatedAt: new Date(),
            });
          }
        }
      }
    }

    // Group messages
    for (const group of groups) {
      const memberUserIds = userGroupEntries
        .filter((ug) => ug.groupId === group.id)
        .map((ug) => ug.userId);

      if (memberUserIds.length === 0) continue;

      const dialoguesCount = getRandomIntInclusive(
        DIALOGUES_PER_CHAT_MIN,
        DIALOGUES_PER_CHAT_MAX
      );
      const selectedDialogues = shuffleArray([...DIALOGUES]).slice(
        0,
        dialoguesCount
      );

      for (let i = 0; i < dialoguesCount; i++) {
        const dialogue = selectedDialogues[i];
        const dayStart = getRandomTimeForDay();
        if (dayStart > now) continue;

        for (const msg of dialogue.messages) {
          const msgTime = new Date(dayStart.getTime() + msg.delay * 60000);
          if (msgTime > now) continue;

          const senderId =
            memberUserIds[Math.floor(Math.random() * memberUserIds.length)];

          messages.push({
            id: uuidv4(),
            senderId,
            groupId: group.id,
            content: msg.content,
            createdAt: msgTime,
            updatedAt: new Date(),
          });
        }
      }
    }

    await Message.bulkCreate(messages);
    console.log("✅ Seed completed successfully");
  } catch (err) {
    console.error("❌ Error during seed:", err);
  }
}
