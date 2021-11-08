module.exports = {
	name: 'messageCreate',
	execute(message){
		if (message.author.bot) return;

		if (message.content.match(/.*miku time.*/i)) {
			message.channel.send('Miku Time!');
		}

		if (message.channel.name.match(/reddit/i)) {
			message.react('907363962700595201');
			message.react('907363946678337596');
		}
	}
}