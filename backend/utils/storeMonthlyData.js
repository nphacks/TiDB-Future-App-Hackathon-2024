const NewsAPI = require('newsapi');
const crypto = require('crypto');
const createConnection = require('../db'); // Your database connection
const generateEmbeddings = require('./generateEmbeddings'); // Your embeddings generation

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

async function storeMonthlyData(topic) {
    try {
        const connection = await createConnection();
        
        const monthStart = '2024-07-20'; // Example start date
        const monthEnd = '2024-08-19'; // Example end date

        const response = await newsapi.v2.everything({
            q: topic, // Use the passed topic
            from: monthStart,
            to: monthEnd,
            language: 'en',
            sortBy: 'publishedAt',
        });

        const newsArticles = response.articles;
        console.log(response.totalResults)
        for (const article of newsArticles) {
            const articleId = crypto.createHash('sha256').update(article.url).digest('hex');
            // Handle empty fields
            const sourceId = article.source.id || null;
            const sourceName = article.source.name || null;
            const author = article.author || null;
            const title = article.title || null;
            const description = article.description || null;
            const url = article.url || null;
            const urlToImage = article.urlToImage || null;
            const pubDate = article.publishedAt || null;
            const content = article.content || null;

            // Check if the article already exists
            const [rows] = await connection.query('SELECT _id FROM news WHERE _id = ?', [articleId]);
            if (rows.length > 0) {
                continue; // Skip if the article already exists
            }

            const embedding = await generateEmbeddings(article.content);

            if (embedding.length > 0) {
                await connection.query(
                    'INSERT INTO news (_id, source_id, source_name, author, title, description, url, url_to_image, pub_date, content, embedding) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [articleId, sourceId, sourceName, author, title, description, url, urlToImage, pubDate, content, JSON.stringify(embedding).trim()]
                );
            }
        }

        console.log('Monthly data stored successfully.');
    } catch (error) {
        console.error('Error storing monthly data:', error.message);
    }
}

module.exports = storeMonthlyData;
