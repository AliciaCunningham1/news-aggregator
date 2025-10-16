/* script.js
 * News Aggregator Project
 * Uses Singleton, Module, and Observer Patterns
 */

// ---------------- Singleton Pattern: ConfigManager ----------------
const ConfigManager = (function() {
    let instance;

    function createInstance() {
        return {
            apiKey: 'YOUR_API_KEY_HERE', // Replace with your API key
            apiUrl: 'https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=5&apiKey=',
            theme: 'light'
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// ---------------- Module Pattern: NewsFetcher ----------------
const NewsFetcher = (function() {
    const config = ConfigManager.getInstance();

    async function fetchNews() {
        try {
            const response = await fetch(`${config.apiUrl}${config.apiKey}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            NewsObserver.notify(data.articles);
        } catch (error) {
            console.error('Fetching news failed:', error);
        }
    }

    return {
        fetchNews
    };
})();

// ---------------- Observer Pattern: NewsObserver ----------------
const NewsObserver = (function() {
    let observers = [];

    function subscribe(fn) {
        observers.push(fn);
    }

    function unsubscribe(fn) {
        observers = observers.filter(sub => sub !== fn);
    }

    function notify(data) {
        observers.forEach(fn => fn(data));
    }

    return {
        subscribe,
        unsubscribe,
        notify
    };
})();

// ---------------- DOM Manipulation Functions ----------------
function displayHeadlines(articles) {
    const headlineContainer = document.getElementById('headlines');
    headlineContainer.innerHTML = ''; // Clear previous headlines
    articles.forEach(article => {
        const li = document.createElement('li');
        li.textContent = article.title;
        headlineContainer.appendChild(li);
    });
}

function displayArticles(articles) {
    const articleContainer = document.getElementById('articles');
    articleContainer.innerHTML = ''; // Clear previous articles
    articles.forEach(article => {
        const div = document.createElement('div');
        div.className = 'article';
        div.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || ''}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        articleContainer.appendChild(div);
    });
}

// ---------------- Subscribe DOM functions to NewsObserver ----------------
NewsObserver.subscribe(displayHeadlines);
NewsObserver.subscribe(displayArticles);

// ---------------- Initialize ----------------
document.addEventListener('DOMContentLoaded', () => {
    NewsFetcher.fetchNews();
});

