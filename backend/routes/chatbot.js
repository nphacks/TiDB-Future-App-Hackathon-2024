const express = require('express');
const router = express.Router();
const createConnection = require('../db'); // Database connection
const natural = require('natural');
const generateEmbeddings = require('../utils/generateEmbeddings');
const cosineSimilarity = require('../utils/cosineSimilarity');
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });

router.get('/chat', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        // Step 1: Preprocess the query with NLP enhancements
        const { cleanedQuery, entities } = preprocessQuery(query);

        // Optionally use entities in your search logic
        const queryEmbedding = await generateEmbeddings(cleanedQuery);

        const connection = await createConnection();
        const [rows] = await connection.query('SELECT _id, title, description, content, pub_date, embedding FROM news ORDER BY pub_date DESC');        

        // Filter and process as before
        const validRows = rows.filter(row => 
            row.title && 
            row.description && 
            row.content && 
            row.pub_date && 
            row.embedding
        );

        const results = validRows.map(row => {
            let articleEmbedding;
            try {
                const embeddingString = String(row.embedding).trim();
                const jsonString = `[${embeddingString}]`;
                articleEmbedding = JSON.parse(jsonString);
            } catch (jsonError) {
                console.error(`Error parsing embedding for _id ${row._id}:`, jsonError.message);
                return null;
            }

            const similarity = cosineSimilarity(queryEmbedding, articleEmbedding);
            return { ...row, similarity };
        }).filter(result => result && result.similarity > 0.8)
          .sort((a, b) => new Date(b.pub_date) - new Date(a.pub_date));

        const response = generateResponse(results);
        res.json(response);
    } catch (error) {
        console.error('Error during search:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


function extractEntities(query) {
    const entities = [];
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(query);

    // Simple entity extraction (e.g., looking for capitalized words)
    tokens.forEach(token => {
        if (/[A-Z]/.test(token[0])) {
            entities.push(token);
        }
    });

    return entities;
}

function preprocessQuery(query) {
    // Step 1: Basic preprocessing
    const cleanedQuery = query.toLowerCase().replace(/[^\w\s]/gi, '').trim();

    // Step 2: Extract entities
    const entities = extractEntities(query);

    return { cleanedQuery, entities };
}

function generateResponse(relevantArticles) {
    if (relevantArticles.length === 0) {
        return { message: 'No relevant articles found.' };
    }

    // Select the top 3 articles
    const topArticles = relevantArticles.slice(0, 3);

    // Create a response object
    const response = topArticles.map(article => ({
        _id: article._id,
        title: article.title,
        description: article.description,
        pub_date: article.pub_date,
        url: article.url,
        similarity: article.similarity,
        snippet: article.content.substring(0, 200) + '...', // Short snippet of the content
    }));

    return response;
}


module.exports = router;
