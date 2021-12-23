const Database = require("@replit/database");
const db = new Database();

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction, user){
		if (reaction.partial) {
			try {
				await reaction.fetch();
			}
			catch(error) {
				console.error('Something went wrong when fetching the message:', error);
				return;
			}
		}

		if (user.bot) return;

		if (reaction.message.channel.name.match(/reddit/i)) {
			if (reaction.emoji.id == '907363962700595201' || reaction.emoji.id == '907363946678337596') {
				let userData = {};
				if (await db.get(user.id)) {
					userData = await db.get(user.id);
				}
				if (!userData.karma) {
					userData.karma = 0;
				}
				
				if (reaction.emoji.id == '907363962700595201') {
					userData.karma++;
				}
				else if (reaction.emoji.id == '907363946678337596') {
					userData.karma--;
				}
				
				await db.set(user.id, userData);
			}
		}
	}
}