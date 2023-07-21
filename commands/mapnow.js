const { SlashCommandBuilder } = require("discord.js");
const puppeteer = require("puppeteer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mapnow")
    .setDescription("Replies with the current map available")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("The mode you want to know the map for")
        .setRequired(true)
        .addChoices(
          { name: "pubs", value: "pubs" },
          { name: "ranked", value: "ranked" }
        )
    ),

  async execute(interaction) {
    const mode = interaction.options.getString("mode");

    if (mode === "pubs") {
      const url = "https://apexmap.kuroi.io/br";
      interaction.reply(await whichMap(url, "public"));
    } else if (mode === "ranked") {
      const url = "https://apexmap.kuroi.io/br/ranked";
      interaction.reply(await whichMap(url, "ranked"));
    }
  },
};

async function whichMap(url, mode) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForSelector(".map-title");

  const map = await page.evaluate(() => {
    const mapTitleElement = document.querySelector(".map-title");
    return mapTitleElement ? mapTitleElement.innerText : "Map title not found";
  });

  await browser.close();

  return map + " is the map in rotation for " + mode + " matches.";
}
