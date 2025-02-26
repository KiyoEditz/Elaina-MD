let cheerio = require('cheerio');
let fetch = require('node-fetch');

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {

    let lister = [
        "search",
        "read"
    ]

    let [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")
    if (!lister.includes(feature)) return m.reply("[ ! ] *example:* .dongeng search|kancil\n\n*all Type*\n" + lister.map((v, index) => " — " + v).join("\n"))

    if (lister.includes(feature)) {

        if (feature == "search") {
        if (!inputs) return m.reply("[ ! ] *example:* .dongeng search|kancil")
            await m.reply(wait)
            try {
                let res = await searchDongeng(inputs)
                let teks = res.map((item, index) => {
                    return `🔍 *[ RESULT ${index + 1} ]*

📚 Title: ${item.entryTitle}
🔗 Link: ${item.link}
📝 Summary: ${item.entrySummary}
  `
                }).filter(v => v).join("\n\n\n")
                await m.reply(teks)
            } catch (error) {
    console.error(error);
    m.reply(`Failed to progresing. Please try again later: ${error}`);
  }
        }

        if (feature == "read") {
            if (!inputs) return m.reply("[ ! ] *example:* .dongeng read|link")
            await m.reply(wait)
            try {
                let item = await readDongeng(inputs)
                let cap = `🔍 *[ RESULT ]*

📰 *Title:* ${item.title}
🖼️ *Thumbnail:* ${item.image}
📌 *Category:* ${item.cat}
🏷️ *Tag:* ${item.tag}
📝 *Content:* ${cleanText(item.content)}
👤 *Author Name:* ${item.author}
📝 *Date:* ${item.date}
`
                await conn.sendFile(m.chat, item.image, "", cap, m)

            } catch (error) {
    console.error(error);
    m.reply(`Failed to progresing. Please try again later: ${error}`);
  }
        }
    }
}
handler.help = ["dongeng search|<title>","dongeng read|<link>"]
handler.tags = ["internet"]
handler.command = /^(dongeng)$/i
handler.limit = true
module.exports = handler

/* New Line */

function cleanText(html) {
    const regex = /<[^>]+>/g;
    return html.replace(regex, "");
}

async function searchDongeng(q) {
  try {
  	const url = 'https://dongengceritarakyat.com/?s=' + q; // Ganti dengan URL halaman web yang ingin Anda crawl
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const results = [];

    $('article').each((index, element) => {
      const article = $(element);
      const result = {
        entryTitle: article.find('.entry-title a').text(),
        link: article.find('.entry-title a').attr('href'),
        imageSrc: article.find('.featured-image amp-img').attr('src'),
        entrySummary: article.find('.entry-summary').text(),
        footerTag: article.find('.cat-links a').text(),
        from: article.find('.tags-links a').text()
      };
      results.push(result);
    });

    return results;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

async function readDongeng(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  return {
    image: $('div.featured-image amp-img').attr('src'),
    title: $('h1.entry-title').text(),
    date: $('span.posted-date').text(),
    author: $('span.posted-author a').text(),
    content: $('div.entry-content').text(),
    tag: $('span.tags-links a').text(),
    cat: $('span.cat-links a').text(),
  };
}