const express = require('express');
const router = express.Router();
const createConnection = require('../db');  // Import database connection
const storeMonthlyData = require('../utils/storeMonthlyData');
const generateEmbeddings = require('../utils/generateEmbeddings');
const cosineSimilarity = require('../utils/cosineSimilarity');
require('dotenv').config();

router.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const queryEmbedding = await generateEmbeddings(query);
        const connection = await createConnection();

        const [rows] = await connection.query('SELECT _id, title, description, content, pub_date, embedding FROM news ORDER BY pub_date DESC');        

        // Filter out rows with empty or null values
        const validRows = rows.filter(row => 
            row.title && 
            row.description && 
            row.content && 
            row.pub_date && 
            row.embedding
        );

        
        // Calculate cosine similarity
        const results = validRows.map(row => {
            console.log('Getting isnide map')
            let articleEmbedding;
            try {
                // Ensure embedding is treated as a string and parse it
                const embeddingString = String(row.embedding).trim();
                const jsonString = `[${embeddingString}]`;
                articleEmbedding = JSON.parse(jsonString);
            } catch (jsonError) {
                console.error(`Error parsing embedding for _id ${row._id}:`, jsonError.message);
                return null; // Skip this row if the embedding is invalid
            }


            const similarity = cosineSimilarity(queryEmbedding, articleEmbedding);
            return { ...row, similarity };
        }).filter(result => result && result.similarity > 0.8) // Filter by similarity threshold
        .sort((a, b) => new Date(b.pub_date) - new Date(a.pub_date)); // Sort by date

        res.json(results);
    } catch (error) {
        console.error('Error during search:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/search/newsapi', async (req, res) => {
    try {
        const topic = req.query.q; // Extract topic from query params
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }
        
        await storeMonthlyData(topic); // Call the function with the topic
        res.json({ message: 'Data stored successfully.' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to store news data.' });
    }
});

const isValidJson = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
};

module.exports = router;