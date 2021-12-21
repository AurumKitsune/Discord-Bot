const Database = require("@replit/database");
const db = new Database();

module.exports = {
	name: 'messageReactionAdd',
	async execute(messageReaction, user){
		if (user.bot) return;

		if (messageReaction.message.channel.name.match(/reddit/i)) {
			if (messageReaction.emoji.id == '907363962700595201' || messageReaction.emoji.id == '907363946678337596') {
				let userData = {};
				if (await db.get(user.id)) {
					userData = await db.get(user.id);
				}
				if (!userData.karma) {
					userData.karma = 0;
				}
				
				if (messageReaction.emoji.id == '907363962700595201') {
					userData.karma++;
				}
				else if (messageReaction.emoji.id == '907363946678337596') {
					userData.karma--;
				}
				
				await db.set(user.id, userData);
			}
		}
	}
}