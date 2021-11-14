require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { guildIds } = require('./config.json');
const token = process.env['token'];
const clientId = process.env['clientId'];

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started deleting application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: [] }
		);

		for (let server in guildIds) {
			await rest.put(
				Routes.applicationGuildCommands(clientId, guildIds[server]),
				{ body: [] }
			);
		}

		console.log('Successfully deleted application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();