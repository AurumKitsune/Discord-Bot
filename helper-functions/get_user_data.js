const Database = require("@replit/database");
const db = new Database();

const getUserData = async function(userId) {
	let userData = await db.get(userId);

  if (userData === null) {
    userData = {};
  } 

	if (!userData.hasOwnProperty('lmd')) {
		userData.lmd = 0;
	}
	if (!userData.hasOwnProperty('lastDaily')) {
		userData.lastDaily = 0;
	}
	if (!userData.hasOwnProperty('mikuTime')) {
		userData.mikuTime = 0;
	}
	if (!userData.hasOwnProperty('karma')) {
		userData.karma = 0;
	}
	if (!userData.hasOwnProperty('inventory')) {
		userData.inventory = {
			'3* Owned': 0,
			'4* Owned': 0,
			'5* Owned': 0,
			'6* Owned': 0,
			'Limited Owned': 0
		};
	}

	return userData;
}

module.exports = getUserData;