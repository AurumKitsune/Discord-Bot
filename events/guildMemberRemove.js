module.exports = {
	name: 'guildMemberRemove',
	execute(member) {
		if (member.guild.id === '294725605809848320') {
			member.guild.systemChannel.send('bitch');
		}
	}
}