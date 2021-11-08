module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (!interaction.isCommand()) return;
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

		const globalCommand = interaction.client.globalCommands.get(interaction.commandName);
		const guildCommand = interaction.client.guildCommands.get(interaction.commandName);

		if (globalCommand) {
			try {
				globalCommand.execute(interaction);
			} catch (error) {
				console.error(error);
				interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}

		if (guildCommand) {
			try {
				guildCommand.execute(interaction);
			} catch (error) {
				console.error(error);
				interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}
}