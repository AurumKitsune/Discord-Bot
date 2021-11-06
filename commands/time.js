const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Replies with time!')
		.addIntegerOption(option =>
			option.setName('time')
				.setDescription('Enter time in seconds')
				.setRequired(true)),
	async execute(interaction) {
		const time = interaction.options.getInteger('time');
		await interaction.reply(`<t:${Math.floor((Date.now() / 1000) + time)}:R>`);
	}
};