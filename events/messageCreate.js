module.exports = {
	name: 'messageCreate',
	execute(message){
		if (message.author.bot) return;

		if (message.content.match(/.*miku time.*/gi)) {
			message.channel.send('Miku Time!');
		}
	}
}