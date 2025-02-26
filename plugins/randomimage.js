const axios = require('axios');

let handler = async (m, { conn, command, usedPrefix }) => {
	try {
		command = command.toLowerCase();
		m.reply('_Sedang mencari..._');
		// Permintaan ke API Pinterest
		const response = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/`, {
			params: {
				source_url: `/search/pins/?q=${encodeURIComponent(command)}`,
				data: JSON.stringify({
					options: {
						isPrefetch: false,
						query: command,
						scope: 'pins',
						no_fetch_context_on_resource: false,
					},
					context: {},
				}),
				_: Date.now(),
			},
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		});

		// Ambil hasil pencarian
		const results = response.data.resource_response?.data?.results || [];
		if (results.length === 0) {
			throw `Tidak ada gambar yang ditemukan untuk "${command}".`;
		}

		// Ambil URL gambar
		const imageUrls = results.map(v => v.images?.orig?.url).filter(url => url);
		if (imageUrls.length === 0) {
			throw `Gambar tidak ditemukan untuk "${command}".`;
		}

		// Pilih gambar secara acak
		let hasil = conn.pickRandom(imageUrls);
		await conn.sendFile(m.chat, hasil, 'img.jpg', '', m);
	} catch (error) {
		m.reply(`Terjadi kesalahan: ${error.message || error}`);
	}
};

handler.help = handler.command = ['bts', 'exo', 'husbu', 'loli'];
handler.tags = ['imagerandom'];

module.exports = handler;