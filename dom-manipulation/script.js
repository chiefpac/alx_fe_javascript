document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  const importFileInput = document.createElement("input");
  importFileInput.type = "file";
  importFileInput.id = "importFile";
  importFileInput.accept = ".json";
  importFileInput.addEventListener("change", importFromJsonFile);
  document.body.appendChild(importFileInput);

  let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const serverQuotes = await response.json();
      const formattedQuotes = serverQuotes.map((post) => ({
        text: post.title,
        category: "Server",
      }));
      quotes = [...formattedQuotes, ...quotes];
      saveQuotes();
      alert("Quotes synced with server!");
    } catch (error) {
      console.error("Error fetching quotes from server:", error);
    }
  }

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.textContent = "No quotes available.";
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const lastViewedQuote = quotes[randomIndex];
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(lastViewedQuote));
    quoteDisplay.textContent = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
  }

  newQuoteButton.addEventListener("click", showRandomQuote);
  showRandomQuote();

  function createAddQuoteForm() {
    const formContainer = document.createElement("div");

    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
    document.body.appendChild(formContainer);
  }

  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document
      .getElementById("newQuoteCategory")
      .value.trim();

    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      saveQuotes();
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("Quote added successfully!");
    } else {
      alert("Please enter both a quote and a category.");
    }
  }

  function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
  }

  const exportButton = document.createElement("button");
  exportButton.textContent = "Export Quotes";
  exportButton.addEventListener("click", exportToJsonFile);
  document.body.appendChild(exportButton);

  const syncButton = document.createElement("button");
  syncButton.textContent = "Sync with Server";
  syncButton.addEventListener("click", fetchQuotesFromServer);
  document.body.appendChild(syncButton);

  createAddQuoteForm();
});
