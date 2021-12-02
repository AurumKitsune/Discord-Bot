const { SlashCommandBuilder } = require("@discordjs/builders");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Gives daily \u20A450'),
	async execute(interaction) {
		await interaction.deferReply();

		let userData = {};
		if (await db.get(interaction.user.id)) {
			userData = await db.get(interaction.user.id);
		}

		if (!userData.lmd) {
			userData.lmd = 0;
		}
		if (!userData.lastDaily) {
			userData.lastDaily = 0;
		}

		if (Math.floor(Date.now() / 1000) - userData.lastDaily < 86400) {
			await interaction.editReply(`You can use again <t:${userData.lastDaily + 86400}:R>`);
		}
		else {
			userData.lmd += 50;
			userData.lastDaily = Math.floor(Date.now() / 1000);

			await db.set(interaction.user.id, userData);

			await interaction.editReply(`You obtained \u20A450, you now have: \u20A4${userData.lmd}`);
		}
	}
};