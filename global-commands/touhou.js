const { SlashCommandBuilder } = require('@discordjs/builders');
let fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('touhou')
		.setDescription('Send a random touhou picture/gif/video'),
	async execute(interaction) {
		fs.readFile('res/touhouLinks.txt', 'utf8', function(err, data) {
			if (err) throw err;
			data = data.split('\n');

			interaction.reply(data[Math.floor(Math.random() * data.length)]);
		});
	}
};