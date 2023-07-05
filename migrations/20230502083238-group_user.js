"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users_groups", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      group_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "groups",
          key: "id",
        },
      },

      user_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    });

    await queryInterface.addConstraint("users_groups", {
      type: "UNIQUE",
      name: "user_id_group_id_unique",
      fields: ["user_id", "group_id"],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "users_groups",
      "user_id_group_id_unique"
    );
    await queryInterface.dropTable("users_groups");
  },
};
