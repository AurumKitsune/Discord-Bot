const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Replies with user profile')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('user profile to check')
		),
	async execute(interaction) {
		let user = interaction.options.getUser('user');
		if (!user) {
			user = interaction.user;
		}
		if (user.bot) {
			await interaction.reply({content: 'User is a bot', ephemeral: true});
			return;
		}
		
		let userData = {};
		if (await db.get(user.id)) {
			userData = await db.get(user.id);
		}

		if (!userData.mikuTime) {
			userData.mikuTime = 0;
		}
		if (!userData.lmd) {
			userData.lmd = 0;
		}
		if (!userData.karma) {
			userData.karma = 0;
		}

		const profileEmbed = new MessageEmbed()
			.setColor('#86CECB')
			.setTitle(`${user.username}'s Profile`)
			.setThumbnail(`${user.avatarURL()}`)
			.addFields(
				{name: 'LMD', value: `\u20A4${userData.lmd}`, inline: true},
				{name: '\u200B', value: '\u200B', inline: true},
				{name: 'Miku Time Count', value: `${userData.mikuTime}`, inline: true},
				{name: 'Karma', value: `${userData.karma}`, inline: true}
			);
		await interaction.reply({embeds: [profileEmbed]});
	}
};