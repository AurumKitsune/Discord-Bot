const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gacha')
		.setDescription('Spend $10 for a gacha pull'),
	async execute(interaction) {
		interaction.deferReply();
		let userData = {};
		if (await db.get(interaction.user.id)) {
			userData = await db.get(interaction.user.id);
		}

		if (!userData.lmd || userData.lmd < 10) {
			await interaction.editReply('Not enough LMD');
			return;
		}

		userData.lmd -= 10;

		await db.set(interaction.user.id, userData);

		let emote = 'error';
		const rng = Math.floor(Math.random() * 1000);
		
		let rareMiku = false;
		if (0 <= rng && rng < 5) {
			rareMiku = true;
		}

		if (rng == 0) {
			emote = 'Rare5';
		}
		else if (rng == 1 ) {
			emote = 'Rare4';
		}
		else if (rng == 2) {
			emote = 'Rare3';
		}
		else if (rng == 3) {
			emote = 'Rare2';
		}
		else if (rng == 4) {
			emote = 'Rare1';
		}
		else if (5 <= rng && rng < 50) {
			emote = 'Common1';
		}
		else if (50 <= rng && rng < 600) {
			emote = 'Common2';
		}
		else if (600 <= rng && rng < 1000) {
			emote = 'Bad';
		}

		const gachaEmbed = new MessageEmbed()
			.setColor('#86CECB')
			.setTitle('You pulled')
			.setImage('attachment://' + emote + '.png')
			.setFooter('You paid \u20A410 for pulling.');

		await interaction.editReply({embeds: [gachaEmbed], files: ['./res/gacha-images/' + emote + '.png']});
	}
};