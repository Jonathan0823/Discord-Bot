const triggers = {
  nigger: "Fakyumanigger",
  ts: "icl ts pmo sm n sb rn ngl, r u srsly srs n fr rn vro? Smh lol atp js go 💔... b fr vro, idek nm sybau, brb gng gtg atm lmao, bt ts pmo 2 js lmk lol onb fr, ac nvm b wt istg ts vro keys🙏💔 ts pmo",
  "my kisah": "karbit",
  nahh: "Nah🥀she🥀got🥀you🥀blushin🥀twin🥀awh🥀hell🥀nah🥀twin🥀you🥀gotta🥀lock🥀up🥀twin🥀this🥀ain🥀even🥀you🥀twin🥀on🥀foenem🥀grave🥀bruh🥀euuahhhh🥀",
};

const triggerWords = async (interaction) => {
  if (!interaction.content || interaction.author.bot) return;
  const message = interaction.content.toLowerCase();

  if (triggers[message]) {
    await interaction.channel.send(triggers[message]);
    return true;
  }
};

module.exports = {
  triggerWords,
};
