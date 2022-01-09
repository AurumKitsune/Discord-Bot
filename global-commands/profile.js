const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const getUserData = require('../helper-functions/get_user_data');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Replies with user profile')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('user profile to check')
		),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		if (!user) {
			user = interaction.user;
		}
		
		if (user.bot) {
			await interaction.reply({content: 'User is a bot', ephemeral: true});
			return;
		}
		
		let userData = getUserData(user.id);

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