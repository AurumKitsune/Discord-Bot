const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Make bot say something')
		.addStringOption(option => 
			option.setName('message')
				.setDescription('Enter message to say')
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.reply({content: 'Sent', ephemeral: true});
		await interaction.channel.send(interaction.options.getString('message'));
	}
};