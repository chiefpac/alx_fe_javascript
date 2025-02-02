document.addEventListener("DOMContentLoaded", () => {
  loadQuotes(); // Load quotes from localStorage
  populateCategories(); // Populate the category dropdown
  restoreLastFilter(); // Restore the last selected filter
  filterQuotes(); // Display quotes based on the selected filter

  // Add event listener for the "Show New Quote" button
  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);

  // Add event listener for the "Export Quotes" button
  document
    .getElementById("exportButton")
    .addEventListener("click", exportToJsonFile);

  // Dynamically create the "Add Quote" form
  createAddQuoteForm();
});

// Array to store quotes (loaded from localStorage)
let quotes = [];

// Function to load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate the category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`; // Reset dropdown

  // Get unique categories from quotes
  const uniqueCategories = [...new Set(quotes.map((q) => q.category))];

  // Add each unique category to the dropdown
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
  localStorage.setItem("lastSelectedCategory", selectedCategory); // Save the selected category

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
    filterQuotes(); // Apply the last selected filter
  }
}

// Function to show a random quote
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    alert("No quotes available for this category.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length); // Use Math.random
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>"${filteredQuotes[randomIndex].text}"</p><p><em>- ${filteredQuotes[randomIndex].category}</em></p>`;
}

// Function to dynamically create the "Add Quote" form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = `
    <div>
      <input id="quoteText" type="text" placeholder="Enter a new quote" />
      <input id="quoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    </div>
  `;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("quoteText").value.trim();
  const quoteCategory = document.getElementById("quoteCategory").value.trim();

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

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes = quotes.concat(importedQuotes); // Merge imported quotes with existing quotes
    saveQuotes();
    populateCategories(); // Update dropdown
    filterQuotes(); // Refresh the display
    alert("Quotes imported successfully!");
  };
  reader.readAsText(file);
}
