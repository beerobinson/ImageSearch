import environment from "./settings.js";

const accessKey = environment.UNSPLASH_API_TOKEN;

const formEl = document.querySelector("form");
const inputEl = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
const showMore = document.getElementById("show-more-button");
const header = document.querySelector("h1")

let inputData = "";
let page = 1;
// * searching false until hit search button, will use editorial feed pics.
let searching = false;

async function fetchImages() {
  inputData = inputEl.value;

  // * if you're searching something, use search url. On page load, use editorial feed url.
  const url = searching
    ? `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`
    : `https://api.unsplash.com/photos?page=${page}&client_id=${accessKey}`;

  const response = await fetch(url);
  const data = await response.json();

  // * response is diff between editiorial url and search url (search has what you need in data.results)
  const results = searching ? data.results : data;

  if(page===1){
    searchResults.innerHTML = "";
    
}

  results?.map((result) => {
    // * Create wrapper for each image
    const imageWrapper = document.createElement("div");

    // * add class that can let us add image to search results
    imageWrapper.classList.add("search-result");

    // * create image with results from unsplash and give it a description, link
    const image = document.createElement("img");
    image.src = result.urls.small;
    image.alt = result.alt_description;
    const imageLink = document.createElement("a");
    imageLink.href = result.links.html;
    imageLink.target = "_blank";
    imageLink.textContent = result.alt_description;

    // * add image to wrapper, add wrapper to search results
    imageWrapper.appendChild(image);
    imageWrapper.appendChild(imageLink);
    searchResults.appendChild(imageWrapper);
  });

  // * setting page up 1 after search
  page++;

}

// * fetch images from editorial feed when window loads
addEventListener("load", (event) => {
  event.preventDefault();
  page = 1;
  fetchImages();
});

// * have page listen for search submit, set page to 1 to have user see first results
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searching = true;
  fetchImages();
});

header.addEventListener("click", (event) => {
    event.preventDefault();
    page = 1;
    searching = false;
    inputEl.value = ''
    fetchImages();
  });

// * have page listen for click on show more button, trigger image fetch
showMore.addEventListener("click", () => {
  fetchImages();
});
