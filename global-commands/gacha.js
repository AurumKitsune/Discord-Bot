const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();
const getUserData = require('../helper-functions/get_user_data');
const gachaData = require('../res/gachaData.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gacha')
		.setDescription('Gacha command')
		.addSubcommand(subcommand =>
			subcommand.setName('pull')
				.setDescription('Spend \u20A410 for a gacha pull')
				.addIntegerOption(option => 
					option.setName('count')
						.setDescription('number of pulls to do')
						.addChoices([
							['1', 1],
							['5', 5],
							['10', 10]
						])
				)
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
		)
		.addSubcommand(subcommand =>
			subcommand.setName('favorite')
				.setDescription('Set your favorite operator')
				.addStringOption(option =>
					option.setName('operator')
						.setDescription('name of operator you want to favorite')
						.setRequired(true)
				)
		),
	async execute(interaction) {
		await interaction.deferReply();

		let userData = await getUserData(interaction.user.id);
		
		let response = 'error';
		if (interaction.options.getSubcommand() === 'pull') {
			response = gachaPull(interaction, userData);
			await db.set(interaction.user.id, userData);
		}
		else if (interaction.options.getSubcommand() === 'sell') {
			response = gachaSell(interaction, userData);
			await db.set(interaction.user.id, userData);
		}
		else if (interaction.options.getSubcommand() === 'inventory') {
			response = gachaInventory(interaction, userData);
		}
		else if (interaction.options.getSubcommand() === 'favorite') {
			response = gachaFavorite(interaction, userData);
			await db.set(interaction.user.id, userData);
		}

		await interaction.editReply(response);
	}
};

function gachaPull(interaction, userData) {
	const pullCost = 10;

	let pullCount = interaction.options.getInteger('count');
	if (!pullCount) {
		pullCount = 1;
	}

	if (!userData.hasOwnProperty('lmd') || userData.lmd < pullCost * pullCount) {
		return 'Not enough LMD';
	}

	let operatorData = [];
	let highestRarity = {rarity: '3*', color: '#CCCCCC'};
	const rarities = ['3*', '4*', '5*', '6*', 'Limited'];
	for (let i = 0; i < pullCount; i++) {
		operatorData[i] = getRandomOperator();

		userData.inventory[`${operatorData[i].rarity} Owned`] = userData.inventory[`${operatorData[i].rarity} Owned`] | 2 ** operatorData[i].index;
		userData.inventory[`${operatorData[i].rarity} Count`]++;


		if (rarities.indexOf(operatorData[i].rarity) > rarities.indexOf(highestRarity.rarity)) {
			highestRarity.rarity = operatorData[i].rarity;
			highestRarity.color = operatorData[i].color;
		}
	}

	userData.lmd -= pullCost * pullCount;

	if (pullCount === 1) {
		const gachaEmbed = new MessageEmbed()
			.setColor(`${operatorData[0].color}`)
			.setTitle(`You pulled ${operatorData[0].name} (${operatorData[0].rarity})`)
			.setImage(`attachment://${gachaData[operatorData[0].rarity].operators[operatorData[0].index].image.replace('https://i.imgur.com/', '')}`)
			.setFooter(`You paid \u20A4${pullCost * pullCount} for pulling.`);

		return {embeds: [gachaEmbed], files: [`${gachaData[operatorData[0].rarity].operators[operatorData[0].index].image}`]};
	}
	else {
		const gachaEmbed = new MessageEmbed()
			.setColor(`${highestRarity.color}`)
			.setTitle('You pulled:')
			.setFooter(`You paid \u20A4${pullCost * pullCount} for pulling.`);

		for (let i = 0; i < pullCount; i++) {
			gachaEmbed.addField(`${operatorData[i].name}`, getOperatorEmote(operatorData[i].rarity, operatorData[i].index));
		}

		return {embeds: [gachaEmbed]};
	}
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
		sellPrice = 40;
	}
	else if (rarity === '6*') {
		sellPrice = 450;
	}
	else if (rarity === 'Limited') {
		sellPrice = 50000;
	}

	userData.lmd += amount * sellPrice;
	userData.inventory[`${rarity} Count`] = 0;

	return `Sold ${amount} **${rarity}** operator${amount === 1 ? '' : 's'} for \u20A4${amount * sellPrice}`;
}

function gachaInventory(interaction, userData) {
	if (!userData.favoriteOp) {
		userData.favoriteOp = {name: '', image: ''};
	}

	const uniqueThreeStars = getUniqueOperators(userData, '3*');
	const uniqueFourStars = getUniqueOperators(userData, '4*');
	const uniqueFiveStars = getUniqueOperators(userData, '5*');
	const uniqueSixStars = getUniqueOperators(userData, '6*');
	const uniqueLimiteds = getUniqueOperators(userData, 'Limited');

	const inventoryEmbed = new MessageEmbed()
		.setColor('#86CECB')
		.setTitle(`${interaction.user.username}'s Inventory`)
		.addFields(
			{
				name: `3* Count: ${userData.inventory['3* Count']}\nUnique operators: ${uniqueThreeStars.count}/${gachaData['3*'].count}`,
				value: `${uniqueThreeStars.emotes}\n\u200B`
			},
			{
				name: `4* Count: ${userData.inventory['4* Count']}\nUnique operators: ${uniqueFourStars.count}/${gachaData['4*'].count}`,
				value: `${uniqueFourStars.emotes}\n\u200B`
			},
			{
				name: `5* Count: ${userData.inventory['5* Count']}\nUnique operators: ${uniqueFiveStars.count}/${gachaData['5*'].count}`,
				value: `${uniqueFiveStars.emotes}\n\u200B`
			},
			{
				name: `6* Count: ${userData.inventory['6* Count']}\nUnique operators: ${uniqueSixStars.count}/${gachaData['6*'].count}`,
				value: `${uniqueSixStars.emotes}\n\u200B`
			},
			{
				name: `Limited Count: ${userData.inventory['Limited Count']}\nUnique operators: ${uniqueLimiteds.count}/${gachaData['Limited'].count}`,
				value: `${uniqueLimiteds.emotes}\n\u200B`
			}
		);

	if (userData.favoriteOp.name !== '' && userData.favoriteOp.hasOwnProperty('image')) {
		inventoryEmbed.setDescription(`Favorite Operator: ${userData.favoriteOp.name}`)
			.setThumbnail(`attachment://${userData.favoriteOp.image.replace('https://i.imgur.com/', '')}`);
		
		return {embeds: [inventoryEmbed], files: [`${userData.favoriteOp.image}`]};
	}
	else {
		return {embeds: [inventoryEmbed]};
	}
}

function gachaFavorite(interaction, userData) {
	const rarities = ['3*', '4*', '5*', '6*', 'Limited'];

	let operator = interaction.options.getString('operator');

	// Captialize first letter of each word
	operator.toLowerCase();
	operator = capitalize(operator);
	operator.split(' ').map(capitalize).join(' ');

	for (let i = 0; i < rarities.length; i++) {
		for (let j = 0; j < gachaData[rarities[i]].count; j++) {
			if (gachaData[rarities[i]].operators[j].name === operator) {
				if (userData.inventory[`${rarities[i]} Owned`] === (userData.inventory[`${rarities[i]} Owned`] | 2**j)) {
					userData.favoriteOp = {name: operator, image: gachaData[rarities[i]].operators[j].image};
	
					return `${operator} is now your favorite operator`;
				}
				else {
					return `You do not own ${operator}`;
				}
			}
		}
	}
	
	return 'Not a valid operator name';
}

function getRandomOperator() {
	let name = 'error';
	let index = 0;
	let rarity = 'error';
	let color = '#000000';

	const rng = Math.floor(Math.random() * 100000);

	if (60000 <= rng && rng < 100000) {
		rarity = '3*';
		color = '#CCCCCC';
	}
	else if (5000 <= rng && rng < 60000) {
		rarity = '4*';
		color = '#0066AA';
	}
	else if (500 <= rng && rng < 5000) {
		rarity = '5*';
		color = '#FFAA00';
	}
	else if (5 <= rng && rng < 500) {
		rarity = '6*';
		color = '#FF6600';
	}
	else if (0 <= rng && rng < 5) {
		rarity = 'Limited';
		color = '#DD5500';
	}
	
	index = Math.floor(Math.random() * gachaData[rarity].count)
	name = gachaData[rarity].operators[index].name;

	if (name === 'Conviction') {
		index = Math.floor(Math.random() * gachaData[rarity].count);
		name = gachaData[rarity].operators[index].name;
		if (name !== 'Conviction') {
			color = '#004488';
		}
	}

	return {
		name: name,
		index: index,
		rarity: rarity,
		color: color
	};
}

function getUniqueOperators(userData, rarity) {
	let emoteStr = '\u200B';
	let count = 0;

	for (let i = gachaData[rarity].count - 1; i >= 0; i--) {
		if (userData.inventory[`${rarity} Owned`] >= 2**i) {
			emoteStr += getOperatorEmote(rarity, i);
			count++;
			userData.inventory[`${rarity} Owned`] -= 2**i;
		}
	}

	return {count: count, emotes: emoteStr};
}

function getOperatorEmote(rarity, index) {
	return `<:${gachaData[rarity].operators[index].name.replace(/\s/g, '_')}:${gachaData[rarity].operators[index].emote}>`;
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}