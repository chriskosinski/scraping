// main.js
// GOTO website, start browser and download HTML
import { firefox } from "playwright";
import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";

/*
 * This is very crude, but it works.
 * toFix:
 * 1. close tab [n] -> open tab [n+1]
 * instead of firing up new browser
 * 2. Save to file instead of console.log
 */

for (let step = 1; step < 11; step++) {
  const url = "https://website.com/seriale?page=" + step;
  const browser = await firefox.launch({ headless: false });
  //const page = await browser.newPage();
  const context = await browser.newContext();
  const page = await context.newPage();
  const response = await page.goto(url);
  const html = await page.content();
  const $ = cheerio.load(html);
  const infoNodes = $(".info");

  const results = [];

  for (const node of infoNodes) {
    const titleElement = $(node).find(".title");
    const tytul = titleElement.text().trim();

    const descElement = $(node).find(".title-original");
    const tytul_oryginalny = descElement.text().trim();

    const genresElement = $(node).find(".genres");
    const gatunki = genresElement.text().trim();

    const countriesElement = $(node).find(".countries");
    const kraj = countriesElement.text().trim();

    const dateElement = $(node).find(".date");
    const rok_wydania = dateElement.text().trim();

    const rateElement = $(node).find(".rate");
    const ocena = rateElement.text().trim();

    const href = $(node).html();
    const linkElement = $(href.valueOf());
    const link = linkElement.attr("href");

    results.push({
      tytul,
      tytul_oryginalny,
      gatunki,
      kraj,
      rok_wydania,
      ocena,
      link,
    });
  }
  console.log("[{Strona_nr: " + "'" + step + "'");
  console.log(results);
  console.log("}]");
  await browser.close();
}
