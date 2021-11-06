const { SlashCommandBuilder } = require('@discordjs/builders');
let fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('birdfact')
		.setDescription('Replies with a random bird fact'),
	async execute(interaction) {
		fs.readFile('res/birdFacts.txt', 'utf8', function(err, data) {
			if (err) throw err;
			data = data.split('\n');
			interaction.reply(data[Math.floor(Math.random() * data.length)]);
		});
	}
};