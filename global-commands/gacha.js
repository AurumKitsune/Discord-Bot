const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();
const operators = require('../res/gacha/operators.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gacha')
		.setDescription('Gacha command')
		.addSubcommand(subcommand =>
			subcommand.setName('pull')
				.setDescription('Spend \u20A45 for a gacha pull')
		)
		.addSubcommand(subcommand =>
			subcommand.setName('sell')
				.setDescription('Sell your operators by rarity')
				.addStringOption(option =>
					option.setName('rarity')
						.setDescription('rarity you want to sell')
						.setRequired(true)
						.addChoices([
							['3*', '3*'],
							['4*', '4*'],
							['5*', '5*'],
							['6*', '6*'],
							['Limited', 'Limited']
						])
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('inventory')
				.setDescription('View how many of each rarity you have and which operators you have pulled')
		),
	async execute(interaction) {
		await interaction.deferReply();

		let userData = {};
		if (await db.get(interaction.user.id)) {
			userData = await db.get(interaction.user.id);
		}
		if (!userData.inventory) {
			userData.inventory = {
				'3* Count': 0,
				'4* Count': 0,
				'5* Count': 0,
				'6* Count': 0,
				'Limited Count': 0,
				'3* Owned': 0,
				'4* Owned': 0,
				'5* Owned': 0,
				'6* Owned': 0,
				'Limited Owned': 0
			};
		}
		
		let response = 'error';

		if (interaction.options.getSubcommand() === 'pull') {
			response = gachaPull(userData);
			await db.set(interaction.user.id, userData);
		}
		else if (interaction.options.getSubcommand() === 'sell') {
			response = gachaSell(interaction, userData);
			await db.set(interaction.user.id, userData);
		}
		else if (interaction.options.getSubcommand() === 'inventory') {
			response = gachaInventory(interaction, userData);
		}

		await interaction.editReply(response);
	}
};

function gachaPull(userData) {
	if (!userData.lmd || userData.lmd < 5) {
		return 'Not enough LMD';
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
	
	const opNum = Math.floor(Math.random() * operators[rarity].size);
	op = operators[rarity].ops[opNum].name;
	userData.inventory[`${rarity} Owned`] = userData.inventory[`${rarity} Owned`] | 2 ** opNum;

	userData.lmd -= 5;
	userData.inventory[`${rarity} Count`]++;

	const gachaEmbed = new MessageEmbed()
		.setColor('#86CECB')
		.setTitle(`You pulled ${op} (${rarity})`)
		.setImage(`attachment://${op.replace(/\s/g, '_')}.png`)
		.setFooter('You paid \u20A45 for pulling.');

	return {embeds: [gachaEmbed], files: [`./res/gacha/${rarity}/${op}.png`]};
}

function gachaSell(interaction, userData) {
	const rarity = interaction.options.getString('rarity');

	const amount = userData.inventory[`${rarity} Count`];

	if (amount == 0) {
		return `You do not have any ${rarity} operators`;
	}

	let sellPrice = 1;
	if (rarity === '4*') {
		sellPrice = 3;
	}
	else if (rarity === '5*') {
		sellPrice = 50;
	}
	else if (rarity === '6*') {
		sellPrice = 600;
	}
	else if (rarity === 'Limited') {
		sellPrice = 80000;
	}

	userData.lmd += amount * sellPrice;
	userData.inventory[`${rarity} Count`] = 0;

	return `Sold ${amount} **${rarity}** operator${amount === 1 ? '' : 's'} for \u20A4${amount * sellPrice}`;
}

function gachaInventory(interaction, userData) {
	// if (!userData.favoriteOp) {
	// 	userData.favoriteOp = {name: '', rarity: ''};
	// }

	const uniqueThreeStars = getUniqueOperators(userData, '3*');
	const uniqueFourStars = getUniqueOperators(userData, '4*');
	const uniqueFiveStars = getUniqueOperators(userData, '5*');
	const uniqueSixStars = getUniqueOperators(userData, '6*');
	const uniqueLimiteds = getUniqueOperators(userData, 'Limited');

	const inventoryEmbed = new MessageEmbed()
		.setColor('#86CECB')
		.setAuthor(`${interaction.user.username}'s Inventory`)
		// .setDescription(`Favorite Operator: ${userData.favoriteOp.name}`)
		// .setThumbnail(`attachment://${userData.favoriteOp.name}.png`)
		.addFields(
			{
				name: `3* Count: ${userData.inventory['3* Count']}\nUnique operators: ${uniqueThreeStars.count}/${operators['3*'].size}`,
				value: `${uniqueThreeStars.emotes}\n\u200B`
			},
			{
				name: `4* Count: ${userData.inventory['4* Count']}\nUnique operators: ${uniqueFourStars.count}/${operators['4*'].size}`,
				value: `${uniqueFourStars.emotes}\n\u200B`
			},
			{
				name: `5* Count: ${userData.inventory['5* Count']}\nUnique operators: ${uniqueFiveStars.count}/${operators['5*'].size}`,
				value: `${uniqueFiveStars.emotes}\n\u200B`
			},
			{
				name: `6* Count: ${userData.inventory['6* Count']}\nUnique operators: ${uniqueSixStars.count}/${operators['6*'].size}`,
				value: `${uniqueSixStars.emotes}\n\u200B`
			},
			{
				name: `Limited Count: ${userData.inventory['Limited Count']}\nUnique operators: ${uniqueLimiteds.count}/${operators['Limited'].size}`,
				value: `${uniqueLimiteds.emotes}\n\u200B`
			}
		);

	//return {embeds: [inventoryEmbed], files: [`./res/gacha/${userData.favoriteOp.rarity}/${userData.favoriteOp.name}.png`]};
	return {embeds: [inventoryEmbed]};
}

function getUniqueOperators(userData, rarity) {
	let emoteStr = '\u200B';
	let count = 0;

	for (let i = operators[rarity].size - 1; i >= 0; i--) {
		if (userData.inventory[`${rarity} Owned`] >= 2**i) {
			emoteStr += `<:${operators[rarity].ops[i].name.replace(/\s/g, '_')}:${operators[rarity].ops[i].emote}>`;
			count++;
			userData.inventory[`${rarity} Owned`] -= 2**i;
		}
	}

	return {count: count, emotes: emoteStr};
}