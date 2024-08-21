// we need axios to make HTTP requests
const axios = require('axios');

// and we need jsdom and Readability to parse the article HTML
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

// First lets get some search data from News API

// Build the URL we are going request. This will get articles related to Apple and sort them newest first
let url = 'https://newsapi.org/v2/everything?' +
'q=Olympics&' +
'sortBy=publishedAt&' +
'apiKey=39a42cb3a630474fb15a20774b1cd9e7';

axios.get(url)
  .then(function (r1) {
    // Check if there are articles in the response
    if (r1.data.articles && r1.data.articles.length > 0) {
      let firstResult = r1.data.articles[0];
        console.log(firstResult)
      // Ensure the URL is valid
      if (firstResult.url) {
        return axios.get(firstResult.url);
      } else {
        throw new Error('No URL found for the first article');
      }
    } else {
      throw new Error('No articles found in the response');
    }
  })
  .then(function (r2) {
    let dom = new JSDOM(r2.data, {
      url: r2.request.res.responseUrl // Use the final URL after redirects
    });
    let article = new Readability(dom.window.document).parse();
    console.log(article.textContent);
  })
  .catch(function (error) {
    console.error('Error:', error.message);
  });