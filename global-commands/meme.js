const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
let fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Replies with a random meme'),
	async execute(interaction) {
		fs.readFile('res/mikuMemes.txt', 'utf8', function(err, data) {
			if (err) throw err;
			data = data.split('\n');
			const memeEmbed = new MessageEmbed()
				.setColor('#86CECB')
				.setImage(data[Math.floor(Math.random() * data.length)]);

			interaction.reply({embeds: [memeEmbed]});
		});
	}
};