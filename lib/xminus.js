const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const FormData = require('form-data');

async function getTokenAndCookie() {
    try {
        const response = await axios.get('https://x-minus.pro/ai');
        const $ = cheerio.load(response.data);
        const token = $('input#vocal-cut-auth-key').attr('value');
        const cookie = response.headers['set-cookie']?.join(';') || "";
        return { token, cookie };
    } catch (error) {
        console.error('Error fetching token and cookie:', error.message);
        return null;
    }
}

const checkJobStatus = async (jobId, authKey) => {
  const url = "https://x-minus.pro/upload/vocalCutAi?check-job-status";

  const formData = new FormData();
  formData.append("job_id", jobId);
  formData.append("auth_key", authKey);
  formData.append("locale", "en_US");

  try {
    const response = await axios.post(url, formData, { headers: formData.getHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error checking job status:", error);
    return null;
  }
};

const pollJobStatus = async (jobId, authKey, interval = 5000) => {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      const resData = await checkJobStatus(jobId, authKey);
      console.log('Proses:', resData);

      if (resData?.status === 'done') {
        clearInterval(intervalId);
        resolve(resData);
      } else if (resData?.status === 'error') {
        clearInterval(intervalId);
        reject(new Error("Job failed"));
      }
    }, interval);
  });
};

const triggerDownload = async (jobId, stem) => {
    try {
        const url = `https://mmd.uvronline.app/dl/vocalCutAi?job-id=${jobId}&stem=${stem}&fmt=mp3&cdn=0`;
        const trigg = await axios.get(url, {
            maxRedirects: 0, // Supaya gak auto-follow redirect
            validateStatus: (status) => status === 302 // Cuma anggap sukses kalau dapat 302
        });
        console.log(`✅ ${stem} file siap diakses.`, trigg.data);
    } catch (error) {
        console.error(`Error triggering ${stem} download:`, error.message);
    }
};

async function ExtractVocalMusic(buffer) {
    try {
        const { token, cookie } = await getTokenAndCookie();
        if (!token || !cookie) {
            throw new Error('Token CSRF atau cookie tidak ditemukan');
        }

        console.log('Mengupload...', token, cookie);
        const formData = new FormData();
        formData.append('auth_key', token);
        formData.append('locale', 'en_US');
        formData.append('separation', 'inst_vocal');
        formData.append('separation_type', 'vocals_music');
        formData.append('format', 'mp3');
        formData.append('version', '3-4-0');
        formData.append('model', 'mdx_v2_vocft');
        formData.append('aggressiveness', '2');
        formData.append('lvpanning', 'center');
        formData.append('uvrbve_ct', 'auto');
        formData.append('pre_rate', '100');
        formData.append('bve_preproc', 'auto');
        formData.append('show_setting_format', '0');
        formData.append('hostname', 'x-minus.pro');
        formData.append('client_fp', '-');
        formData.append('myfile', buffer, {
            filename: `audio_extract_${Math.random().toString(36).slice(2)}.mp3`,
            contentType: 'audio/mpeg'
        });

        const headers = { ...formData.getHeaders(), 'accept': '*/*' };
        const uploadResponse = await axios.post('https://x-minus.pro/upload/vocalCutAi?catch-file', formData, { headers });

        console.log('Upload selesai:', uploadResponse.data);
        const jobId = uploadResponse.data.job_id;
        const similarjobIdkontol = uploadResponse.data.similar_job_id;

        await pollJobStatus(jobId, token);

        console.log('Triggering downloads...');
        await triggerDownload(jobId, 'vocal');
        await triggerDownload(jobId, 'inst');

        return {
            vocal: `https://${uploadResponse.data.worker_sd}.uvronline.app/separated/${similarjobIdkontol||jobId}_Vocals.mp3?fn=${uploadResponse.data.source_filename}%20%28Vocals%29%20%28MDX%20v2%20Voc%20FT%29.mp3`,
            music: `https://${uploadResponse.data.worker_sd}.uvronline.app/separated/${similarjobIdkontol||jobId}_Instruments.mp3?fn=${uploadResponse.data.source_filename}%20%28Backing%20Track%29%20%28MDX%20v2%20Voc%20FT%29.mp3`
        };

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = { ExtractVocalMusic };