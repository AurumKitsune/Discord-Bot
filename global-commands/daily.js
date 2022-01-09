const { SlashCommandBuilder } = require("@discordjs/builders");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Gives daily \u20A450'),
	async execute(interaction) {
		const dbData = await db.get(interaction.user.id);

		let userData = {};
		if (dbData) {
			userData = dbData;
		}

		if (!userData.lmd) {
			userData.lmd = 0;
		}
		if (!userData.lastDaily) {
			userData.lastDaily = 0;
		}

		if (Math.floor(Date.now() / 1000) - userData.lastDaily < 72000) {
			await interaction.reply(`You can use again <t:${userData.lastDaily + 72000}:R>`);
		}
		else {
			userData.lmd += 50;
			userData.lastDaily = Math.floor(Date.now() / 1000);

			await db.set(interaction.user.id, userData);

			await interaction.reply(`You obtained \u20A450, you now have: \u20A4${userData.lmd}`);
		}
	}
};