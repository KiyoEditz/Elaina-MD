

let handler = async (m, { conn }) => {
  let thanksWords = ['terima kasih', 'thanks', 'makasi', 'makasih', 'thank you', 'tq', 'ty']
  let isThanks = false
  thanksWords.forEach((thanksWord) => {
    if (m.text.toLowerCase().includes(thanksWord)) {
      isThanks = true
    }
  })
  if (isThanks) {
    let replyMessage = "Sama - sama, semoga membantumu!"
    m.reply(replyMessage)
  }
}

handler.customPrefix = /^((thanks?|makasi|makasih|hatur nuhun|terima kasih|thank you|tq|ty)(\s|$))/i
handler.command = new RegExp
module.exports = handler
