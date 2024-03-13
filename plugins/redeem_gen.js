let fs = require('fs')
let data = JSON.parse(fs.readFileSync('src/code_redeem.json'))

let obj_ = data.group.trial
let objhalf = data.group.half
let obj = data.group.one
let obj2 = data.group.two

let all = obj_.concat(objhalf).concat(obj).concat(obj2)
let er = `List\n ${Object.keys(data.group).map((v, i) => i + 1 + `. ${v}`).join('\n')}`

let handler = async (m, { text, usedPrefix }) => {
    let code = newCode(text)
    while (data.used.includes(code)) {
        code = newCode()
    }
    m.reply(`*Jenis:* ${text}\n\n_Cara menggunakan:_\nSalin kode di bawah ini\nTempelkan di group yang ingin kamu aktifkan bot nya\n\n*Note : pastikan Bot sudah ditambahkan ke group kamu*`)
    m.reply(`${usedPrefix}use ${code}`)


}
handler.help = ['generatecode']
handler.tags = ['owner']
handler.command = /^(gen(erate)?code)$/i
handler.rowner = true
module.exports = handler

function newCode(text) {
    let code
    switch (text) {
        case 'trial':
            code = obj_[Math.floor(Math.random() * 1000)]
            break;
        case 'half':
            code = objhalf[Math.floor(Math.random() * 1000)]
            break;
        case 'one':
            code = obj[Math.floor(Math.random() * 1000)]
            break;
        case 'two':
            code = obj2[Math.floor(Math.random() * 1000)]
            break;
        default:
            return er
            break;
    }
    return code
}