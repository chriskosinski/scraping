const https = require("https");
const cheerio = require("cheerio");

https.get(
  "https://shop.com/index.html",
  (response) => {
    const { statusCode } = response;
    if (statusCode !== 200) {
      return console.error(`Failed to retrieve page: HTTP error ${statusCode}`);
    }
    let html = "";
    response.on("data", (chunk) => {
      html += chunk;
    });
    response.on("end", () => {
      const $ = cheerio.load(html);

      const table = $(".tabela_std"); 
      let tableData = [];
      table.find("tr").each((i, row) => {
        const text = $(row).text(); 
        const links = $(row).find("a");
        let linkList = "";
        links.each((j, link) => {
          linkList += $(link).attr("href") + ", ";
        });
        linkList = linkList.trim(); 
        tableData[i] =
          `${text.trimStart()} "https://shop.com${linkList}"`.trim(",");
      });
      console.log(tableData); 
    });
  },
);
