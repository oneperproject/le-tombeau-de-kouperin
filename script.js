
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("data/index.json");
    const items = await response.json();

    const searchInput = document.getElementById("searchInput");
    const cardsContainer = document.getElementById("cardsContainer");
    const yearDisplay = document.getElementById("yearDisplay");

    let selectedTag = null;
    let selectedYear = null;
    let currentKeyword = "";

    function renderCards(filteredItems) {
        cardsContainer.innerHTML = "";
        filteredItems.forEach(item => {
            const card = document.createElement("div");
            card.className = "card";
            card.dataset.year = item.timestamp?.split('-')[0];

            const date = document.createElement("div");
            date.className = "date";
            date.textContent = item.timestamp;

            const title = document.createElement("div");
            title.className = "title";
            title.textContent = item.title;

            const description = document.createElement("div");
            description.className = "description";
            description.textContent = item.summary;

            const tags = document.createElement("div");
            tags.className = "tags";
            item.tags.forEach(tag => {
                const tagButton = document.createElement("button");
                tagButton.textContent = `#${tag}`;
                tagButton.className = "tag-button";
                tagButton.dataset.tag = tag;

                tagButton.addEventListener("click", () => {
                    const wasActive = selectedTag === tag;
                    selectedTag = wasActive ? null : tag;

                    const cardYear = card.dataset.year;

                    if (!wasActive) {
                        selectedYear = null;
                    } else {
                        selectedYear = cardYear;
                    }

                    currentKeyword = "";
                    searchInput.value = "";
                    updateYearNav();
                    performSearch();  // 再描画
                });

                if (selectedTag === tag) {
                    tagButton.classList.add("active");
                }

                tags.appendChild(tagButton);
            });

            card.appendChild(date);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(tags);

            cardsContainer.appendChild(card);
        });

        let currentYear;
        if (filteredItems.length > 0) {
            const years = filteredItems
                .map(item => item.timestamp?.split('-')[0])
                .filter(Boolean);
            currentYear = years.length > 0 ? Math.max(...years.map(y => parseInt(y))) : null;
        } else {
            currentYear = null;
        }

        yearDisplay.textContent = currentYear ? `${currentYear}` : "";
    }

    function performSearch() {
        let filteredItems = items;

        if (selectedTag) {
            filteredItems = filteredItems.filter(item => item.tags.includes(selectedTag));
        } else if (currentKeyword) {
            const query = currentKeyword.toLowerCase();
            filteredItems = items.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.summary.toLowerCase().includes(query) ||
                item.tags.some(tag => `#${tag}`.toLowerCase().includes(query))
            );
        }

        if (selectedYear) {
            filteredItems = filteredItems.filter(item =>
                item.timestamp && item.timestamp.startsWith(selectedYear)
            );
        }

        renderCards(filteredItems);
    }

    function updateYearNav() {
        // 年表示更新用：現在は省略
    }

    searchInput.addEventListener("input", () => {
        currentKeyword = searchInput.value;
        selectedTag = null;
        selectedYear = null;
        performSearch();
    });

    performSearch(); // 初回実行
});
