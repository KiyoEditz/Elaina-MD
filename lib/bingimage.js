/** !! THIS CODE GENERATE BY RODOTZBOT !! **/

var { Readable } = require('node:stream')
var { pipeline } = require('node:stream/promises')
var { setTimeout } = require('node:timers/promises')
var { createWriteStream } = require('node:fs')

const BASE_ENDPOINT = 'https://www.bing.com/images/create';

class BingImageClient {
    constructor(options) {
        this.headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'max-age=0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referrer': BASE_ENDPOINT,
            'Origin': new URL(BASE_ENDPOINT).origin,
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63',
            'Cookie': options.token,
        };
        this.options = {
            dir: process.cwd(),
            notify: false,
            ...options,
        };
    }

    async getImages(prompt) {
        const response = await fetch(`${BASE_ENDPOINT}?q=${prompt}&rt=4&FORM=GENCRE`, {
            headers: {
                ...this.headers,
                redirect: 'manual',
            },
            method: 'POST',
            credentials: 'include',
        });

        let id = new URLSearchParams(response.url).get('id');

        await fetch(`${BASE_ENDPOINT}/create?q=${prompt}&rt=4&FORM=GENCRE&id=${id}`);

        if (!id) {
            const response = await fetch(`${BASE_ENDPOINT}?q=${prompt}&rt=3&FORM=GENCRE`, {
                headers: {
                    ...this.headers,
                    redirect: 'manual',
                },
                method: 'POST',
                credentials: 'include',
            });

            id = new URLSearchParams(response.url).get('id');

            await fetch(`${BASE_ENDPOINT}?q=${prompt}&rt=3&FORM=GENCRE&id=${id}&nfy=1`, {
                headers: this.headers,
                method: 'GET',
            });

            if (this.options.notify) {
                await fetch(`${BASE_ENDPOINT}/async/notify/CreationComplete?rid=${id}&nfy=1`, {
                    headers: this.headers,
                    method: 'GET',
                });
            }

            if (!id) {
                throw new Error('Image ID was returned as null. You may have run out of boosts, or your cookie is invalid.');
            }
        }

        while (true) {
            const getimages = await fetch(`${BASE_ENDPOINT}/async/results/${id}?q=${prompt}`, {
                headers: this.headers,
                method: 'GET',
            });

            const resp_text = await getimages.text();

            if (resp_text == '') {
                await setTimeout(100);
            } else {
                const links = [...resp_text.matchAll(/src="([^"]+)"/g)];
                const array = [];

                for (let i = 0; i < links.length; i++) {
                    array.push(links[i][1].replace(/tse[1234]\.mm\.bing\.net/, 'th.bing.com').replace(/\?.*/, ''));
                }

                return array;
            }
        }
    }

    async downloadImages(urls) {
        for (const url of urls) {
            const response = await fetch(url, {
                headers: this.headers,
                method: 'GET',
            });

            const file = createWriteStream(`${this.options.dir}/${urls.indexOf(url)}.jpeg`);

            const webStreamToNode = Readable.from(await response.body);
            await pipeline(webStreamToNode, file);
        }
    }
}

module.exports = BingImageClient;