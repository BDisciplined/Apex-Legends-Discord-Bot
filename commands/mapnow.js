const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js"); // Utilizziamo MessageEmbed invece di EmbedBuilder
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
      await whichMap(interaction, url, "Public"); // Passiamo anche interaction come argomento
    } else if (mode === "ranked") {
      const url = "https://apexmap.kuroi.io/br/ranked";
      await whichMap(interaction, url, "Ranked"); // Passiamo anche interaction come argomento
    }
  },
};

async function whichMap(interaction, url, mode) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let map_for_links = [];

  //imgs
  const Kings_Canyon =
    "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/5/51/Kings_Canyon_MU4.png/revision/latest?cb=20220818183834";
  const Worlds_Edge =
    "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/4/4f/World%27s_Edge_MU4.png/revision/latest?cb=20230513185802";
  const Olympus =
    "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/5/55/Olympus_MU2_REV1.png/revision/latest?cb=20220821050530";
  const Storm_Point =
    "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/5/56/Storm_Point_MU1.png/revision/latest?cb=20220511235629";
  const Broken_Moon =
    "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/5/55/Broken_Moon.png/revision/latest?cb=20221103145318";

  //interactive map links
  const Kings_Canyon_interactive =
    "https://apexlegendsstatus.com/interactive-map/mp_rr_canyonlands_hu";
  const Worlds_Edge_interactive =
    "https://apexlegendsstatus.com/interactive-map/mp_rr_desertlands_hu";
  const Olympus_interactive =
    "https://apexlegendsstatus.com/interactive-map/mp_rr_olympus_mu2";
  const Storm_Point_interactive =
    "https://apexlegendsstatus.com/interactive-map/mp_rr_tropic_island_mu1";
  const Broken_Moon_interactive =
    "https://apexlegendsstatus.com/interactive-map/mp_rr_divided_moon";

  await page.goto(url);

  await page.waitForSelector(".map-title");

  const map = await page.evaluate(() => {
    const mapTitleElement = document.querySelector(".map-title");
    return mapTitleElement ? mapTitleElement.innerText : "Map title not found";
  });

  const nextMap = await page.evaluate(() => {
    const mapTitleElement = document.querySelector(".upcoming-map-title a");
    return mapTitleElement ? mapTitleElement.innerText : "Map title not found";
  });

  const nextMapTime = await page.evaluate(() => {
    const allSpan = document.querySelectorAll("div.upcoming-map-title span");
    const lastSpan = allSpan[allSpan.length - 1];

    return lastSpan ? lastSpan.textContent : "Time not found";
  });

  switch (map) {
    case "King's Canyon":
      map_for_links[0] = Kings_Canyon;
      map_for_links[1] = Kings_Canyon_interactive;
      break;

    case "World's Edge":
      map_for_links[0] = Worlds_Edge;
      map_for_links[1] = Worlds_Edge_interactive;
      break;

    case "Olympus":
      map_for_links[0] = Olympus;
      map_for_links[1] = Olympus_interactive;
      break;

    case "Storm Point":
      map_for_links[0] = Storm_Point;
      map_for_links[1] = Storm_Point_interactive;
      break;

    case "Broken Moon":
      map_for_links[0] = Broken_Moon;
      map_for_links[1] = Broken_Moon_interactive;
  }

  await browser.close();

  const embedMessage = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(map)
    .setURL(map_for_links[1])
    .setDescription(map + " is the map in rotation for " + mode + " matches.")
    .addFields(
      { name: "Next map", value: nextMap, inline: true },
      { name: "Time", value: nextMapTime, inline: true }
    )
    .setImage(map_for_links[0]);

  interaction.reply({ embeds: [embedMessage] });
}
