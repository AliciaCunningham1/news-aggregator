const ConfigManager = (function() {
    let instance;

    function createInstance() {
        return {
            theme: 'dark',
            apiUrl: 'https://newsapi.org/v2/top-headlines',
            apiKey: 'e0a72113ba364e46883d653ca5d5ac58'
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

const NewsFetcher = (function () {
    const config = ConfigManager.getInstance();

    async function fetchArticles() {
        try {
            const response = await fetch(`${config.apiUrl}?country=us&apiKey=${config.apiKey}`);
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

const newsFeed = new NewsFeed();

function updateHeadline(article) {
    const headlineElement = document.getElementById('headline')?.querySelector('p');
    if (headlineElement) headlineElement.textContent = article.title;
}

function updateArticleList(article) {
    const articleListElement = document.getElementById('articles');
    if (articleListElement) {
        const listItem = document.createElement('li');
        listItem.textContent = article.title;
        articleListElement.appendChild(listItem);
    }
}

newsFeed.subscribe(updateHeadline);
newsFeed.subscribe(updateArticleList);

NewsFetcher.getArticles().then(articles => {
    articles.forEach(article => newsFeed.addArticle(article));
});

const configInfo = document.getElementById('configInfo');
if (configInfo) configInfo.textContent = `Theme: ${ConfigManager.getInstance().theme}`;

