const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with available commands'),
	async execute(interaction) {
		const helpEmbed = new MessageEmbed()
			.setColor('#86CECB')
			.setTitle('Help')
			.addFields(
				{name: 'Server', value: 'info\ndisable\ndisabled', inline: true},
				{name: '\u200b', value: '\u200b', inline: true},
				{name: 'Social', value: 'profile', inline: true},
				{name: 'Fun', value: 'say\nsayd\nburger\nmeme\nweebmusic\ndab\nbirdfact\nman', inline: true}
			);
		await interaction.reply({embeds: [helpEmbed]});
	}
};