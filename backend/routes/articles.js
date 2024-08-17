const express = require('express');
const router = express.Router();
const db = require('../db');  // Import database connection

router.get('/articles', (req, res) => {
    console.log('Hitting articles')
    const query = 'SELECT * FROM articles';

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching articles:', err.message);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
    });
});

module.exports = router;
