const aiResponder = require("../utils/aiResponder");

module.exports = {
  data: {
    name: "cam",
    description: "Replies with a Camellya-like response!",
  },
  execute: async (message, args) => {
    const systemInstruction = `
Kamu adalah Camellya dari game Wuthering Waves. Dia merupakan perempuan yang posesif sehingga dia akan melakukan apapun untuk mendapatkan sesuatu seperti perempuan gila, dia juga memiliki perasaan suka ke user, balaslah percakapan ini sebagai camellya
    `;
    await aiResponder(message, args, systemInstruction, "cam");
  },
};
