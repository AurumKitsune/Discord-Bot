const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();
const operators = require('../res/gacha/operators.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gacha')
		.setDescription('Spend \u20A45 for a gacha pull'),
	async execute(interaction) {
		interaction.deferReply();
		let userData = {};
		if (await db.get(interaction.user.id)) {
			userData = await db.get(interaction.user.id);
		}

		if (!userData.lmd || userData.lmd < 5) {
			await interaction.editReply('Not enough LMD');
			return;
		}
		if (!userData.inventory) {
			userData.inventory = {
				'3* Count': 0,
				'4* Count': 0,
				'5* Count': 0,
				'6* Count': 0,
				'Limited Count': 0
			};
		}

		let rarity = 'error';
		let op = 'error';
		const rng = Math.floor(Math.random() * 100000);

		if (60000 <= rng && rng < 100000) {
			rarity = '3*';
		}
		else if (5000 <= rng && rng < 60000) {
			rarity = '4*';
		}
		else if (500 <= rng && rng < 5000) {
			rarity = '5*';
		}
		else if (5 <= rng && rng < 500) {
			rarity = '6*';
		}
		else if (0 <= rng && rng < 5) {
			rarity = 'Limited';
		}
		
		op = operators[rarity].ops[Math.floor(Math.random() * operators[rarity].size)];

		userData.lmd -= 5;
		userData.inventory[`${rarity} Count`]++;

		await db.set(interaction.user.id, userData);

		const gachaEmbed = new MessageEmbed()
			.setColor('#86CECB')
			.setTitle(`You pulled a ${rarity}`)
			.setImage('attachment://' + op + '.png')
			.setFooter('You paid \u20A45 for pulling.');

		await interaction.editReply({embeds: [gachaEmbed], files: [`./res/gacha/${rarity}/${op}.png`]});
	}
};


/*
Pull cost: $5

Limited 6* - Pull chance 0.005% - Sell for $1000
W
Skalter
Rosmontis
Dusk
Ash

6* - Pull chance 0.495% - Sell for $100
Suzuran
Eyjafjalla
Weedy
Saria
Mudrock
Kaltsit
Surtr
Blaze
Archetto
Bagpipe
Saga

5* - Pull chance 4.5% - Sell for $10
Platinum
Ptilopsis
Warfarin
Texas
Specter
Lappland
Amiya
Blue Poison
Pramanix

4* - Pull chance 55% - Sell for $3
Gravel
Myrtle
Jessica
Sussuro
Vigna
Sussuro
Gummy
Perfumer
Pinecone
Beanstalk

3* - Pull chance 40% - Sell for $1
Kroos
Popukar
Fang
Melantha
Ansel
*/