/* script.js
 * News Aggregator Project
 * Uses Singleton, Module, and Observer Patterns
 * Works on GitHub Pages via CORS proxy
 */

// ---------------- Singleton Pattern: ConfigManager ----------------
const ConfigManager = (function() {
    let instance;

    function createInstance() {
        return {
            apiKey: 'b83f9c3dec6f5b8ec2379cc1a188ecde', // Your GNews API key
            apiUrl: 'https://gnews.io/api/v4/top-headlines?country=us&topic=technology&max=5&token='
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
            // Wrap the API URL with the CORS proxy
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(config.apiUrl + config.apiKey)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error('Network response was not ok');

            const dataText = await response.json();
            const data = JSON.parse(dataText.contents); // AllOrigins returns JSON in `contents`

            NewsObserver.notify(data.articles);
        } catch (error) {
            console.error('Fetching news failed:', error);
            const headlineContainer = document.getElementById('headline');
            if (headlineContainer) {
                const p = headlineContainer.querySelector('p');
                if (p) p.textContent = 'Failed to load news.';
            }
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
function displayHeadline(articles) {
    const headlineContainer = document.getElementById('headline');
    if (!headlineContainer) return;

    const headlineText = articles.length > 0 ? articles[0].title : 'No articles yet...';
    const p = headlineContainer.querySelector('p');
    if (p) {
        p.textContent = headlineText;
    }
}

function displayArticles(articles) {
    const articleList = document.getElementById('articles');
    if (!articleList) return;

    articleList.innerHTML = ''; // Clear previous articles
    if (articles.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No articles available.';
        articleList.appendChild(li);
        return;
    }

    articles.forEach(article => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${article.title}</strong><br>
            ${article.description || ''} <br>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        articleList.appendChild(li);
    });
}

// ---------------- Subscribe DOM functions to NewsObserver ----------------
NewsObserver.subscribe(displayHeadline);
NewsObserver.subscribe(displayArticles);

// ---------------- Initialize ----------------
document.addEventListener('DOMContentLoaded', () => {
    NewsFetcher.fetchNews();
});

