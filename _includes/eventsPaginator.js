const entriesPerPage = {{ site.paginate }};
const entriesPerDir = {{ site.page_max_buttons_per_dir }};
console.log(entriesPerPage, " , ", entriesPerDir);

const content = document.getElementById("contentHolder");
const eventsCount = {{ site.events.size }};

const events = [];
{% assign sortedEvents = site.events | sort: 'date' | reverse %}
{% for event in sortedEvents %}
events.push([
  `{{ event.title }}`,
  `{{ event.cover }}`,
  `{{ event.url }}`,
  `{{ event.author }}`,
  `{{ event.date }}`
]);
{% endfor %}

const pageCountMax = Math.ceil(eventsCount / entriesPerPage);

const urlParams = new URLSearchParams(window.location.search);
const page = Math.min(Math.max(Number(urlParams.get('page')), 1) || 1, pageCountMax);

const firstEntry = (entriesPerPage * (page - 1));
const lastEntry = Math.min(entriesPerPage * page, eventsCount);

const eventsGrid = document.getElementById('articlesContainer');

// Add event boxes
for (let index = firstEntry; index < lastEntry; index++) {
  const event = events[index];

  var aRef = document.createElement('a');
  aRef.href = `{{ site.baseurl }}` + event[2];
  aRef.className = "boxContainer postBox";

  eventsGrid.appendChild(aRef);

  var img = document.createElement('img');
  img.src = event[1];
  aRef.appendChild(img);

  var title = document.createElement('h2');
  title.innerHTML = event[0];
  title.dir = "auto"
  aRef.appendChild(title);

  var author = document.createElement('p');
  author.innerHTML = event[3];
  author.dir = "auto"
  aRef.appendChild(author);

  const date = new Date(event[4]);
  console.log(date.toDateString());

  var dateText = document.createElement('p');
  dateText.className = "followSiblingP"
  dateText.innerHTML = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  aRef.appendChild(dateText);
}

// Add navigation
if (pageCountMax > 1) {
  var div = document.createElement('div');
  div.className = "pagination";
  content.appendChild(div);

  let pageA;

  // Previous page button
  if (page > 1) {
    pageA = document.createElement('a');
    pageA.href = window.location.href.split('?')[0] + `?page=${page-1}`;
  } else {
    pageA = document.createElement('span');
  }
  pageA.className = "paginationDir";
  div.appendChild(pageA);

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
    pageA = document.createElement("a");
    pageA.className = "paginationButton";
    pageA.href = window.location.href.split('?')[0] + `?page=${1}`;
    div.appendChild(pageA);
    pageA.innerHTML = `${1}`;

    pageA = document.createElement("span");
    div.appendChild(pageA);
    pageA.innerHTML = "...";
  }

  for (let index = firstPageIndex; index <= lastPageIndex; index++) {
    if (index == page) {
      pageA = document.createElement("span");
      pageA.className = "activePage";
    }
    else {
      pageA = document.createElement("a");
      pageA.className = "paginationButton";
      pageA.href = window.location.href.split('?')[0] + `?page=${index}`;
    }
    div.appendChild(pageA);
    pageA.innerHTML = `${index}`;
  }

  if (lastPageIndex < pageCountMax) {
    pageA = document.createElement("span");
    div.appendChild(pageA);
    pageA.innerHTML = "...";

    pageA = document.createElement("a");
    pageA.className = "paginationButton";
    pageA.href = window.location.href.split('?')[0] + `?page=${pageCountMax}`;
    div.appendChild(pageA);
    pageA.innerHTML = `${pageCountMax}`;
  }

  // Next page button
  if (page < pageCountMax) {
    pageA = document.createElement('a');
    pageA.href = window.location.href.split('?')[0] + `?page=${page+1}`;
  } else {
    pageA = document.createElement('span');
  }
  pageA.className = "paginationDir";
  div.appendChild(pageA);

  pageA.innerHTML = "{{ site.page_text_next }}"
}
