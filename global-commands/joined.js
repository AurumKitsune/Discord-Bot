const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joined')
		.setDescription('Replies with user info'),
	async execute(interaction) {
		let memberList = await interaction.guild.members.fetch();
		memberList.sort((curr, prev) => curr.joinedTimestamp > prev.joinedTimestamp ? 1 : -1);

		let str = '';
		for (let i = 0; i < memberList.size && i < 10; i++) {
			str += `${i+1}: ${memberList.at(i).displayName} - <t:${Math.floor(memberList.at(i).joinedTimestamp / 1000)}:D> \n`;
		}
		
		const joinedEmbed = new MessageEmbed()
			.setColor('#86CECB')
			.setTitle('Joined Leaderboard')
			.addFields(
				{name: '\u200B', value: str, inline: true}
			);
		await interaction.reply({embeds: [joinedEmbed]});
	}
};