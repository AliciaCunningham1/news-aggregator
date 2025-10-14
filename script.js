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
    const fetchUrl = 'https://your-site.netlify.app/.netlify/functions/fetchNews'; // replace with your function URL

    async function fetchArticles() {
        try {
            const response = await fetch(fetchUrl);
            const data = await response.json();
            return data.articles || [];
        } catch (error) {
            console.log('Error fetching articles:', error);
            return [];
        }
    }

    return {
        getArticles: fetchArticles
    };
})();

// Observer Pattern: NewsFeed
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

// Instantiate the NewsFeed
const newsFeed = new NewsFeed();

// Observer 1: Update Headline
function updateHeadline(article) {
    const headlineElement = document.getElementById('headline')?.querySelector('p');
    if (headlineElement) headlineElement.textContent = article.title;
}

// Observer 2: Update Article List
function updateArticleList(article) {
    const articleListElement = document.getElementById('articles');
    if (articleListElement) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = article.url;
        link.target = '_blank';
        link.textContent = article.title;
        listItem.appendChild(link);
        articleListElement.appendChild(listItem);
    }
}

// Subscribe Observers
newsFeed.subscribe(updateHeadline);
newsFeed.subscribe(updateArticleList);

// Fetch and display articles
NewsFetcher.getArticles().then(articles => {
    articles.forEach(article => newsFeed.addArticle(article));
});

// Display Config Info
const configInfo = document.getElementById('configInfo');
if (configInfo) configInfo.textContent = `Theme: ${ConfigManager.getInstance().theme}`;

