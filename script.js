// =======================
// Singleton Pattern: ConfigManager
// =======================
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

// =======================
// Module Pattern: NewsFetcher
// =======================
const NewsFetcher = (function() {
    // Replace this URL with your deployed Netlify function URL or API endpoint
    const apiKey = 'e0a72113ba364e46883d653ca5d5ac58';
    const fetchUrl = `https://your-netlify-site.netlify.app/.netlify/functions/fetchNews?apiKey=${apiKey}`;

    async function fetchArticles() {
        try {
            const response = await fetch(fetchUrl);
            const data = await response.json();
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
        headlineElement.innerHTML = `
            <h2>Latest Headline</h2>
            <p>${article.title}</p>
        `;
    }
}

// =======================
// Observer 2: Update Article List
// =======================
function updateArticleList(article) {
    const listElement = document.getElementById('articles');
    if (listElement) {
        const listItem = document.createElement('li');
        listItem.textContent = article.title;
        listElement.appendChild(listItem);
    }
}

// =======================
// Subscribe observers
// =======================
newsFeed.subscribe(updateHeadline);
newsFeed.subscribe(updateArticleList);

// =======================
// Fetch and add articles
// =======================
(async function loadNews() {
    const articles = await NewsFetcher.getArticles();
    articles.forEach(article => newsFeed.addArticle(article));
})();
