/*
let fetch = require('node-fetch')
let googleIt = require('google-it')
let handler = async (m, { conn, command, args }) => {
  let full = /f$/i.test(command)
  let text = args.join` `
  if (!text) return conn.reply(m.chat, 'Tidak ada teks untuk di cari', m)
  let url = 'https://google.com/search?q=' + encodeURIComponent(text)
  let search = await googleIt({ query: text })
  let msg = search.map(({ title, link, snippet }) => {
    return `*${title}*\n_${link}_\n_${snippet}_`
  }).join`\n\n`

  let ss = await (await fetch(global.API('nrtm', '/api/ssweb', { delay: 1000, url, full }))).buffer()
  await conn.sendFile(m.chat, ss, 'screenshot.png', url, m)
  m.reply(msg)
}
handler.help = ['google', 'googlef'].map(v => v + '<keyword>')
handler.tags = ['search']
handler.command = /^googlef?$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
*/
const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const handler = async (m, { conn, command, usedPrefix, args }) => {
	let teks;
	if (args.length >= 1) {
		teks = args.slice(0).join(" ");
	} else if (m.quoted && m.quoted.text) {
		teks = m.quoted.text;
	} else {
		throw `Penggunaan:\n${usedPrefix}${command} > query <\n\nContoh:\n${usedPrefix}${command} apa itu javascript`;
	}
	m.reply(wait);
	let data = await googleSearch(teks);
	let tx = `*GOOGLE SEARCH*\n\n`;
	let urutan = 1;
	for (const v of data) {
		tx += `- No: ${urutan}`;
		tx += `\n- Title: *${v.title}*`;
		tx += `\n- Url: ${v.url}`;
		tx += `\n- Deskripsi: ${v.description}\n\n`;
		urutan++;
	}
	conn.sendMessage(m.chat, { text: tx }, { quoted: m });
};

handler.help = ["google"];
handler.tags = ["internet"];
handler.command = /^google?$/i;

handler.limit = true;

module.exports = handler;

// User agents
const ua = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0",
];

// Random User Agent selection
function gua() {
	return ua[Math.floor(Math.random() * ua.length)];
}

// Result creator function
function createResult(url, title, description) {
	return { url, title, description };
}

// Helper function to make the request to Google
async function makeRequest(
	query,
	num,
	start,
	proxy,
	lang = "id",
	timeout = 5000,
	safe = "active",
	sslVerify = true,
	region = null
) {
	const response = await axios.get("https://www.google.com/search", {
		headers: {
			"User-Agent": gua(),
		},
		params: {
			q: query,
			num: num + 2, // Fetch extra results
			hl: lang,
			start,
			safe: safe,
			gl: region,
		},
		httpsAgent: proxy
			? new https.Agent({ rejectUnauthorized: sslVerify })
			: null,
		timeout: timeout,
	});
	return response.data;
}

// Main search function
async function googleSearch(
	query,
	num = 10,
	proxy = null,
	sleepInterval = 0,
	region = null,
	lang = "id",
	timeout = 5000,
	safe = "active",
	sslVerify = true
) {
	let start = 0;
	let result = [];
	let totalResults = 0;

	while (totalResults < num) {
		const html = await makeRequest(
			query,
			num - totalResults,
			start,
			proxy,
			lang,
			timeout,
			safe,
			sslVerify,
			region
		);
		const $ = cheerio.load(html);
		const resultBlock = $("div.g");
		let newResults = 0;

		resultBlock.each((_, element) => {
			const link = $(element).find("a").attr("href");
			const title = $(element).find("h3").text();
			const description = $(element)
				.find('div[style="-webkit-line-clamp:2"]')
				.text();

			if (link && title && description) {
				result.push(createResult(link, title, description));
				totalResults++;
				newResults++;

				if (totalResults >= num) {
					return result;
				}
			}
		});

		if (newResults === 0) {
			break;
		}

		start += 10;
		await new Promise((res) => setTimeout(res, sleepInterval)); // Sleep if interval is set
	}

	return result;
}
