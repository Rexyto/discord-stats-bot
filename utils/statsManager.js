const { getConnection } = require('./database');
const { ChannelType } = require('discord.js');

// Función para obtener las estadísticas del servidor
async function getGuildStats(guild, members) {
  return {
    humans: members.filter(member => !member.user.bot).size,
    bots: members.filter(member => member.user.bot).size,
    roles: guild.roles.cache.size - 1, // Excluir @everyone
    emojis: guild.emojis.cache.size
  };
}

// Función para actualizar un solo canal
async function updateChannel(guild, channelId, name) {
  if (!channelId) return;
  
  const channel = guild.channels.cache.get(channelId);
  if (channel && channel.name !== name) {
    try {
      await channel.setName(name);
    } catch (error) {
      console.error(`Error al actualizar canal ${channelId}:`, error);
    }
  }
}

// Función principal de actualización
async function updateStats(guild) {
  try {
    // Obtener miembros y datos del servidor
    const members = await guild.members.fetch();
    
    const connection = await getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM guild_stats WHERE guild_id = ?',
        [guild.id]
      );

      if (rows.length === 0) return;
      const stats = rows[0];

      // Obtener estadísticas
      const guildStats = await getGuildStats(guild, members);
      const total = guildStats.humans + guildStats.bots;

      // Definir actualizaciones
      const updates = [
        {
          channelId: stats.total_channel,
          name: `📊 Total: ${total}`
        },
        {
          channelId: stats.members_channel,
          name: `👥 Miembros: ${guildStats.humans}`
        },
        {
          channelId: stats.bots_channel,
          name: `🤖 Bots: ${guildStats.bots}`
        },
        {
          channelId: stats.roles_channel,
          name: `📑 Roles: ${guildStats.roles}`
        },
        {
          channelId: stats.emojis_channel,
          name: `😄 Emojis: ${guildStats.emojis}`
        }
      ];

      // Actualizar canales con delay entre cada uno
      for (const update of updates) {
        await updateChannel(guild, update.channelId, update.name);
        // Esperar 1 segundo entre actualizaciones para evitar rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error en updateStats:', error);
  }
}

module.exports = {
  updateStats
};