const Database = require("@replit/database");
const db = new Database();

const getUserData = function(userId) {
	const dbData = db.get(userId);

	if (dbData) {
		return dbData;
	}
	else {
		return {
			lmd: 0,
			lastDaily: 0,
			mikuTime: 0,
			karma: 0,
			inventory: {
				'3* Count': 0,
				'4* Count': 0,
				'5* Count': 0,
				'6* Count': 0,
				'Limited Count': 0,
				'3* Owned': 0,
				'4* Owned': 0,
				'5* Owned': 0,
				'6* Owned': 0,
				'Limited Owned': 0
			}
		};
	}
}

module.exports = getUserData;