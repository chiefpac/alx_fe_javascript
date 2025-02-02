document.addEventListener("DOMContentLoaded", function () {
  // Load quotes from local storage
  loadQuotes();

  // Create quote display container
  const quoteDisplay = document.createElement("div");
  quoteDisplay.id = "quoteDisplay";
  document.body.appendChild(quoteDisplay);

  // Create "Show Random Quote" button
  const newQuoteButton = document.createElement("button");
  newQuoteButton.id = "newQuote";
  newQuoteButton.textContent = "Show Random Quote";
  newQuoteButton.addEventListener("click", showRandomQuote);
  document.body.appendChild(newQuoteButton);

  // Create a container for the "Add Quote" form
  const formContainer = document.createElement("div");
  formContainer.id = "formContainer";
  document.body.appendChild(formContainer);

  // Create JSON Import/Export Buttons
  createJsonControls();

  // Call function to create the "Add Quote" form
  createAddQuoteForm();

  // Show the last displayed quote from session storage
  showLastViewedQuote();
});

// Array to store quotes (defaults if no local storage)
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

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quoteDisplay) {
    quoteDisplay.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <p><em>- ${randomQuote.category}</em></p>
    `;

    // Store last viewed quote in session storage
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  }
}

// Function to create and display the "Add Quote" form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  if (formContainer) {
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

    // Add event listener to handle quote submission
    document
      .getElementById("addQuoteForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const quoteText = document.getElementById("quoteText").value;
        const quoteCategory = document.getElementById("quoteCategory").value;

        if (quoteText && quoteCategory) {
          // Add new quote to the array
          quotes.push({ text: quoteText, category: quoteCategory });

          // Save to local storage
          saveQuotes();

          // Clear the form
          this.reset();

          alert("Quote added successfully!");
        } else {
          alert("Please fill out both fields.");
        }
      });
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to show the last viewed quote from session storage
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

// Function to create JSON Import/Export controls
function createJsonControls() {
  const controlsContainer = document.createElement("div");

  // Export Button
  const exportButton = document.createElement("button");
  exportButton.textContent = "Export Quotes as JSON";
  exportButton.addEventListener("click", exportToJsonFile);
  controlsContainer.appendChild(exportButton);

  // Import File Input
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.id = "importFile";
  importInput.accept = ".json";
  importInput.addEventListener("change", importFromJsonFile);
  controlsContainer.appendChild(importInput);

  document.body.appendChild(controlsContainer);
}

// Function to export quotes to a JSON file
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

// Function to import quotes from a JSON file
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
