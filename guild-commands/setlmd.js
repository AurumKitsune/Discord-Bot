const { SlashCommandBuilder } = require('@discordjs/builders');
const Database = require("@replit/database");
const db = new Database();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addlmd')
		.setDescription('Adds LMD to your balance')
		.addIntegerOption(option => 
			option.setName('lmd')
				.setDescription('Enter LMD amount to add')
				.setRequired(true)
		),
	async execute(interaction) {
		let userData = {};
		if (await db.get(interaction.user.id)) {
			userData = await db.get(interaction.user.id);
		}

		if (!userData.lmd) {
			userData.lmd = 0;
		}

		const amount = interaction.options.getInteger('lmd');

		userData.lmd += amount;

		await db.set(interaction.user.id, userData);

		await interaction.reply(`Added \u20A4${amount} to your balance\nNew balance is \u20A4${userData.lmd}`);
	}
};