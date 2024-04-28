const axios = require("axios");
const cheerio = require("cheerio"); // new addition

const purl = `https://fridaysupply.gumroad.com/l/free-procreate-pencil-brushes`;
// const purl = `https://artwithflo.gumroad.com/l/ultimateprocreatebrushcollection`;

async function scrapeSite() {
  const url = purl;
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const results = [];

  $("article.product").each((i, elem) => {
    const rating = $(elem).find("header .rating").text();
    const title = $(elem).find("h1").text();
    const user = $(elem).find("section.details .user").text();
    const user_url = $(elem).find("section.details .user").attr("href");
    const price = $(elem).find("section.details .price").attr("content");
    const description = $(elem).find("section section div.rich-text").text();
    // const image = $(elem).find(".carousel .preview-content");

    results.push({
      title,
      user,
      user_url,
      rating,
      price,
      description,
    });
  });

  return results;
}
scrapeSite()
  .then((result) => {
    console.log(result);
    const p = result[0];

    var prompt =
      "Por gentileza, você pode criar uma descrição em português com no mínimo 500 caracteres sobre o produto abaixo. Caso o texto esteja na primeira pessoa, mude para que fique claro que eu não sou o criador desse produto ou ilustrações relacionadas à ele: \n";

    prompt += p.title + " by " + p.user + "\n";
    if (p.rating) {
      prompt += "Rating: " + p.rating + "\n";
    }
    if (p.price) {
      prompt += "Price: " + (p.price > 0 ? "Paid" : "Free") + "\n";
    }
    if (p.description) {
      prompt += p.description;
    }

    console.log(prompt);
  })
  .catch((err) => console.log(err));
