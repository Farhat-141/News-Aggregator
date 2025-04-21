/*async function test(){
    var url = 'https://newsapi.org/v2/everything?q=bitcoin&apiKey=2922ffbd98d747f1a141a8a38d2675e4';
    var req = new Request(url);
    fetch(req)
        .then(async function(response) {
            const data = await response.json();
            display(data);
        })
}*/

var API_KEY = '2922ffbd98d747f1a141a8a38d2675e4';
var BASE_URL = 'https://newsapi.org/v2/top-headlines?country=us';
    
async function fetchNews(catergory){
    try{
        document.getElementById("loadingMessage").style.display = "block"; // Show loading
        document.getElementById("news_section").style.opacity = "0.5";
        const response = await fetch(`${BASE_URL}&category=${catergory}&apiKey=${API_KEY}`);
        const data = await response.json();
        console.log(data);
        display(data); 
    }
    catch(error){
        console.log(`Error: ${error}`);
    }

}

function display(obj){
    const articles = obj.articles;
    document.getElementById('news_section').innerHTML = '';

    articles.forEach(element => {
        var news = `
        <article>
            <div class="img">
            <img src=${element.urlToImage} alt="news_image"> 
            </div>
            <h3>${element.title}</h3>
            <p>${element.description}</p>  
            <a href="${element.url}" target="_blank">Read more</a> 
        </article>
        `    
        document.getElementById('news_section').innerHTML += news;
        document.getElementById("news_section").style.opacity = "1";
        document.getElementById("loadingMessage").style.display = "none"; // Show loading

    });
}

document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchNews();
    }
});

function clearSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("searchInput").focus();
    clear();
}

async function searchNews() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    document.getElementById("loadingMessage").style.display = "block"; // Show loading

    const SEARCH_URL = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(SEARCH_URL);
        const data = await response.json();

        document.getElementById("loadingMessage").style.display = "none"; // Hide loading

        if (data.status === "ok" && data.articles.length > 0) {
            display(data);
        } else {
            document.getElementById("news_section").innerHTML = `<p style="text-align:center;">No results found for "${query}".</p>`;
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        document.getElementById("loadingMessage").style.display = "none"; // Hide loading
    }
}

// Check if browser supports speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false; 
recognition.lang = "en-US"; 
recognition.interimResults = false;

document.getElementById("micBtn").addEventListener("click", function () {
    recognition.start();
    this.classList.add("active");
});

recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("searchInput").value = transcript;
    searchNews(); // Automatically search
};

recognition.onend = function () {
    document.getElementById("micBtn").classList.remove("active");
};

let debounceTimer;

document.getElementById("searchInput").addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchNews();
    }, 500); // Waits 500ms after last keystroke
});

function clear(){
    fetchNews('general');
    document.getElementById("searchInput").addEventListener("emptied",()=>{
        fetchNews('general');
    })
}

