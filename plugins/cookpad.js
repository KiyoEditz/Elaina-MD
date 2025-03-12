/*
Jangan Hapus Wm Bang 

*Cookpad  Plugins CJS*

Ya Intinya Cari Resep 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029Vb3ejRu2v1IvxWSPml0q/160
*/

const axios = require('axios');
const cheerio = require('cheerio');

class CookpadScraper {
  constructor(searchTerm) {
    this.searchTerm = searchTerm;
    this.baseUrl = 'https://cookpad.com/id/cari/';
  }

  async fetchSearchResults(page = 1) {
    const url = `${this.baseUrl}${this.searchTerm}?page=${page}`;
    const response = await axios.get(url);
    return cheerio.load(response.data);
  }

  async extractRecipeLinks($) {
    const links = [];
    $('a.block-link__main').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        links.push(`https://cookpad.com${href}`);
      }
    });
    if (links.length === 0 && $('.text-cookpad-14.xs\\:text-cookpad-20.font-semibold').text().includes('Tidak dapat menemukan resep?')) {
      throw new Error('Tidak ditemukan resep untuk pencarian ini.');
    }
    return links;
  }

  async fetchRecipePage(url) {
    const response = await axios.get(url);
    return cheerio.load(response.data);
  }

  async extractRecipeDetails($) {
    const title = $('h1').text().trim();
    const mainImage = $('img[alt^="Foto resep"]').attr('src');
    const cookingTime = $('.flex.flex-wrap .mise-icon-text').first().text().trim();
    const serving = $('.flex.flex-wrap .mise-icon-text').last().text().trim();

    const ingredients = [];
    $('#ingredients .ingredient-list ol li').each((i, el) => {
      if ($(el).hasClass('font-semibold')) {
        const subheading = $(el).find('span').text().trim();
        ingredients.push(`*${subheading}*`);
      } else {
        const quantity = $(el).find('bdi').text().trim();
        const ingredient = $(el).find('span').text().trim();
        ingredients.push(`- ${quantity} ${ingredient}`);
      }
    });

    const steps = [];
    $('ol.list-none li.step').each((i, el) => {
      const stepNumber = $(el).find('.flex-shrink-0 .text-cookpad-14').text().trim();
      const description = $(el).find('div[dir="auto"] p').text().trim();
      steps.push(`${stepNumber}. ${description}`);
    });

    return {
      title,
      mainImage,
      cookingTime,
      serving,
      ingredients: ingredients.join('\n'),
      steps: steps.join('\n')
    };
  }

  async scrapeRecipes() {
    try {
      const $ = await this.fetchSearchResults();
      const links = await this.extractRecipeLinks($);

      if (links.length === 0) {
        throw new Error('Tidak ditemukan resep untuk pencarian ini.');
      }

      const recipePage = await this.fetchRecipePage(links[0]);
      return await this.extractRecipeDetails(recipePage);
    } catch (error) {
      return { error: error.message };
    }
  }
}

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply('Masukkan nama resep yang ingin dicari.\nContoh: .resep ayam goreng');

  let scraper = new CookpadScraper(text);
  let recipe = await scraper.scrapeRecipes();

  if (recipe.error) return m.reply(recipe.error);

  let caption = `*${recipe.title}*\n\n` +
                `*Waktu Masak :* ${recipe.cookingTime}\n` +
                `*Porsi :* ${recipe.serving}\n\n` +
                `*Bahan-Bahan :*\n${recipe.ingredients}\n\n` +
                `*Langkah-Langkah :*\n${recipe.steps}`;

  if (recipe.mainImage) {
    conn.sendMessage(m.chat, { image: { url: recipe.mainImage }, caption }, { quoted: m });
  } else {
    m.reply(caption);
  }
};

handler.help = ['cookpad'];
handler.command = ['cookpad'];
handler.tags = ['internet', 'search'];
handler.limit = false;

module.exports = handler;