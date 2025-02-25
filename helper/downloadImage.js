const axios = require("axios");

async function downloadImage(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
}

module.exports = { downloadImage };
