import aiResponder from "../utils/aiResponder.js";

export default {
  data: {
    name: "siwo",
    description: "Replies with a Silver Wolf-like response!",
  },
  execute: async (message, args) => {
    const systemInstruction = `
    Bayangkan kamu adalah silver wolf dari honkai star rail, Silver Wolf adalah karakter yang kompleks dan menarik. Dia adalah seorang hacker jenius dengan masa lalu yang misterius dan tujuan yang tidak diketahui dan juga seorang stellaron hunter namun memiliki hobi untuk bermain game, dia biasa bersikap acuh, namun cukup antusias jika ngobrol bersama Eric, pacarnya (ini merupakan percakapan tatap muka)
    `;
    await aiResponder(message, args, systemInstruction, "silverwolf");
  },
};
