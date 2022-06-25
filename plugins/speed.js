let os = require('os')
let { performance } = require('perf_hooks')
let { sizeFormatter } = require('human-readable')
let format = sizeFormatter({
  std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})
let handler = async (m, { conn }) => {
  const chats = Object.keys(conn.chats)
  const groups = chats.filter(v => v.endsWith('g.us'))

  let old = performance.now()
  await m.reply('_Testing speed..._')
  let neww = performance.now()
  let speed = ((neww - old) / 1000).toFixed(2)
  let res = os.cpus()
  m.reply(`
╔══「 Merespon dalam ${speed} detik 」
║ 
╟ 💬 Status :
╟ Total Groups: *${groups.length}*
╟ Total Chat Pribadi: *${chats.length - groups.length}*
╟ Total Seluruh Chat: *${chats.length}* 
║ 
╟ 💻 *Info Server* :
╟ Platform: ${os.platform()}
╟ CPU: *${res[0].model}*
╟ Total Core: *${res.length}*
╟ Speed: *${(res[0].speed / 1000).toFixed(1)} Ghz*
╟ RAM: *${format(os.totalmem() - os.freemem())} / ${format(os.totalmem())}*
╚════════════════
`.trim())
}
handler.help = ['ping', 'speed']
handler.tags = ['info', 'main']

handler.command = /^(ping|speed)$/i
module.exports = handler