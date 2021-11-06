const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('man')
		.setDescription('Replies with my man'),
	async execute(interaction) {
		await interaction.reply(':horse::handshake::horse: my man');
	}
};