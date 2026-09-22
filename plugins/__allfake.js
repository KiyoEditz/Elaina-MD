let fs = require('fs')
let fetch = require('node-fetch')

let waifu = []
try {
	waifu = JSON.parse(fs.readFileSync('./api/waifu.json'))
} catch (e) {}

let logoBuffer = Buffer.alloc(0)
try {
	logoBuffer = fs.readFileSync('./src/logo.jpg')
} catch (e) {}

// Default inisialisasi agar selalu ada di memori dan tidak pernah ReferenceError
global.fakeImgReply = {
	quoted: {
		key: {
			remoteJid: 'status@broadcast',
			participant: '0@s.whatsapp.net'
		},
		message: {
			imageMessage: {
				mimetype: 'image/jpeg',
				caption: '',
				jpegThumbnail: logoBuffer
			}
		}
	}
}
global.ftroli = { key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' }, message: { orderMessage: { itemCount: 999999999999, status: 1, surface: 1, message: global.wm || '', orderTitle: global.wm || '', sellerJid: '0@s.whatsapp.net' } } }
global.fkontak = { key: { participant: `0@s.whatsapp.net` }, message: { contactMessage: { displayName: global.wm || '', vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;WhatsApp;;;\nFN:WhatsApp\nitem1.TEL;waid=0:0\nEND:VCARD`, jpegThumbnail: logoBuffer, thumbnail: logoBuffer, sendEphemeral: true } } }

let handler = m => m
handler.all = async function (m) {
	try {
		let pp = 'https://telegra.ph/file/2d06f0936842064f6b3bb.png'
		try {
			pp = await this.profilePictureUrl(m.sender, 'image')
		} catch (e) {}

		if (Array.isArray(waifu) && waifu.length > 0) {
			global.img = this.pickRandom(waifu)
			try {
				global.bg = await (await fetch(global.img)).buffer()
			} catch (e) {}
		}
		global.doc = this.pickRandom(["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/pdf"])

		// Module 
		global.fetch = require('node-fetch')

		const _uptime = process.uptime() * 1000
		global.u = await (this.clockString ? this.clockString(_uptime) : '')

		// ucapan ini mah
		// pesan sementara
		global.ephemeral = '86400' // 86400 = 24jam, kalo ingin di hilangkan ganti '86400' jadi 'null' atau ''

		// externalAdReply atau text with thumbnail. gatau bahasa Inggris? coba translate!
		let ad = this.pickRandom([{ body: 'Follow IG Owner', sourceUrl: 'https://instagram.com/syahrul_idh' },
		{ body: 'GC BOT', sourceUrl: this.pickRandom(global.link || []) }
		])
		global.adReply = {
			contextInfo: {
				externalAdReply: {
					title: this.user?.name || global.namebot || 'Bot',
					thumbnail: logoBuffer,
					...ad
				}
			}
		}

		global.fakeImgReply = {
			quoted: {
				key: {
					remoteJid: 'status@broadcast',
					participant: m?.sender || (m?.quoted && m.quoted.sender) || '0@s.whatsapp.net'
				},
				message: {
					"imageMessage": {
						"mimetype": "image/jpeg",
						"caption": m?.text || (m?.quoted && m.quoted.text) || '',
						"jpegThumbnail": logoBuffer
					}
				}
			}
		}
		// Fake 🤥
		global.ftroli = { key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' }, message: { orderMessage: { itemCount: 9999999999999999999999999999999999999999999999999999999, status: 1, surface: 1, message: global.wm || '', orderTitle: global.wm || '', sellerJid: '0@s.whatsapp.net' } } }
		global.fkontak = { key: { participant: `0@s.whatsapp.net`, ...(m?.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': global.wm || '', 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${global.wm || ''},;;;\nFN:${global.wm || ''},\nitem1.TEL;waid=${(m?.sender || '').split('@')[0]}:${(m?.sender || '').split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, 'jpegThumbnail': logoBuffer, thumbnail: logoBuffer, sendEphemeral: true } } }
	} catch (e) {
		console.error('[__allfake error]', e)
	}
}

module.exports = handler

