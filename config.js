let fs = require('fs')
global.owner = ['6281999284127', '6283196564521', '6283196162908', '628857180075', '6283198071289'] // Put your number here
global.mods = JSON.parse(fs.readFileSync('./src/mods.json')) // Want some help?
global.prems = JSON.parse(fs.readFileSync('./src/premium.json')) // Pengguna premium tidak memerlukan limit // Premium user has unlimited limit
global.link = JSON.parse(fs.readFileSync('./src/grouplink.json'))
global.group = link.map((v, i) => `Group ${i + 1}\n${v}`).join('\n\n')
global.partner = ''
global.wm = '© _*Levi Bot*_'
global.playlist = '37i9dQZF1DWTwnEm1IYyoj'
global.APIs = { // API Prefix
  // name: 'https://website'
  nrtm: 'https://nurutomo.herokuapp.com',//
  xteam: 'https://api.xteam.xyz',//
  zeks: 'https://api.zeks.xyz', //
  vhtear: 'https://api.vhtear.com',//
  lolhuman: 'http://api.lolhuman.xyz',//
  pencarikode: 'https://pencarikode.xyz'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.zeks.xyz': 'qyVJpszt0uSAL0lGCfOQIV3BVfp',
  'https://api.xteam.xyz': 'Syahrulidhamz30',
  'https://api.vhtear.com': 'Syahrulidhamz30',
  'http://api.lolhuman.xyz': 'Syahrulidhamz30',
  'https://pencarikode.xyz': 'pais'
}
global.packname = 'Hi'
global.author = 'LevBot'

global.dtu = 'ɪɴꜱᴛᴀɢʀᴀᴍ'
global.urlnya = "https://www.instagram.com/syahrul_idh"

//============= callButtons =============//
global.dtc = 'ᴄᴀʟʟ ᴏᴡɴᴇʀ'
global.phn = '+62 819-9928-4127'

global.multiplier = 69 // The higher, The harder levelup

let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})