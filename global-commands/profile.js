const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Replies with user profile'),
	async execute(interaction) {
		let userData = {};
		if (await db.get(interaction.user.id)) {
			userData = await db.get(interaction.user.id);
		}

		if (!userData.mikuTime) {
			userData.mikuTime = 0;
		}
		if (!userData.lmd) {
			userData.lmd = 0;
		}

		const profileEmbed = new MessageEmbed()
			.setColor('#86CECB')
			.setAuthor(`${interaction.user.tag}`, `${interaction.user.avatarURL()}`)
			.setThumbnail(`${interaction.user.avatarURL()}`)
			.addFields(
				{name: 'ID', value: `${interaction.user.id}`, inline: true},
				{name: '\u200B', value: '\u200B', inline: true},
				{name: 'Account Created', value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:D>`, inline: true},
				{name: 'LMD', value: `\u20A4${userData.lmd}`, inline: true},
				{name: '\u200B', value: '\u200B', inline: true},
				{name: 'Miku Time Count', value: `${userData.mikuTime}`, inline: true}
			);
		await interaction.reply({embeds: [profileEmbed]});
	}
};