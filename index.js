const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');
const { setupDatabase } = require('./utils/database');
const { loadCommands } = require('./utils/loadCommands');
const { updateStats } = require('./utils/statsManager');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers
  ]
});

client.commands = new Collection();

async function initialize() {
  try {
    // Configurar base de datos
    await setupDatabase();
    
    // Cargar comandos
    await loadCommands(client);

    // Eventos del cliente
    client.on('ready', () => {
      console.log(`Bot conectado como ${client.user.tag}`);
      // Actualizar stats para todos los servidores al inicio
      client.guilds.cache.forEach(guild => {
        updateStats(guild);
      });
    });

    client.on('interactionCreate', async interaction => {
      if (!interaction.isCommand()) return;

      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const errorEmbed = {
          color: 0xFF0000,
          title: '❌ Error',
          description: 'Hubo un error al ejecutar el comando.',
          timestamp: new Date()
        };
        
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    });

    // Eventos para actualización de stats
    client.on('guildMemberAdd', member => {
      updateStats(member.guild);
    });

    client.on('guildMemberRemove', member => {
      updateStats(member.guild);
    });

    client.on('emojiCreate', emoji => {
      updateStats(emoji.guild);
    });

    client.on('emojiDelete', emoji => {
      updateStats(emoji.guild);
    });

    client.on('roleCreate', role => {
      updateStats(role.guild);
    });

    client.on('roleDelete', role => {
      updateStats(role.guild);
    });

    // Conectar el bot
    await client.login(token);
  } catch (error) {
    console.error('Error al inicializar el bot:', error);
    process.exit(1);
  }
}

initialize();