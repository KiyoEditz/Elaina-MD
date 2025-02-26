
let axios = require('axios');
let BodyForm = require('form-data');
let fs = require('fs');
let cheerio = require('cheerio');

async function CatBox(filePath) {
	try {
		const fileStream = fs.createReadStream(filePath);
		const formData = new BodyForm();
		formData.append('fileToUpload', fileStream);
		formData.append('reqtype', 'fileupload');
		formData.append('userhash', '');
		const response = await axios.post('https://catbox.moe/user/api.php', formData, {
			headers: {
				...formData.getHeaders(),
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error at Catbox uploader:", error);
		return "Terjadi kesalahan saat upload ke Catbox.";
	}
};

async function pomfCDN(path) {
	try {
		const fileStream = fs.createReadStream(path);
		const formData = new BodyForm();
		formData.append('files[]', fileStream);
		const response = await axios.post('https://pomf.lain.la/upload.php', formData, {
			headers: {
				...formData.getHeaders(),
			},
		});
		return response.data.files[0].url;
	} catch (error) {
		console.log("Error at pomf uploader in lib/uploader.js:", error);
		return "Terjadi Kesalahan";
	}
};

async function fileIO(filePath) {
	try {
		const fileStream = fs.createReadStream(filePath);
		const formData = new BodyForm();
		formData.append('file', fileStream);
		const response = await axios.post('https://file.io/?expires=1d', formData, {
			headers: formData.getHeaders(),
		});
		if (response.data && response.data.success) {
			return response.data.link;
		} else {
			throw new Error('File upload failed.');
		}
	} catch (error) {
		console.error('Error at File.io uploader:', error);
		return 'Terjadi kesalahan saat upload ke file.io.';
	}
};

async function Telegraph(path) {
   try {
      let d = new BodyForm();
      d.append("images", fs.createReadStream(path));
      
     let h = {
        headers: {
           ...d.getHeaders()
        }
     }
     
     let { data: uploads } = await axios.post("https://telegraph.zorner.men/upload", d, h);
     return uploads.links
   } catch (e) {
      console.error(e.message)
   }
}

module.exports = { CatBox, pomfCDN, fileIO, Telegraph };