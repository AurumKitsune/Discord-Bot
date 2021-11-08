const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gacha')
		.setDescription('Spend $10 for a gacha pull'),
	async execute(interaction) {
		let emote = "";
		const rng = Math.floor(Math.random() * 1017);
		
		let rareMiku = false;
		if (0 <= rng && rng <= 16) {
			rareMiku = true;
		}

		if (rng == 0) {
			emote = "<:MikuConcert:817119062668345355>";
		}
		else if (1 <= rng && rng <= 3) {
			emote = "<:MikuAngel:817119060835434546>";
		}
		else if (4 <= rng && rng <= 6) {
			emote = "<:MikuLeek:817119062508175360>";
		}
		else if (7 <= rng && rng <= 11) {
			emote = "<:MikuPeak:817119060479311872>";
		}
		else if (12 <= rng && rng <= 16) {
			emote = "<:MikuSinging:817119062457843732>";
		}
		else if (17 <= rng && rng <= 266) {
			emote = "<:Miku1:817119056879681536>";
		}
		else if (267 <= rng && rng <= 516) {
			emote = "<:Miku2:817119057488379925>";
		}
		else if (517 <= rng && rng <= 1016) {
			emote = "<:MikuSad:817119062215360512>";
		}

		await interaction.reply('You pulled: ' + emote + '! You paid ~~\u2133~~ 10 for casting.');
	}
};