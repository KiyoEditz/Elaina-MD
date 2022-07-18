let fs = require('fs')
let fetch = require('node-fetch')

let waifu = JSON.parse(fs.readFileSync('./api/waifu.json'))
let handler = m => m
handler.all = async function (m) {
	let pp = 'https://telegra.ph/file/2d06f0936842064f6b3bb.png'
	try {
		pp = await this.profilePictureUrl(m.sender, 'image')
	} catch (e) {
	} finally {
		global.img = this.pickRandom(waifu)
		global.bg = await (await fetch(img)).buffer()
		global.doc = this.pickRandom(["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/pdf"])

		// Module 
		global.fetch = require('node-fetch')

		const _uptime = process.uptime() * 1000
		global.u = await conn.clockString(_uptime)

		// ucapan ini mah
		// pesan sementara
		global.ephemeral = '86400' // 86400 = 24jam, kalo ingin di hilangkan ganti '86400' jadi 'null' atau ''

		// externalAdReply atau text with thumbnail. gatau bahasa Inggris? coba translate!
		let ad = this.pickRandom([{ body: 'Follow IG Owner', sourceUrl: 'https://instagram.com/syahrul_idh' },
		{ body: 'GC BOT', sourceUrl: this.pickRandom(global.link) }
		])
		global.adReply = {
			contextInfo: {
				externalAdReply: {
					title: this.user.name,
					thumbnail: fs.readFileSync('./src/logo.jpg'),
					...ad,
					// previewType: 'PHOTO'
				}
			}
		}

		global.fakeImgReply = {
			quoted: {
				key: {
					remoteJid: 'status@broadcast',
					participant: (m || m.quoted).sender //'0@s.whatsapp.net',
				},
				message: {
					"imageMessage": {
						"mimetype": "image/jpeg",
						"caption": (m || m.quoted).text,
						"jpegThumbnail": fs.readFileSync(`./src/logo.jpg`)
					}
				}
			}
		}
		// Fake 🤥
		global.ftroli = { key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' }, message: { orderMessage: { itemCount: 9999999999999999999999999999999999999999999999999999999, status: 1, surface: 1, message: wm, orderTitle: wm, sellerJid: '0@s.whatsapp.net' } } }
		global.fkontak = { key: { participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': wm, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, 'jpegThumbnail': require('fs').readFileSync('./src/logo.jpg'), thumbnail: require('fs').readFileSync('./src/logo.jpg'), sendEphemeral: true } } }

	}
}

module.exports = handler

