let handler = async m => {
  m.reply('Klik link berikut https://wa.me/6281999284127?text=#topup')
}
handler.command = /^(topup)$/i
handler.help = ['topup']
handler.tags = ['menuringkas']

module.exports = handler
