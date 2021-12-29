const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with user info')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('user info to check')
		),
	async execute(interaction) {
		let targetUser = interaction.options.getUser('target');
		if (!targetUser) {
			targetUser = interaction.user;
		}

		const targetMember = await interaction.guild.members.fetch(targetUser.id);

		const profileEmbed = new MessageEmbed()
			.setColor('#86CECB')
			.setAuthor(`${targetUser.tag}`, `${targetUser.avatarURL()}`)
			.setThumbnail(`${targetUser.avatarURL()}`)
			.addFields(
				{name: 'ID', value: `${targetUser.id}`, inline: true},
				{name: '\u200B', value: '\u200B', inline: true},
				{name: 'Account Created', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:D>`, inline: true},
				{name: 'Joined On', value: `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:D>`, inline: true},
				{name: 'Roles', value: `${getRoles(targetMember)}`}
			);
		await interaction.reply({embeds: [profileEmbed]});
	}
};

function getRoles(targetMember) {
	let roleStr = '\u200B';
	targetMember.roles.cache.forEach(role => {
		if (role.name === '@everyone') {
			return;
		}

		roleStr += role.name + ', ';
	});

	if (roleStr !== '\u200B') {
		roleStr = roleStr.substr(0, roleStr.length - 2);
	}

	return roleStr;
}