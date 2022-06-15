/*
const cron = require('node-cron')
let handler = m => m
handler.before = async (m, { conn }) => {
	let enable = global.db.data.setting
	if (enable.autoclear) {
		cron.schedule('*\/25 * * * *', () => {
			let chats = conn.chats.array.filter(v => !v.read_only && v.message && !v.pin).map(v => v.jid)
			grup = []
			for (let id of chats) {
				if (id.endsWith('g.us')) {
					grup.push(id)
				} else {
					conn.modifyChat(id, 'delete').catch(console.log)
				}
			}
			for (let i = 0; i < 1; i++) {
				conn.modifyChat(grup[i], 'clear')
			}
		})
	}
}
module.exports = handler
*/