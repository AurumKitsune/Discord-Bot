const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gacha')
		.setDescription('Spend $10 for a gacha pull'),
	async execute(interaction) {
		let emote = 'error';
		const rng = Math.floor(Math.random() * 1017);
		
		let rareMiku = false;
		if (0 <= rng && rng <= 16) {
			rareMiku = true;
		}

		if (rng == 0) {
			emote = 'Rare5';
		}
		else if (1 <= rng && rng <= 3) {
			emote = 'Rare4';
		}
		else if (4 <= rng && rng <= 6) {
			emote = 'Rare3';
		}
		else if (7 <= rng && rng <= 11) {
			emote = 'Rare2';
		}
		else if (12 <= rng && rng <= 16) {
			emote = 'Rare1';
		}
		else if (17 <= rng && rng <= 266) {
			emote = 'Common1';
		}
		else if (267 <= rng && rng <= 516) {
			emote = 'Common2';
		}
		else if (517 <= rng && rng <= 1016) {
			emote = 'Bad';
		}

		const gachaEmbed = new MessageEmbed()
			.setColor('#86CECB')
			.setTitle('You pulled')
			.setImage('attachment://' + emote + '.png')
			.setFooter('You paid $10 for pulling.');

		await interaction.reply({embeds: [gachaEmbed], files: ['./res/gacha-images/' + emote + '.png']});
	}
};