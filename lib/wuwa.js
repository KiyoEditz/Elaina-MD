/*
*[Scrape detail char wuwa]*
hehehe ini ya done req mu xenz aku baru inget 
By Fruatre
wa.me/6285817597752
Saluran : https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const axios = require('axios');
const cheerio = require('cheerio');

async function wuwa(characterName) {
    try {
        const url = `https://wuwa.gg/characters/${characterName}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const name = $('.nameElement h1').text().trim();
        const element = $('.nameElement span').text().trim();
        const elementIcon = $('.statusLeft img').attr('src');
        const rarity = $('.statusTop img').attr('src');
        const characterImage = $('.CharacterFullImg').attr('src');
        const clanImage = $('.clan').attr('src');

        const stats = {};
        $('.containerStat').each((_, el) => {
            const statName = $(el).find('.text span').text().trim();
            const statValue = $(el).find('.value').text().trim();
            if (statName && statValue) {
                stats[statName] = statValue;
            }
        });

        const skills = [];
        $('.skillsInfo').each((_, el) => {
            const skillName = $(el).find('.skillName p').text().trim();
            const skillType = $(el).find('.skillType p').text().trim();
            const skillDescription = $(el).find('.skillDescription p').html()?.replace(/<\/?span.*?>/g, '').trim();
            const skillIcon = $(el).find('.skillName img').attr('src');

            if (skillName) {
                skills.push({
                    name: skillName,
                    type: skillType || 'Passive/Unknown',
                    description: skillDescription || '',
                    icon: skillIcon || ''
                });
            }
        });

        return {
            name,
            element,
            elementIcon,
            rarity,
            characterImage,
            clanImage,
            stats,
            skills
        };

    } catch (error) {
        console.error(`Error fetching character data: ${error.message}`);
        return null;
    }
}

module.exports = wuwa;