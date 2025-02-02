document.addEventListener("DOMContentLoaded", function () {
  loadQuotes();

  // Quote Display Section
  const quoteDisplay = document.createElement("div");
  quoteDisplay.id = "quoteDisplay";
  document.body.appendChild(quoteDisplay);

  // Show Random Quote Button
  const newQuoteButton = document.createElement("button");
  newQuoteButton.id = "newQuote";
  newQuoteButton.textContent = "Show Random Quote";
  newQuoteButton.addEventListener("click", showRandomQuote);
  document.body.appendChild(newQuoteButton);

  // Create Add Quote Form
  createAddQuoteForm();

  // Create Import & Export Controls
  createJsonControls();

  // Show last viewed quote from session storage
  showLastViewedQuote();
});

// Array of Quotes (Load from Local Storage)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Inspiration",
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    category: "Motivation",
  },
  {
    text: "The best way to predict the future is to invent it.",
    category: "Innovation",
  },
];

// Function to Show a Random Quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quoteDisplay) {
    quoteDisplay.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <p><em>- ${randomQuote.category}</em></p>
    `;
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  }
}

// Function to Show Last Viewed Quote (From Session Storage)
function showLastViewedQuote() {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quoteDisplay) {
      quoteDisplay.innerHTML = `
        <p>"${lastQuote.text}"</p>
        <p><em>- ${lastQuote.category}</em></p>
      `;
    }
  }
}

// Function to Create and Display "Add Quote" Form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.id = "formContainer";
  document.body.appendChild(formContainer);

  formContainer.innerHTML = `
    <h3>Add a New Quote</h3>
    <form id="addQuoteForm">
      <label for="quoteText">Quote:</label>
      <textarea id="quoteText" placeholder="Enter the quote" required></textarea>
      <label for="quoteCategory">Category:</label>
      <input type="text" id="quoteCategory" placeholder="Enter the category" required>
      <button type="submit">Add Quote</button>
    </form>
  `;

  document
    .getElementById("addQuoteForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const quoteText = document.getElementById("quoteText").value;
      const quoteCategory = document.getElementById("quoteCategory").value;

      if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes();
        this.reset();
        alert("Quote added successfully!");
      } else {
        alert("Please fill out both fields.");
      }
    });
}

// Function to Save Quotes to Local Storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to Load Quotes from Local Storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to Create Import & Export Controls
function createJsonControls() {
  const controlsContainer = document.createElement("div");
  document.body.appendChild(controlsContainer);

  // Export Button
  const exportButton = document.createElement("button");
  exportButton.id = "exportButton"; // Ensure the ID matches the check
  exportButton.textContent = "Export Quotes as JSON";
  exportButton.addEventListener("click", exportToJsonFile);
  controlsContainer.appendChild(exportButton);

  // Import File Input
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.id = "importFile"; // Ensure the ID matches the check
  importInput.accept = ".json";
  importInput.addEventListener("change", importFromJsonFile);
  controlsContainer.appendChild(importInput);
}

// Function to Export Quotes to a JSON File
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to Import Quotes from a JSON File
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(file);
}
