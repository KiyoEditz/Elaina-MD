/*
*[Plugins Char Genshin Impact]* (CJS)
By Fruatre
wa.me/6285817597752
Saluran : https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const axios = require("axios");
const cheerio = require("cheerio");

let handler = async (m, { conn, args }) => {
  const genshin = new GenshinCharacter();
  const name = args[0];
  if (!name) return m.reply("Masukkan nama karakter!");

  try {
    const data = await genshin.getCharacter(name);
    const response = `
🌟 **Character Overview**  
**Title:** ${data.title}  
**Description:** ${data.description}  
**Element:** ❄️ ${data.element}  
**Weapon:** ⚔️ ${data.weapon}  
**Role:** 🎯 ${data.role}  

---

🛠️ **Upgrade Materials:**  
${data.upgradeMaterials
  .map(
    (item) =>
      `- ${item.name} ![${item.name}](${item.icon})`
  )
  .join("\n")}  

---

⚔️ **Best Weapons:**  
${data.bestWeapons
  .map(
    (item, i) =>
      `${i + 1}️⃣ ${item.name} ![${item.name}](${item.icon})`
  )
  .join("\n")}  

---

🏺 **Best Artifacts:**  
${data.bestArtifacts
  .map(
    (artifact) =>
      `- ${artifact.name} (${artifact.pieces} Pieces) ![${artifact.name}](${artifact.icon})`
  )
  .join("\n")}  

---

📊 **Recommended Stats:**  
${data.stats.map((stat) => `- ${stat}`).join("\n")}

---

👥 **Best Teams:**  
${data.bestTeams
  .map((team, i) => `${i + 1}️⃣ ${team.name} - ${team.characters.join(", ")}`)
  .join("\n")}

---

💡 **Talents:**  
${data.talents
  .map(
    (talent) =>
      `**${talent.title}:** ${talent.name} - ${talent.description}`
  )
  .join("\n")}

---

🔮 **Passives:**  
${data.passives
  .map(
    (passive) =>
      `**${passive.title}:** ${passive.name} - ${passive.description}`
  )
  .join("\n")}

---

✨ **Constellations:**  
${data.constellations
  .map(
    (constellation) =>
      `**${constellation.title}:** ${constellation.name} - ${constellation.description}`
  )
  .join("\n")}
    `.trim();
    conn.reply(m.chat, response, m);
  } catch (e) {
    m.reply("Karakter tidak ditemukan atau terjadi kesalahan.");
  }
};

handler.help = handler.command = ["genshinchar","genshinimpactcharacter"];
handler.tags = ["tools"];
module.exports = handler;

//tuh kontol skrepnya colong aja persi gwejh (fruatre)
class GenshinCharacter {
  async getCharacter(name) {
    const url = `https://genshin.gg/characters/${name.toLowerCase()}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");
    const element = $(".character-element").attr("alt");
    const weapon = $(".character-path-icon").attr("alt");
    const role = $(".character-role").text();
    const upgradeMaterials = $(".character-materials-item")
      .map((_, el) => ({
        name: $(el).find(".character-materials-name").text(),
        icon: $(el).find(".character-materials-icon").attr("src"),
      }))
      .get();
    const bestWeapons = $(".character-build-weapon")
      .map((_, el) => ({
        rank: $(el).find(".character-build-weapon-rank").text(),
        name: $(el).find(".character-build-weapon-name").text(),
        icon: $(el).find(".character-build-weapon-icon").attr("src"),
      }))
      .get();
    const bestArtifacts = $(".character-build-weapon-content.full")
      .map((_, el) => ({
        name: $(el).find(".character-build-weapon-name").text(),
        icon: $(el).find(".character-build-weapon-icon").attr("src"),
        pieces: $(el).find(".character-build-weapon-count").text(),
      }))
      .get();
    const stats = $(".character-stats-item")
      .map((_, el) => $(el).text().trim())
      .get();
    const bestTeams = $(".character-team")
      .map((_, el) => ({
        name: $(el).find(".character-team-name").text(),
        characters: $(el).find(".character-team-characters img").map((_, img) => $(img).attr("alt")).get(),
      }))
      .get();
    const talents = $(".character-skills .character-skill")
      .map((_, el) => ({
        title: $(el).find(".character-skill-title").text(),
        name: $(el).find(".character-skill-name").text(),
        description: $(el).find(".character-skill-description").text(),
      }))
      .get();
    const passives = $(".character-skills#passives .character-skill")
      .map((_, el) => ({
        title: $(el).find(".character-skill-title").text(),
        name: $(el).find(".character-skill-name").text(),
        description: $(el).find(".character-skill-description").text(),
      }))
      .get();
    const constellations = $(".character-skills#constellations .character-skill")
      .map((_, el) => ({
        title: $(el).find(".character-skill-title").text(),
        name: $(el).find(".character-skill-name").text(),
        description: $(el).find(".character-skill-description").text(),
      }))
      .get();

    return {
      title,
      description,
      element,
      weapon,
      role,
      upgradeMaterials,
      bestWeapons,
      bestArtifacts,
      stats,
      bestTeams,
      talents,
      passives,
      constellations,
    };
  }
}