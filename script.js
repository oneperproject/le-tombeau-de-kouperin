
let indexData = [];
let selectedYear = null;
let selectedTag = null;
let currentKeyword = "";

async function fetchIndex() {
  const response = await fetch("index.json");
  indexData = await response.json();
}

function render() {
  const container = document.getElementById("entryContainer");
  container.innerHTML = "";

  const filteredData = indexData.filter(entry => {
    const matchYear = selectedYear ? entry.timestamp.startsWith(selectedYear) : true;
    const matchTag = selectedTag ? entry.tags.includes(selectedTag) : true;
    const matchKeyword = currentKeyword
      ? entry.summary.includes(currentKeyword) || entry.tags.some(tag => tag.includes(currentKeyword))
      : true;
    return matchYear && matchTag && matchKeyword;
  });

  filteredData.forEach(entry => {
    const div = document.createElement("div");
    div.className = "entry-card";
    div.innerHTML = `
      <h3>${entry.title}</h3>
      <p class="timestamp">${entry.timestamp}</p>
      <p>${entry.summary}</p>
      <div class="entry-tags">${entry.tags.map(tag => `<span class="entry-tag" data-tag="${tag}">${tag}</span>`).join("")}</div>
      <a href="${entry.path}" class="entry-link">読む</a>
    `;

    div.querySelectorAll(".entry-tag").forEach(tagEl => {
      tagEl.addEventListener("click", () => {
        const tag = tagEl.dataset.tag;
        const wasSelected = selectedTag === tag;
        selectedTag = wasSelected ? null : tag;

        if (wasSelected) {
          const entryYear = entry.timestamp.slice(0, 4);
          selectedYear = entryYear;
        } else {
          selectedYear = null;
        }

        currentKeyword = "";
        document.getElementById("searchInput").value = "";
        render();
      });
    });

    container.appendChild(div);
  });

  // 年代ナビの強調更新
  document.querySelectorAll(".year-link").forEach(link => {
    if (link.dataset.year === selectedYear) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  const button = document.getElementById("searchButton");
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      currentKeyword = input.value.trim();
      selectedTag = null;
      selectedYear = null;
      render();
    }
  });
  button.addEventListener("click", () => {
    currentKeyword = input.value.trim();
    selectedTag = null;
    selectedYear = null;
    render();
  });
}

function setupYearLinks() {
  document.querySelectorAll(".year-link").forEach(link => {
    link.addEventListener("click", () => {
      selectedYear = link.dataset.year;
      selectedTag = null;
      currentKeyword = "";
      document.getElementById("searchInput").value = "";
      render();
    });
  });
}

window.onload = async () => {
  await fetchIndex();
  setupSearch();
  setupYearLinks();
  render();
};
