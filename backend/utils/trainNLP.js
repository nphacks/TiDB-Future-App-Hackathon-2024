const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });

// Add training data
manager.addDocument('en', 'What is the latest news about %entity%', 'news.latest');
manager.addEntity('entity', 'company');
// Add more training data as needed

// Train the model
(async () => {
    await manager.train();
    manager.save();
    console.log('NLP Manager trained and saved.');
})();
