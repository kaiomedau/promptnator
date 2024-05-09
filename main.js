const axios = require("axios");
const cheerio = require("cheerio"); // new addition

const purl = `https://fridaysupply.gumroad.com/l/free-procreate-pencil-brushes`;

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
      "[task] Redigir uma descrição do produto com base nas informações fornecidas. \n" +
      "[context] Este texto será usado para descrever um conjunto de pincéis disponibilizado em nosso site para download direto na loja do criador. \n" +
      "[format] O texto deve ter pelo menos 600 caracteres e não deve dar a impressão de que o autor do texto é o criador do produto. \n" +
      "[Informações] ";

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
