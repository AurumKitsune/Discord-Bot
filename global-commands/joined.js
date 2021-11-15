const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joined')
		.setDescription('Replies with user info')
		.addIntegerOption(option => 
			option.setName('page')
				.setDescription('Page of leaderboard you want to see')
		),
	async execute(interaction) {
		await interaction.deferReply();

		let memberList = await interaction.guild.members.fetch();
		memberList = memberList
			.filter(member => member.user.bot == false)
			.sort((curr, prev) => curr.joinedTimestamp > prev.joinedTimestamp ? 1 : -1);

		const pages = Math.ceil(memberList.size / 10);

		let pageNum = 1;
		if (interaction.options.getInteger('page')) {
			pageNum = interaction.options.getInteger('page');
		}
		
		if (pageNum <= 0 || pageNum > pages) {
			let errorStr = 'Please select a valid page number';
			if (pages > 1) {
				errorStr += ' (1-' + pages + ')';
			}

			await interaction.editReply(errorStr);
			return;
		}

		let str = '';
		for (let i = (pageNum - 1) * 10; i < memberList.size && i < 10; i++) {
			str += `${i+1}: ${memberList.at(i).displayName} - <t:${Math.floor(memberList.at(i).joinedTimestamp / 1000)}:D> \n`;
		}
		
		const joinedEmbed = new MessageEmbed()
			.setColor('#86CECB')
			.setTitle('Joined Leaderboard')
			.addField('\u200B', str, false)
			.setFooter('page: ' + pageNum + '/' + pages);
		await interaction.editReply({embeds: [joinedEmbed]});
	}
};