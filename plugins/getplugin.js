const fs = require('fs')
const syntaxError =require('syntax-error')
const path =require('path')

const _fs = fs.promises

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
    if (!text) throw `
✳️ user  : ${usedPrefix + command} <name file>

📌 Example:
        ${usedPrefix}getfile main.js
        ${usedPrefix}getplugin owner
`.trim()
    if (/p(lugin)?/i.test(command)) {
        const filename = text.replace(/plugin(s)\//i, '') + (/\.js$/i.test(text) ? '' : '.js')
        const pathFile = path.join(__dirname, filename)
        const file = await _fs.readFile(pathFile, 'utf8')
        m.reply(file)
        const error = syntaxError(file, filename, {
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true
        })
        if (error) {
            await m.reply(`
❎ bug found in  *${filename}*:

${error}

`.trim())
        }

    } else {
        const isJavascript = /\.js/.test(text)
        if (isJavascript) {
            const file = await _fs.readFile(text, 'utf8')
            m.reply(file)
            const error = syntaxError(file, text, {
                sourceType: 'module',
                allowReturnOutsideFunction: true,
                allowAwaitOutsideFunction: true
            })
            if (error) {
                await m.reply(`
❎ bug found in *${text}*:

${error}

`.trim())
            }
        } else {
            const file = await _fs.readFile(text, 'base64')
            await m.reply(Buffer.from(file, 'base64'))
        }
    }
}
handler.help = ['plugin', 'file'].map(v => `get${v} <name file>`)
handler.tags = ['owner']
handler.command = /^g(et)?(p(lugin)?|f(ile)?)$/i

handler.owner = true

module.exports = handler
    
/*
let cp = require('child_process')
let { promisify } = require('util')
let exec = promisify(cp.exec).bind(cp)

let handler = async (m, { conn, isROwner, usedPrefix, command, text }) => {
    if (!isROwner) return
    let ar = Object.keys(plugins)
    let ar1 = ar.map(v => v.replace('.js', ''))
    if (!text) throw `uhm.. where the text?\n\nexample:\n${usedPrefix + command} i-info`
    if (!ar1.includes(text)) return m.reply(`not found!\n\n${ar1.map(v => ' ' + v).join`\n`}`)
    let o
    try {
        o = await exec('cd plugins && type ' + text + '.js')
    } catch (e) {
        o = e
    } finally {
        let { stdout, stderr } = o
        if (stdout.trim()) m.reply(stdout)
        if (stderr.trim()) m.reply(stderr)
    }
}
handler.help = ['getplugin'].map(v => v + ' <text>')
handler.tags = ['owner']
handler.command = /^(getplugin|gp)$/i

module.exports = handler
*/
