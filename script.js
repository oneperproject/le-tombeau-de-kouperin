
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("data/index.json");
    const items = await response.json();

    const searchInput = document.getElementById("searchInput");
    const cardsContainer = document.getElementById("cardsContainer");
    const yearDisplay = document.getElementById("yearDisplay");

    function renderCards(filteredItems) {
        cardsContainer.innerHTML = "";
        filteredItems.forEach(item => {
            const card = document.createElement("div");
            card.className = "card";

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
                tagButton.addEventListener("click", () => {
                    searchInput.value = `#${tag}`;
                    performSearch();
                });
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
        const query = searchInput.value.toLowerCase();
        let filteredItems = items;

        if (query) {
            filteredItems = items.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.summary.toLowerCase().includes(query) ||
                item.tags.some(tag => `#${tag}`.toLowerCase().includes(query))
            );
        }

        renderCards(filteredItems);
    }

    searchInput.addEventListener("input", performSearch);
    performSearch(); // 初回実行
});
