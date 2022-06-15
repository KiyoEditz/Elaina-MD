let fetch = require('node-fetch')
let handler = async(m, { conn }) => {
	let lolhuman = await fetch(global.API('lolhuman', '/api/checkapikey', '', 'apikey'))
	let lol = await lolhuman.json()
	let xteamz = await fetch(global.API('xteam', '/cekey', '', 'APIKEY'))
	let xteam = await xteamz.json()
	let vhtearz = await fetch(global.API('vhtear', '/resultkey', '', 'apikey'))
	let vhtear = await vhtearz.json()
	let hasil = `
*CEK APIKEY LEVIBOT*
	
*Xteam*
Totalhit: ${xteam.response.totalhit}
Expired-left: ${xteam.response.expired}

*Vhtear*
Expired: ${vhtear.result.Expired}

*Lolhuman*
Totalhit: ${lol.result.requests}
Expired: ${lol.result.expired}
	`.trim()

    conn.reply(m.chat, hasil, m)
	
}
handler.command = /^(apikey)$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = false

module.exports = handler