
document.addEventListener("DOMContentLoaded", () => {
  const tagContainer = document.getElementById("tag-filter");
  const yearDisplay = document.getElementById("current-year");
  const cardContainer = document.getElementById("card-container");

  let selectedTag = null;
  let allCards = [];

  // サンプルデータ（実際はJSONから読み込まれる）
  const data = [
    { title: "記事A", year: 2023, tags: ["教育", "AI"] },
    { title: "記事B", year: 2024, tags: ["政治", "倫理"] },
    { title: "記事C", year: 2025, tags: ["教育"] },
  ];

  const allTags = Array.from(new Set(data.flatMap(d => d.tags)));
  let currentYear = Math.max(...data.map(d => d.year));

  function renderTags() {
    tagContainer.innerHTML = "";
    allTags.forEach(tag => {
      const btn = document.createElement("button");
      btn.textContent = tag;
      btn.className = "entry-tag";
      btn.dataset.tag = tag;
      btn.addEventListener("click", () => handleTagClick(tag));
      tagContainer.appendChild(btn);
    });
  }

  function renderCards() {
    cardContainer.innerHTML = "";
    const filtered = selectedTag
      ? data.filter(d => d.tags.includes(selectedTag))
      : data;

    const sorted = filtered.filter(d => d.year === currentYear);
    sorted.forEach(entry => {
      const div = document.createElement("div");
      div.className = "card";
      div.dataset.year = entry.year;
      div.innerHTML = `<h3>${entry.title}</h3><p>${entry.tags.join(", ")}</p>`;
      cardContainer.appendChild(div);
    });

    yearDisplay.textContent = currentYear;
  }

  function handleTagClick(tag) {
    if (selectedTag === tag) {
      selectedTag = null;
      currentYear = Math.max(...data.map(d => d.year));
    } else {
      selectedTag = tag;
      const taggedCards = data.filter(d => d.tags.includes(tag));
      currentYear = taggedCards.length > 0
        ? Math.min(...taggedCards.map(d => d.year))
        : currentYear;
    }
    renderCards();
    updateTagStyles();
  }

  function updateTagStyles() {
    document.querySelectorAll(".entry-tag").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tag === selectedTag);
    });
  }

  document.getElementById("prev-year").addEventListener("click", () => {
    currentYear = Math.max(...data.map(d => d.year).filter(y => y < currentYear));
    renderCards();
  });

  document.getElementById("next-year").addEventListener("click", () => {
    currentYear = Math.min(...data.map(d => d.year).filter(y => y > currentYear));
    renderCards();
  });

  renderTags();
  renderCards();
});
