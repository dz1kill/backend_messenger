"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("messages", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },

      deleted_by_users: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
        defaultValue: [],
      },

      sender_id: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "users",
          key: "id",
          as: "sender",
        },
      },

      receiver_id: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        allowNull: true,
        references: {
          model: "users",
          key: "id",
          as: "receiver",
        },
      },

      group_id: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        allowNull: true,
        references: {
          model: "groups",
          key: "id",
          as: "group",
        },
      },

      content: {
        type: Sequelize.STRING,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("messages");
  },
};
