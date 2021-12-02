const Database = require("@replit/database");
const db = new Database();

module.exports = {
	name: 'messageCreate',
	async execute(message){
		if (message.author.bot) return;

		if (message.content.match(/.*miku time.*/i)) {
			let userData = {};
			if (await db.get(message.author.id)) {
				userData = await db.get(message.author.id);
			}
			if (!userData.mikuTime) {
				userData.mikuTime = 0;
			}
			userData.mikuTime++;
				
			message.channel.send('Miku Time!');
			
			await db.set(message.author.id, userData);
		}

		if (message.channel.name.match(/reddit/i)) {
			message.react('907363962700595201');
			message.react('907363946678337596');
		}
	}
}