const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Replies with bot info!'),
	async execute(interaction) {
		const infoEmbed = new MessageEmbed()
			.setColor('#86CECB')
			.setTitle('Info')
			.addFields(
				{name: 'Created by AurumKitsune', value: 'Type /help for commands', inline: true}
			);
		await interaction.reply({embeds: [infoEmbed]});
	}
};