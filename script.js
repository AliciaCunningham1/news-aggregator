/*
 * JavaScript Boilerplate for News Aggregator Project
 *
 * Uses Singleton, Module, and Observer patterns.
 * Fetches articles via a serverless function to avoid exposing the API key.
 */

// =======================
// Singleton Pattern: ConfigManager
// =======================
const ConfigManager = (function() {
    let instance;

    function createInstance() {
        return {
            theme: 'dark',
            // This URL should point to your Netlify function proxy
            apiProxyUrl: 'https://your-netlify-site.netlify.app/.netlify/functions/fetchNews'
        };
    }

    function getInstance() {
        if (!instance) instance = createInstance();
        return instance;
    }

    return {
        getInstance
    };
})();

// =======================
// Module Pattern: NewsFetcher
// =======================
const NewsFetcher = (function() {
    const config = ConfigManager.getInstance();

    async function fetchArticles() {
        try {
            console.log('Fetching articles from proxy:', config.apiProxyUrl);
            const response = await fetch(config.apiProxyUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Data received:', data);

            // Return articles or fallback
            return data.articles || fallbackArticles;
        } catch (error) {
            console.error('Error fetching articles:', error);
            return fallbackArticles; // fallback if fetch fails
        }
    }

    return {
        getArticles: fetchArticles
    };
})();

// =======================
// Observer Pattern: NewsFeed
// =======================
function NewsFeed() {
    this.observers = [];
    this.articles = [];
}

NewsFeed.prototype = {
    subscribe: function(observerFn) {
        this.observers.push(observerFn);
    },
    unsubscribe: function(observerFn) {
        this.observers = this.observers.filter(fn => fn !== observerFn);
    },
    notify: function(article) {
        this.observers.forEach(fn => fn(article));
    },
    addArticle: function(article) {
        this.articles.push(article);
        this.notify(article);
    }
};

// =======================
// Instantiate NewsFeed
// =======================
const newsFeed = new NewsFeed();

// =======================
// Observer 1: Update Headline
// =======================
function updateHeadline(article) {
    const headlineElement = document.getElementById('headline');
    if (headlineElement) {
        headlineElement.innerHTML = `<p>${article.title}</p>`;
    }
}

// =======================
// Observer 2: Update Article List
// =======================
function updateArticleList(article) {
    const articleListElement = document.getElementById('articles');
    if (articleListElement) {
        const listItem = document.createElement('li');
        listItem.textContent = article.title;
        articleListElement.appendChild(listItem);
    }
}

// =======================
// Subscribe Observers
// =======================
newsFeed.subscribe(updateHeadline);
newsFeed.subscribe(updateArticleList);

// =======================
// Fallback articles (if API fails)
// =======================
const fallbackArticles = [
    { title: "Fallback Article 1" },
    { title: "Fallback Article 2" },
    { title: "Fallback Article 3" }
];

// =======================
// Fetch and display articles
// =======================
(async function loadNews() {
    const articles = await NewsFetcher.getArticles();
    articles.forEach(article => newsFeed.addArticle(article));
})();

// =======================
// Display Config Info
// =======================
const configInfo = ConfigManager.getInstance();
const configElement = document.getElementById('configInfo');
if (configElement) {
    configElement.textContent = `Theme: ${configInfo.theme}`;
}
