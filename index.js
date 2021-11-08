// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.globalCommands = new Collection();
client.guildCommands = new Collection();
const globalCommandFiles = fs.readdirSync('./global-commands').filter(file => file.endsWith('.js'));
const guildCommandFiles = fs.readdirSync('./guild-commands').filter(file => file.endsWith('.js'));

globalCommandFiles.forEach(file => {
	const command = require(`./global-commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.globalCommands.set(command.data.name, command);
});

guildCommandFiles.forEach(file => {
	const command = require(`./guild-commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.guildCommands.set(command.data.name, command);
});

// Login to Discord with your client's token
client.login(token);