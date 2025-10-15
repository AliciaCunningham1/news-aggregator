// Singleton Pattern: ConfigManager
const ConfigManager = (function() {
    let instance;

    function createInstance() {
        return {
            theme: 'dark'
        };
    }

    function getInstance() {
        if (!instance) instance = createInstance();
        return instance;
    }

    return {
        getInstance: getInstance
    };
})();

// Module Pattern: NewsFetcher
const NewsFetcher = (function () {
    const fetchUrl = 'https://your-netlify-site.netlify.app/.netlify/functions/fetchNews'; // Replace with your deployed function URL

    async function fetchArticles() {
        try {
            const response = await fetch(fetchUrl);
            const data = await response.json();
            return data.articles || [];
        } catch (error) {
            console.log('Error fetching articles:', error);
            return [];
        }
