const axios = require('axios')
const cheerio = require('cheerio')

const headers = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept':
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
  },
}

async function rule34Search(q) {
  try {
    const { data } = await axios.get(
      `https://rule34.xxx/index.php?page=post&s=list&tags=${encodeURIComponent(q)}`,
      headers
    )
    const $ = cheerio.load(data)
    const results = []

    $('span.thumb').each((i, el) => {
      const aTag = $(el).find('a')
      const imgTag = $(el).find('img')

      const postId = aTag.attr('id')?.replace('p', '')
      const postUrl = `https://rule34.xxx${aTag.attr('href')}`
      const imageUrl = imgTag.attr('src')
      const title = imgTag.attr('title') || ''
      const tags = imgTag.attr('alt')?.split(' ') || []

      results.push({
        id: postId,
        link: postUrl,
        image: imageUrl,
        title: title.trim(),
        tags: tags.filter((t) => t),
      })
    })

    return results
  } catch (err) {
    console.error('Error fetch rule34:', err.message)
    return []
  }
}

const handler = async (m, { conn, args, command }) => {
  if (!args[0]) return m.reply(`Contoh penggunaan:\n.rule34 hinata_hyuga`)

  const res = await rule34Search(args.join(' '))
  if (!res.length) return m.reply('Tidak ada hasil ditemukan!')

  const random = res[Math.floor(Math.random() * res.length)]
  const caption = `*Title:* ${random.title || '-'}\n*Tags:* ${random.tags.join(', ')}\n*Link:* ${random.link}`

  await conn.sendMessage(m.chat, {
    image: { url: random.image },
    caption,
  }, { quoted: m })
}

handler.command = ['rule34']
handler.tags = ['nsfw']
handler.help = ['rule34 search']
handler.premium = true
handler.limit = true


module.exports = handler