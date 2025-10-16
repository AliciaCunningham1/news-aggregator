/*
 * JavaScript Boilerplate for News Aggregator Project
 *
 * This JavaScript file is part of the Web APIs assignment.
 * Your task is to complete the functions with appropriate module pattern, observer pattern, singleton pattern.
 *
 * Follow the TODO prompts and complete each section to ensure the
 * News Aggregator App works as expected.
 */

// =======================
// Singleton Pattern: ConfigManager
// =======================
const ConfigManager = (function() {
    let instance;

    function createInstance() {
        return {
            theme: 'dark',
            apiUrl: 'https://newsapi.org/v2/top-headlines',
            apiKey: 'e0a72113ba364e46883d653ca5d5ac58' // Your NewsAPI key
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

// =======================
// Module Pattern: NewsFetcher
// =======================
const NewsFetcher = (function() {
    const config = ConfigManager.getInstance();

    async function fetchArticles() {
        const url = `${config.apiUrl}?country=us&apiKey=${config.apiKey}`;
        try {
            console.log('Fetching articles from:', url);
            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Data received:', data);
            return data.articles || [];
        } catch (error) {
            console.error('Error fetching articles:', error);
            return [];
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
