const mysql = require('mysql2/promise');
const config = require('../config.json');

async function setupDatabase() {
  const connection = await mysql.createConnection(config.database);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS guild_stats (
      guild_id VARCHAR(255) PRIMARY KEY,
      total_channel VARCHAR(255),
      members_channel VARCHAR(255),
      bots_channel VARCHAR(255),
      roles_channel VARCHAR(255),
      emojis_channel VARCHAR(255)
    )
  `);

  await connection.end();
}

async function getConnection() {
  return await mysql.createConnection(config.database);
}

module.exports = {
  setupDatabase,
  getConnection
};