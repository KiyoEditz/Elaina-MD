

let handler = async (m, {text, args, command, usedPrefix}) => {
  if (!args[0]) throw `Use example ${usedPrefix + command} hai`
  let api = await fetchJson(`https://itzpire.site/ai/blackbox?q=${text}`)
await m.reply(status.wait)

await m.reply(api.result)
}
handler.command = ['blackbox']
handler.tags = ['ai']
handler.help = ['blackbox']

handler.premium = true

module.exports = handler
