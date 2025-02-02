document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastFilter();
});

// Function to populate the category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  // Get unique categories
  const uniqueCategories = [...new Set(quotes.map((q) => q.category))];

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  let filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  filteredQuotes.forEach((quote) => {
    const quoteElement = document.createElement("div");
    quoteElement.innerHTML = `<p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Function to restore the last selected filter on page load
function restoreLastFilter() {
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
  if (lastSelectedCategory) {
    document.getElementById("categoryFilter").value = lastSelectedCategory;
    filterQuotes();
  }
}

// Update categories when adding a new quote
function addQuote() {
  const quoteText = document.getElementById("quoteText").value;
  const quoteCategory = document.getElementById("quoteCategory").value;

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes();
    populateCategories(); // Update dropdown
    filterQuotes(); // Refresh the display
    alert("Quote added successfully!");
  } else {
    alert("Please fill out both fields.");
  }
}
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}
