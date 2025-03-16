"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const articles = [];
    for (let i = 0; i < 100; i++) {
      articles.push({
        title: `Article ${i}`,
        content: `Content ${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert("Articles", articles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Articles", null, {});
  },
};
