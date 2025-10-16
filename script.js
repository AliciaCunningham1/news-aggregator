/* script.js
 * News Aggregator Project
 * Uses Singleton, Module, and Observer Patterns
 * Fetches news via a Netlify serverless function
 */

// ---------------- Singleton Pattern: ConfigManager ----------------
const ConfigManager = (function() {
    let instance;

    function createInstance() {
        return {
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
    async function fetchNews() {
        try {
            // Fetch from Netlify function instead of NewsAPI directly
            const response = await fetch('/.netlify/functions/fetchNews');
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

