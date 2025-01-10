const fetch = require("node-fetch");

class TeraboxHnn {
  getInfo = async (inputUrl) => {
    try {
      const url = `https://terabox.hnn.workers.dev/api/get-info?shorturl=${inputUrl.split("/").pop()}&pwd=`;
      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
        Referer: "https://terabox.hnn.workers.dev/",
      };
      const response = await fetch(url, {
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(
          `Gagal mengambil informasi file: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Gagal mengambil informasi file:", error);
      throw error;
    }
  };

  getDownloadLink = async (fsId, shareid, uk, sign, timestamp) => {
    try {
      const url = "https://terabox.hnn.workers.dev/api/get-download";
      const headers = {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
        Referer: "https://terabox.hnn.workers.dev/",
      };
      const data = {
        shareid: shareid,
        uk: uk,
        sign: sign,
        timestamp: timestamp,
        fs_id: fsId,
      };
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(
          `Gagal mengambil link download: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Gagal mengambil link download:", error);
      throw error;
    }
  };

  download = async (inputUrl) => {
    try {
      const { list, shareid, uk, sign, timestamp } =
        await this.getInfo(inputUrl);
      if (!list) {
        throw new Error(`File tidak ditemukan`);
      }
      let array = [];
      for (let i = 0; i < list.length; i++) {
        const fsId = list[i].fs_id;
        const { downloadLink } = await this.getDownloadLink(
          fsId,
          shareid,
          uk,
          sign,
          timestamp
        );
        array.push({
          filename: list[i].filename,
          size: list[i].size,
          download: downloadLink,
        });
      }
      return array;
    } catch (error) {
      console.error("Gagal mengunduh file:", error);
      throw error;
    }
  };
}

module.exports = new TeraboxHnn();