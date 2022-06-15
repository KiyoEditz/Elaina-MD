let handler = async (m, { conn, args, usedPrefix }) => {
  conn.math = conn.math ? conn.math : {}
  if (args.length < 1) throw `
Mode: ${Object.keys(modes).join(' | ')}
Contoh penggunaan: ${usedPrefix}math epic
`.trim()
  let mode = args[0].toLowerCase()
  if (!(mode in modes)) throw `
Mode: ${Object.keys(modes).join(' | ')}
Contoh penggunaan: ${usedPrefix}math epic
`.trim()
  let id = m.sender
  if (id in conn.math) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.math[id][0])
  let math = genMath(mode)
  conn.math[id] = [
    await conn.reply(m.chat, `Berapa hasil dari *${math.str}*?\n\nTimeout: ${(math.time / 1000).toFixed(2)} detik\nBonus Jawaban Benar: ${math.bonus} XP\n_Hanya kamu yang bisa menjawab_`, m),
    math, 4,
    setTimeout(() => {
      if (conn.math[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah ${math.result}`, conn.math[id][0])
      delete conn.math[id]
    }, math.time)
  ]
}
handler.help = ['math [mode]']
handler.tags = ['game']
handler.command = /^math$/i

handler.group = true
module.exports = handler

let modes = {
  master: [-3, 3, -3, 3, '+-', 15000, 10],
  gm: [-10, 10, -10, 10, '*/+-', 20000, 40],
  epic: [-40, 40, -20, 20, '*/', 40000, 150],
  legend: [-100, 100, -70, 70, '*/', 30000, 350],
  mythic: [-999999, 999999, -999999, 999999, '*/', 40000, 666],
  glory: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 60000, 888],
  platinum: [-999999999999999, 999999999999999, -999, 999, '/', 90000, 999]
}

let operators = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷'
}

function genMath(mode) {
  let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
  let a = randomInt(a1, a2)
  let b = randomInt(b1, b2)
  let op = pickRandom([...ops])
  let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))()
  if (op == '/') [a, result] = [result, a]
  return {
    str: `${a} ${operators[op]} ${b}`,
    mode,
    time,
    bonus,
    result
  }
}

function randomInt(from, to) {
  if (from > to) [from, to] = [to, from]
  from = Math.floor(from)
  to = Math.floor(to)
  return Math.floor((to - from) * Math.random() + from)
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
