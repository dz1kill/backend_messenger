const { hashPassword, getRandomIntInclusive } = require("./helper/common.js");
const crypto = require("crypto");

const DIALOGUES_PER_CHAT_MIN = 2;
const DIALOGUES_PER_CHAT_MAX = 4;
const GROUPS_PER_USER_MIN = 7;
const GROUPS_PER_USER_MAX = 14;
const WORKING_HOURS = { start: 9, end: 18 };

const DIALOGUES = [
  {
    topic: "project",
    messages: [
      { content: "Привет, как продвигается проект?", delay: 0 },
      {
        content: "Пока всё идёт по плану, но есть небольшие задержки",
        delay: 5,
      },
      { content: "Какие именно задержки?", delay: 10 },
      { content: "Не хватает данных от маркетинга", delay: 15 },
      { content: "Я уточню у них, когда будут данные", delay: 20 },
      { content: "Спасибо, это бы ускорило процесс", delay: 25 },
      { content: "Отправил тебе обновлённый план", delay: 120 },
      { content: "Получил, выглядит лучше", delay: 125 },
    ],
  },
  {
    topic: "meeting",
    messages: [
      { content: "Привет, во сколько встреча?", delay: 0 },
      { content: "Думаю в 15:00", delay: 2 },
      { content: "Можно перенести на 16:00?", delay: 5 },
      { content: "Да, без проблем", delay: 7 },
      { content: "Где встречаемся?", delay: 10 },
      { content: "В конференц-зале на 3 этаже", delay: 12 },
      { content: "Хорошо, до встречи", delay: 15 },
    ],
  },
  {
    topic: "weekend",
    messages: [
      { content: "Какие планы на выходные?", delay: 0 },
      { content: "Пока не решил, может поеду за город", delay: 5 },
      {
        content: "Мы с друзьями собираемся на шашлыки, присоединяйся",
        delay: 10,
      },
      { content: "Звучит отлично! Где и во сколько?", delay: 15 },
      { content: "В субботу в 12 у озера", delay: 20 },
      { content: "Что взять с собой?", delay: 25 },
      { content: "Можешь взять напитки", delay: 30 },
      { content: "Договорились!", delay: 35 },
    ],
  },
  {
    topic: "tech",
    messages: [
      { content: "Какой фреймворк будем использовать?", delay: 0 },
      { content: "Думаю React для фронта", delay: 5 },
      { content: "А для бэка?", delay: 10 },
      { content: "Node.js + Express", delay: 15 },
      { content: "А база данных?", delay: 20 },
      { content: "PostgreSQL, она лучше подходит", delay: 25 },
      { content: "Согласен, давай так", delay: 30 },
    ],
  },
  {
    topic: "movie",
    messages: [
      { content: "Смотрел новый фильм Марвел?", delay: 0 },
      { content: "Ещё нет, стоит посмотреть?", delay: 5 },
      { content: "Да, очень крутые спецэффекты", delay: 10 },
      { content: "А сюжет хороший?", delay: 15 },
      {
        content: "Сюжет стандартный для Марвел, но актёры отлично сыграли",
        delay: 20,
      },
      { content: "Тогда сходим вместе в выходные?", delay: 25 },
      { content: "Отличная идея!", delay: 30 },
    ],
  },
  {
    topic: "lunch",
    messages: [
      { content: "Ты на обед?", delay: 0 },
      { content: "Да, через 10 минут", delay: 2 },
      { content: "Куда пойдём?", delay: 5 },
      { content: "Может в новое кафе через дорогу?", delay: 8 },
      { content: "Там дорого, давай в столовую", delay: 10 },
      { content: "Ладно, встречаемся у лифта", delay: 12 },
    ],
  },
];

const groupNames = [
  "IT-Энтузиасты",
  "Киноманы",
  "Путешественники",
  "Книжные черви",
  "Фитнес-фанаты",
  "Стартаперы",
  "Игровая зона",
  "Гурманы",
  "Крипто-команда",
  "Музыканты",
  "Фото-клуб",
  "Историки",
  "Научный отряд",
  "Владельцы питомцев",
  "Эко-активисты",
  "Кофеманы",
  "Минмалисты",
  "Дизайн-сообщество",
  "Обитель разработчиков",
  "Клуб инвесторов",
  "Изучающие языки",
  "Поэтический уголок",
  "Фэнтези-фанаты",
  "Мемная фабрика",
  "Йога-клуб",
  "Заядлые путешественники",
  "Аниме-мир",
  "Родительский чат",
  "Удалёнщики",
  "Настольные игры",
];

const userNames = [
  ["Анна", "Иванова"],
  ["Борис", "Петров"],
  ["Сергей", "Смирнов"],
  ["Дарья", "Кузнецова"],
  ["Егор", "Попов"],
  ["Ольга", "Васильева"],
  ["Глеб", "Лебедев"],
  ["Татьяна", "Новикова"],
  ["Илья", "Морозов"],
  ["Юлия", "Волкова"],
  ["Кирилл", "Соловьёв"],
  ["Лариса", "Козлова"],
  ["Максим", "Зайцев"],
  ["Надежда", "Павлова"],
  ["Артём", "Семёнов"],
  ["Полина", "Голубева"],
  ["Роман", "Виноградов"],
  ["Светлана", "Богданова"],
  ["Тимофей", "Воробьёв"],
  ["Ульяна", "Фёдорова"],
];

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const getRandomDayOffset = () => {
  const rand = Math.random();

  if (rand < 0.2) {
    return getRandomIntInclusive(0, 1);
  } else if (rand < 0.6) {
    return getRandomIntInclusive(2, 3);
  } else {
    return getRandomIntInclusive(4, 5);
  }
};

const getRandomTimeForDay = (daysAgo) => {
  const now = new Date();
  const date = new Date(now);

  const actualDaysAgo = getRandomDayOffset();
  date.setDate(date.getDate() - actualDaysAgo);

  if (actualDaysAgo === 0) {
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
    } else if (
      currentHour >= WORKING_HOURS.start &&
      currentHour < WORKING_HOURS.end
    ) {
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

module.exports = {
  async up(queryInterface) {
    const users = await Promise.all(
      userNames.map(async ([first_name, last_name], i) => ({
        first_name,
        last_name,
        email: `email${i}@mail.com`,
        password: await hashPassword("1234"),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );
    await queryInterface.bulkInsert("users", users);
    await queryInterface.bulkInsert("users", [
      {
        first_name: "Admin",
        last_name: "Adminovich",
        email: `dz1k@mail.com`,
        password: await hashPassword("1234"),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    const createdUsers = await queryInterface.sequelize.query(
      "SELECT id FROM users",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const groups = groupNames.map((name) => ({
      id: crypto.randomUUID(),
      name,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await queryInterface.bulkInsert("groups", groups);
    const createdGroups = await queryInterface.sequelize.query(
      "SELECT id FROM groups",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const usersGroups = [];
    createdUsers.forEach((user) => {
      const groupCount = getRandomIntInclusive(
        GROUPS_PER_USER_MIN,
        GROUPS_PER_USER_MAX
      );
      shuffleArray([...createdGroups])
        .slice(0, groupCount)
        .forEach((group) => {
          usersGroups.push({ user_id: user.id, group_id: group.id });
        });
    });
    await queryInterface.bulkInsert("users_groups", usersGroups);

    const messages = [];
    const now = new Date();

    for (let i = 0; i < createdUsers.length; i++) {
      for (let j = i + 1; j < createdUsers.length; j++) {
        const dialoguesCount = getRandomIntInclusive(
          DIALOGUES_PER_CHAT_MIN,
          DIALOGUES_PER_CHAT_MAX
        );
        const selectedDialogues = shuffleArray([...DIALOGUES]).slice(
          0,
          dialoguesCount
        );

        for (let dayOffset = 0; dayOffset < dialoguesCount; dayOffset++) {
          const dialogue = selectedDialogues[dayOffset];
          const dayStart = getRandomTimeForDay(dayOffset);

          if (dayStart > now) continue;

          dialogue.messages.forEach((msg) => {
            const messageTime = new Date(
              dayStart.getTime() + msg.delay * 60000
            );
            if (messageTime > now) return;

            const sender_id =
              msg.delay % 2 === 0 ? createdUsers[i].id : createdUsers[j].id;
            const receiver_id =
              msg.delay % 2 === 0 ? createdUsers[j].id : createdUsers[i].id;

            messages.push({
              id: crypto.randomUUID(),
              sender_id,
              receiver_id,
              content: msg.content,
              created_at: messageTime,
              updated_at: new Date(),
            });
          });
        }
      }
    }

    for (const group of createdGroups) {
      const groupUserIds = usersGroups
        .filter((ug) => ug.group_id === group.id)
        .map((ug) => ug.user_id);

      if (groupUserIds.length === 0) continue;

      const dialoguesCount = getRandomIntInclusive(
        DIALOGUES_PER_CHAT_MIN,
        DIALOGUES_PER_CHAT_MAX
      );
      const selectedDialogues = shuffleArray([...DIALOGUES]).slice(
        0,
        dialoguesCount
      );

      for (let dayOffset = 0; dayOffset < dialoguesCount; dayOffset++) {
        const dialogue = selectedDialogues[dayOffset];
        const dayStart = getRandomTimeForDay(dayOffset);

        if (dayStart > now) continue;

        dialogue.messages.forEach((msg) => {
          const messageTime = new Date(dayStart.getTime() + msg.delay * 60000);
          if (messageTime > now) return;

          messages.push({
            id: crypto.randomUUID(),
            sender_id:
              groupUserIds[Math.floor(Math.random() * groupUserIds.length)],
            group_id: group.id,
            content: msg.content,
            created_at: messageTime,
            updated_at: new Date(),
          });
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
