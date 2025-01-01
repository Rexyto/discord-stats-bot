const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { clientId, token } = require('../config.json');
const fs = require('fs');
const path = require('path');

async function loadCommands(client) {
  const commands = [];
  const commandsPath = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('Iniciando actualización de comandos (/)');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log('Comandos (/) actualizados exitosamente');
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  loadCommands
};