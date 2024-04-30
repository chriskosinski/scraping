#!/usr/bin/env node
//This won't work without valid value of user_session cookie !

/* 
Usage:
./index.js https://github.com/chriskosinski
$ for i in $(cat /tmp/1.txt ); do node index.js $i; done

Output:
{
  Name: 'Kerem Bozdas',
  Description: 'Software Engineer',
  Email: 'krmbzds.github@gmail.com',
  Website: 'https://kerembozdas.com',
}
{
  Name: 'Matt',
  Description: 'Music, Art, Videogames and Cookies lover.\n' +
    'Drummer, pianist and music composer. Arch and Catppuccin enthusiast.',
  Email: 'sergiolain11@gmail.com',
  Website: 'https://linktr.ee/matt_ftw',
}
{...


*/
import { firefox } from "playwright";
import * as cheerio from "cheerio";

const args = process.argv;
const url = args[2]; // assuming you have two arguments in the command line (script and URL)

const browser = await firefox.launch({ headless: false });
const context = await browser.newContext();
await context.addCookies([
  {
    //must be valid session cookie from firefox
    name: "user_session",
    value: "",
    url: "https://github.com",
  },
]);
//cheerio stub
const page = await context.newPage();
const response = await page.goto(url);
const html = await page.content();
const $ = cheerio.load(html);

var name = $(html).find(".p-name").text();
var noteText = $(".p-note").text();
var linkPrimary = $(html).find(".Link--primary").eq(1);
var email = $(html).find(".Link--primary").eq(0);
//var twitter = $(html).find(".Link--primary").eq(2);

const data = {
  Name: name.trim(),
  Description: noteText,
  Email: email.text(),
  Website: linkPrimary.text(),
  //Twitter: twitter.text(),
};

console.log(data);
await browser.close();
