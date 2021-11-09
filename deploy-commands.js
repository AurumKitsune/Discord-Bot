const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { guildIds } = require('./config.json');
const token = process.env['token'];
const clientId = process.env['clientId'];

const globalCommands = [];
const globalCommandFiles = fs.readdirSync('./global-commands').filter(file => file.endsWith('.js'));

const guildCommands = [];
const guildCommandFiles = fs.readdirSync('./guild-commands').filter(file => file.endsWith('.js'));

globalCommandFiles.forEach(file => {
	const command = require(`./global-commands/${file}`);
	globalCommands.push(command.data.toJSON());
});

guildCommandFiles.forEach(file => {
	const command = require(`./guild-commands/${file}`);
	guildCommands.push(command.data.toJSON());
});

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing slash commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: globalCommands }
		);

		for (let server in guildIds) {
			rest.put(
				Routes.applicationGuildCommands(clientId, guildIds[server]),
				{ body: guildCommands }
			);
		};

		console.log('Successfully reloaded slash commands.');
	} catch (error) {
		console.error(error);
	}
})();