const entriesPerPage = {{ site.paginate }};
const entriesPerDir = {{ site.page_max_buttons_per_dir }};
console.log(entriesPerPage, " , ", entriesPerDir);

const content = document.getElementById("contentHolder");
const mentionsCount = {{ site.mentions.size }};

const mentions = [];
{% assign sortedMentions = site.mentions | sort: 'date' | reverse %}
{% for mention in sortedMentions %}
mentions.push([
  `{{ mention.title }}`,
  `{{ mention.cover }}`,
  `{{ mention.link }}`,
  `{{ mention.author }}`,
  `{{ mention.date }}`
]);
{% endfor %}

const pageCountMax = Math.ceil(mentionsCount / entriesPerPage);

const urlParams = new URLSearchParams(window.location.search);
const page = Math.min(Math.max(Number(urlParams.get('page')), 1) || 1, pageCountMax);

const firstEntry = (entriesPerPage * (page - 1));
const lastEntry = Math.min(entriesPerPage * page, mentionsCount);

const mentionsGrid = document.getElementById('articlesContainer');

// Add mention boxes
for (let index = firstEntry; index < lastEntry; index++) {
  const mention = mentions[index];

  var aRef = document.createElement('a');
  aRef.href = mention[2];
  aRef.className = "boxContainer postBox";

  mentionsGrid.appendChild(aRef);

  var img = document.createElement('img');
  img.src = mention[1];
  aRef.appendChild(img);

  var title = document.createElement('h2');
  title.style = "flex-grow: 2;";
  title.innerHTML = mention[0];
  title.dir = "auto"
  aRef.appendChild(title);

  var author = document.createElement('p');
  author.innerHTML = mention[3];
  author.dir = "auto"
  aRef.appendChild(author);

  const date = new Date(mention[4]);
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

  //<a class="paginationDir" href="{{ paginator.previous_page_path | absolute_url }}">{{ prev_text }}</a>

}

/*
{% comment %}
{% if paginator.total_pages > 1 %}
  <div class="pagination">
    {% assign prev_text = "<" %}
    {% assign next_text = ">" %}

    {% if paginator.previous_page %}
      <a class="paginationDir" href="{{ paginator.previous_page_path | absolute_url }}">{{ prev_text }}</a>
    {% else %}
      <span class="paginationDir">{{ prev_text }}</span>
    {% endif %}

    {% assign first_page_index = paginator.page | minus: 2 %}
    {% assign last_page_index = paginator.page | plus: 2 %}

    {% if first_page_index < 1 %}
      {% assign first_page_index = 1 %}
      {% assign last_page_index = 5 | at_most: paginator.total_pages %}
    {% elsif last_page_index > paginator.total_pages %}
      {% assign first_page_index = paginator.total_pages | minus: 4 | at_least: 1 %}
      {% assign last_page_index = paginator.total_pages %}
    {% endif %}

    {% if first_page_index > 1 %}
      <a class="paginationButton" href="{{ site.paginate_path | absolute_url |  replace: ':num/', '' }}">{{ 1 }}</a>
      <span>...</span>
    {% endif %}

    {% for page in (first_page_index..last_page_index) %}
      {% if page == paginator.page %}
        <span class="activePage">{{ page }}</span>
      {% elsif page == 1 %}
        <a class="paginationButton" href="{{ site.paginate_path | absolute_url |  replace: ':num/', '' }}">{{ page }}</a>
      {% else %}
        <a class="paginationButton" href="{{ site.paginate_path | absolute_url | replace: ':num', page }}">{{ page }}</a>
      {% endif %}
    {% endfor %}

    {% if last_page_index < paginator.total_pages %}
      <span>...</span>
      <a class="paginationButton" href="{{ site.paginate_path | absolute_url |  replace: ':num/', paginator.total_pages }}">{{ paginator.total_pages }}</a>
    {% endif %}

    {% if paginator.next_page %}
      <a class="paginationDir" href="{{ paginator.next_page_path | absolute_url }}">{{ next_text }}</a>
    {% else %}
      <span class="paginationDir">{{ next_text }}</span>
    {% endif %}
  </div>
{% endif %}
{% endcomment %}
*/