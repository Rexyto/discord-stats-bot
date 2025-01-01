const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getConnection } = require('../utils/database');
const { updateStats } = require('../utils/statsManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats-server')
    .setDescription('Configura los canales de estadísticas del servidor')
    .addChannelOption(option =>
      option.setName('total')
        .setDescription('Canal para mostrar el total de usuarios')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('miembros')
        .setDescription('Canal para mostrar el total de miembros')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('bots')
        .setDescription('Canal para mostrar el total de bots')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('roles')
        .setDescription('Canal para mostrar el total de roles')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('emojis')
        .setDescription('Canal para mostrar el total de emojis')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      const errorEmbed = {
        color: 0xFF0000,
        title: '❌ Error de Permisos',
        description: 'Necesitas ser administrador para usar este comando.',
        timestamp: new Date()
      };
      
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const connection = await getConnection();
      
      const channels = {
        total: interaction.options.getChannel('total'),
        miembros: interaction.options.getChannel('miembros'),
        bots: interaction.options.getChannel('bots'),
        roles: interaction.options.getChannel('roles'),
        emojis: interaction.options.getChannel('emojis')
      };

      // Verificar que todos los canales sean de voz
      for (const [name, channel] of Object.entries(channels)) {
        if (channel.type !== 2) { // 2 es el tipo de canal de voz
          const errorEmbed = {
            color: 0xFF0000,
            title: '❌ Error de Configuración',
            description: `El canal ${name} debe ser un canal de voz.`,
            timestamp: new Date()
          };
          
          await connection.end();
          return interaction.editReply({ embeds: [errorEmbed] });
        }
      }

      // Guardar en la base de datos
      await connection.execute(
        `INSERT INTO guild_stats (guild_id, total_channel, members_channel, bots_channel, roles_channel, emojis_channel)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         total_channel = VALUES(total_channel),
         members_channel = VALUES(members_channel),
         bots_channel = VALUES(bots_channel),
         roles_channel = VALUES(roles_channel),
         emojis_channel = VALUES(emojis_channel)`,
        [
          interaction.guild.id,
          channels.total.id,
          channels.miembros.id,
          channels.bots.id,
          channels.roles.id,
          channels.emojis.id
        ]
      );

      await connection.end();

      // Actualizar estadísticas inmediatamente
      await updateStats(interaction.guild);

      const successEmbed = {
        color: 0x00FF00,
        title: '✅ Configuración Exitosa',
        description: 'Los canales de estadísticas han sido configurados correctamente.',
        fields: [
          { name: '📊 Total', value: channels.total.name, inline: true },
          { name: '👥 Miembros', value: channels.miembros.name, inline: true },
          { name: '🤖 Bots', value: channels.bots.name, inline: true },
          { name: '📑 Roles', value: channels.roles.name, inline: true },
          { name: '😄 Emojis', value: channels.emojis.name, inline: true }
        ],
        timestamp: new Date(),
        footer: {
          text: 'Las estadísticas se actualizarán automáticamente'
        }
      };

      await interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = {
        color: 0xFF0000,
        title: '❌ Error',
        description: 'Hubo un error al configurar los canales de estadísticas.',
        timestamp: new Date()
      };
      
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};