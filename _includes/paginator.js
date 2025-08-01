const entriesPerPage = {{ site.paginate }};
const entriesPerDir = {{ site.page_max_buttons_per_dir }};
console.log(entriesPerPage, " , ", entriesPerDir);

const content = document.getElementById("contentHolder");
const objectsCount = {{ include.objects.size }};

const objects = [];

{% assign sortedObjects = include.objects | sort: 'date' | reverse %}

{% for object in sortedObjects %}
  {% assign target_link = object[include.target] %}
  {% assign target_link_start = target_link | slice: 0 %}

  {% if target_link_start == "/" %}
    {% assign target_link = site.baseurl | append: object[include.target] %}
  {% endif %}

  {% assign author = object.author %}
  {% if include.posts == true %}
    {% assign author = site.authors | where: "name", author | first %}
    {% assign author = author.display_name %}
  {% endif %}

  objects.push({
    "name": `{{ object.title }}`,
    "image": `{{ object.cover }}`,
    "url": `{{ target_link }}`,
    "author": `{{ author }}`,
    "authorRaw": `{{ object.author }}`,
    "date": `{{ object.date }}`,
    "refIndex": `{{ forloop.index | minus: 1}}`
  });
{% endfor %}
console.log(objects);

const urlParams = new URLSearchParams(window.location.search);
const page = Math.max(Number(urlParams.get('page')), 1) || 1;

const objectsGrid = document.getElementById('articlesContainer');

// Index using Fuse.js
const fuseOptions = {
	// isCaseSensitive: false,
	// includeScore: false,
	// ignoreDiacritics: false,
	// shouldSort: true,
	// includeMatches: false,
	// findAllMatches: true,
	// minMatchCharLength: 1,
	// location: 0,
	// threshold: 0.6,
	// distance: 100,
	// useExtendedSearch: false,
	// ignoreLocation: false,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [
		"name",
		"author",
    "authorRaw",
    "url"
	]
};

const idx = new Fuse(objects, fuseOptions)

// Searchbar
let searchInput = urlParams.get('search') || "";
const form = document.getElementById("search-form");
if (form)
{
  let formField = form.querySelector('input');
  formField.value = searchInput;
  function handleForm(event) {
    event.preventDefault();
    searchObjects(formField.value);
  }
  form.addEventListener('submit', handleForm);
}

searchObjects(searchInput);

function createPostBox(post_information) {
  let aRef = document.createElement('a');
  aRef.href = post_information.url;
  aRef.className = "boxContainer postBox";

  objectsGrid.appendChild(aRef);

  let img = document.createElement('img');
  img.src = post_information.image;
  aRef.appendChild(img);

  let title = document.createElement('h2');
  title.innerHTML = post_information.name;
  title.dir = "auto"
  aRef.appendChild(title);

  let author = document.createElement('p');
  author.innerHTML = post_information.author;
  author.dir = "auto"
  aRef.appendChild(author);

  const date = new Date(post_information.date);

  let dateText = document.createElement('p');
  dateText.className = "followSiblingP"
  dateText.innerHTML = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  aRef.appendChild(dateText);
}

function searchObjects(searchQuery) {
  objectsGrid.textContent = '';

  let results = idx.search(searchQuery);
  console.log("Search Results", results);

  const url = new URL(window.location);

  if (url.pathname.slice(-1) == "/") {
    url.pathname = url.pathname.substring(0, url.pathname.length - 1);
  }

  if (searchQuery.length > 0) {
    url.searchParams.set("search", searchQuery);
  } else {
    results = objects;
    url.searchParams.delete("search");
  }
  history.pushState(null, '', url);

  let pageCountMax = Math.max(Math.ceil(results.length / entriesPerPage), 1);
  let currentPage = Math.max(url.searchParams.get("page") || 1, 1);
  if (currentPage > pageCountMax) {
    moveToPage(pageCountMax);
    return;
  }

  let startIndex = entriesPerPage * (currentPage - 1);
  let endIndex = entriesPerPage * currentPage;

  // Add object boxes
  for (let i = startIndex; i < Math.min(endIndex, results.length); i++)
  {
    createPostBox(objects[results[i].refIndex]);
  }

  // Add navigation
  let pagesHolder = document.getElementById("paginationHolder");
  if (!pagesHolder) {
    pagesHolder = document.createElement('div');
    pagesHolder.className = "pagination";
    pagesHolder.id = "paginationHolder";
    content.appendChild(pagesHolder);
  }
  pagesHolder.textContent = '';

  if (pageCountMax > 1) {
    let pageA;

    // Previous page button
    if (page > 1) {
      pageA = document.createElement('a');
      pageA.href = window.location.href.split('?')[0] + `?page=${page-1}`;
    } else {
      pageA = document.createElement('span');
    }
    pageA.className = "paginationDir";
    pagesHolder.appendChild(pageA);

    pageA.innerHTML = "{{ site.page_text_prev }}"

    // Page number buttons
    var firstPageIndex = page - entriesPerDir;
    var lastPageIndex = page + entriesPerDir;

    if (firstPageIndex < 1)
    {
      firstPageIndex = 1;
      lastPageIndex = Math.min((entriesPerDir * 2) + 1, pageCountMax);
    }
    else if (lastPageIndex > pageCountMax )
    {
      firstPageIndex = Math.max(pageCountMax - (entriesPerDir * 2), 1);
      lastPageIndex = pageCountMax;
    }

    if (firstPageIndex > 1) {
      createPageButton(pagesHolder, 1);
      pageA = document.createElement("span");
      pagesHolder.appendChild(pageA);
      pageA.innerHTML = "...";
    }

    for (let index = firstPageIndex; index <= lastPageIndex; index++) {
      if (index == page) {
        pageA = document.createElement("span");
        pageA.className = "activePage";
        pagesHolder.appendChild(pageA);
        pageA.innerHTML = `${index}`;
      }
      else {
        createPageButton(pagesHolder, index);
      }
    }

    if (lastPageIndex < pageCountMax) {
      pageA = document.createElement("span");
      pagesHolder.appendChild(pageA);
      pageA.innerHTML = "...";

      createPageButton(pagesHolder, pageCountMax);
    }

    // Next page button
    if (page < pageCountMax) {
      pageA = document.createElement('a');
      pageA.onclick = (event) => {
        moveToPage(page+1)
      }
      // pageA.href = window.location.href.split('?')[0] + `?page=${page+1}`;
    } else {
      pageA = document.createElement('span');
    }
    pageA.className = "paginationDir";
    pagesHolder.appendChild(pageA);

    pageA.innerHTML = "{{ site.page_text_next }}"
  }
}

function createPageButton(pagesHolder, pageIndex) {
  pageA = document.createElement("a");
  pageA.className = "paginationButton";
  pageA.onclick = (event) => {
    event.preventDefault();
    moveToPage(pageIndex);
  }
  pageA.href = window.location.href.split('?')[0] + `?page=${pageIndex}`;
  pagesHolder.appendChild(pageA);
  pageA.innerHTML = `${pageIndex}`;
}


function moveToPage(pageIndex) {
  const url = new URL(window.location);
  if (url.pathname.slice(-1) == "/") {
    url.pathname = url.pathname.substring(0, url.pathname.length - 1);
  }

  url.searchParams.set("page", pageIndex);
  window.location = url.toString();
}