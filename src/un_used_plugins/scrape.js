let fetch = require('node-fetch')
const delay = time => new Promise(res => setTimeout(res, time))
let fs = require('fs')

let handler = async (m, { conn, usedPrefix }) => {
    //caklontong
    for (let i = 0; i < 100; i++) {
        let res = await fetch(global.API('lolhuman', '/api/tebak/caklontong2', '', 'apikey'))
        let json = await res.json()
        const scrap = JSON.parse(fs.readFileSync('./scrape/caklontong.json'))
        scrap.push(json)
        fs.writeFileSync('./scrape/caklontong.json', JSON.stringify(scrap))
        await delay(3500)
    }
    await delay(50000)
    //family
    for (let i = 0; i < 100; i++) {
        let res = await fetch(global.API('xteam', '/game/family100', {}, 'APIKEY'))
        let json = await res.json()
        const scrap = JSON.parse(fs.readFileSync('./scrape/family.json'))
        scrap.push(json)
        fs.writeFileSync('./scrape/family.json', JSON.stringify(scrap))
        await delay(3500)
    }
    m.reply('selesai')
}
handler.command = /^scrape$/i

module.exports = handler