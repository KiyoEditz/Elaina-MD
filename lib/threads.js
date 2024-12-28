const axios = require('axios');
const cheerio = require('cheerio');

async function threadster(id) {
  try {
    // Mengirimkan permintaan GET ke URL dengan header User-Agent
    const response = await axios.get(`https://threadster.app/download/${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Mendapatkan data HTML dari respon
    const html = response.data;

    // Memuat HTML ke cheerio untuk scraping
    const $ = cheerio.load(html);

    // Scraping elemen-elemen tertentu dari halaman
    const profile = $('.download_item_profile_pic img').attr('src');
    const caption = $('.download_itemcaption_text').text().trim();
    const download = $('.download_iteminfoactions_button').attr('href');
    const resolution = $('table tr:nth-child(2) td:first-child').text();

    // Mengembalikan data yang telah disusun
    return {
      profile: {
        picture: profile,
      },
      content: {
        caption: caption,
        download: {
          link: download,
          resolution: resolution,
        },
      },
    };
  } catch (error) {
    // Menangani error dan mengembalikan informasi error
    return {
      error: 'Error scraping page',
      message: error.message,
      responseStatus: error.response ? error.response.status : null,
      responseHeaders: error.response ? error.response.headers : null,
    };
  }
}

module.exports = threadster;