const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Function to score sentences based on keyword relevance and contextual fit
const scoreSentence = (sentence, keywords) => {
    const tokens = tokenizer.tokenize(sentence.toLowerCase());
    let score = 0;
    keywords.forEach(keyword => {
        if (tokens.includes(keyword.toLowerCase())) {
            score++;
        }
    });
    return score;
};

// Function to determine if a sentence fits the context of the chat message
const isContextuallyRelevant = (sentence, chatMessage) => {
    const chatTokens = tokenizer.tokenize(chatMessage.toLowerCase());
    const sentenceTokens = tokenizer.tokenize(sentence.toLowerCase());
    return chatTokens.some(token => sentenceTokens.includes(token));
};

// Function to get relevant sentences based on keywords and contextual relevance
const getRelevantSentences = (descriptions, chatMessage) => {
    const keywords = ["new", "feature", "latest", "upgrade", "improve"];
    const scoredSentences = descriptions.map(description => {
        const sentences = description.split('. ').map(sentence => ({
            sentence,
            score: scoreSentence(sentence, keywords),
            isRelevant: isContextuallyRelevant(sentence, chatMessage)
        }));
        return sentences;
    }).flat();

    // Filter and sort sentences based on relevance and score
    const relevantSentences = scoredSentences.filter(({ score, isRelevant }) => score > 0 && isRelevant)
                                             .sort((a, b) => b.score - a.score) // Sort by relevance
                                             .map(({ sentence }) => sentence);
    return relevantSentences;
};

// Function to return sentences with a limitation on the number of sentences
const getLimitedSentences = (sentences, limit) => {
    return sentences.slice(0, limit);
};

// Test the code
const descriptions = [
    "The latest Google Pixel model introduces a new AI-powered camera system that significantly improves low-light photography and adds enhanced video stabilization features.",
    "Google has launched the Pixel 8 with an upgraded processor and longer battery life. The new device also includes a redesigned display for better color accuracy and brightness.",
    "The new Google Pixel is priced at $699. It is available for purchase directly from the Google Store or various online retailers like Amazon and Best Buy.",
    "In a recent comparison, the Google Pixel was compared to the iPhone 15. The review highlighted that while the Pixel offers better AI features and camera capabilities, the iPhone 15 excels in overall performance and ecosystem integration."
];

const chatMessage = "What is new with Google Pixel?";
const relevantSentences = getRelevantSentences(descriptions, chatMessage);
const sentenceLimit = 3; // Set the number of sentences to return
const limitedSentences = getLimitedSentences(relevantSentences, sentenceLimit);

console.log(limitedSentences);  // Array of sentences to be displayed as bullet points
