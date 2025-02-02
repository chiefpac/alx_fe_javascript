document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastFilter();
  filterQuotes();
  initializeSyncUI();

  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
  document
    .getElementById("exportButton")
    .addEventListener("click", exportToJsonFile);
  document.getElementById("syncButton").addEventListener("click", manualSync);
  createAddQuoteForm();

  setInterval(autoSync, 30000);
});

let quotes = [];
let isSyncing = false;
let pendingChanges = false;
const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

function loadQuotes() {
  const localData = localStorage.getItem("quotes");
  quotes = localData ? JSON.parse(localData) : [];
  migrateLegacyData();
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
  pendingChanges = true;
}

async function manualSync() {
  showNotification("Initiating manual sync...", "info");
  await performSync();
}

async function autoSync() {
  if (!pendingChanges) return;
  showNotification("Auto-syncing changes...", "info");
  await performSync();
}

async function performSync() {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const serverQuotes = await fetchQuotesFromServer();

    const conflicts = detectConflicts(quotes, serverQuotes);
    if (conflicts.length > 0) {
      handleConflicts(conflicts, serverQuotes);
    } else {
      quotes = mergeQuotes(quotes, serverQuotes);
    }

    saveQuotes();
    populateCategories();
    filterQuotes();

    pendingChanges = false;
    showNotification("Quotes synced with server!", "success"); // Show success notification after sync
  } catch (error) {
    showNotification(`Sync failed: ${error.message}`, "error"); // Show error notification if sync fails
  }

  isSyncing = false;
}

function fetchQuotesFromServer() {
  return fetch(API_URL)
    .then((response) => response.json())
    .catch((error) => {
      throw new Error("Error fetching quotes from server: " + error.message);
    });
}

// New function to POST data to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(API_URL, {
      method: "POST", // Specify the method as POST
      headers: {
        "Content-Type": "application/json", // Specify the content type
      },
      body: JSON.stringify(quote), // Convert the quote object to JSON format
    });

    if (!response.ok) {
      throw new Error("Failed to post quote to server");
    }

    const serverResponse = await response.json();
    return serverResponse; // Return the response from the server
  } catch (error) {
    throw new Error("Error posting quote to server: " + error.message);
  }
}

function detectConflicts(local, server) {
  return local.filter((localQuote) => {
    const serverQuote = server.find((sq) => sq.id === localQuote.id);
    return serverQuote && serverQuote.updatedAt !== localQuote.updatedAt;
  });
}

function mergeQuotes(local, server) {
  const quoteMap = new Map();
  server.forEach((quote) => quoteMap.set(quote.id, quote));
  local.forEach((quote) => {
    const existing = quoteMap.get(quote.id);
    if (!existing || new Date(quote.updatedAt) > new Date(existing.updatedAt)) {
      quoteMap.set(quote.id, quote);
    }
  });
  return Array.from(quoteMap.values());
}

function handleConflicts(conflicts, serverQuotes) {
  const resolution = window.confirm(
    `${conflicts.length} conflict(s) detected!\nKeep local changes? (OK for yes, Cancel for server version)`
  );

  conflicts.forEach((conflict) => {
    const index = quotes.findIndex((q) => q.id === conflict.id);
    if (resolution) quotes[index].updatedAt = new Date().toISOString();
    else quotes[index] = serverQuotes.find((q) => q.id === conflict.id);
  });

  saveQuotes();
}

function initializeSyncUI() {
  const statusDiv = document.getElementById("syncStatus");
  statusDiv.textContent = "Ready to sync";
}

function showNotification(message, type = "info") {
  const statusDiv = document.getElementById("syncStatus");
  statusDiv.textContent = message;
  statusDiv.className = `sync-status ${type}`;
  setTimeout(() => (statusDiv.textContent = ""), 3000); // Clear notification after 3 seconds

  // Show a popup alert for critical actions like successful sync or errors
  if (type === "success") {
    alert(message); // Show an alert when the sync is successful
  }
  // Optionally, you can also show an alert for error or conflict detection, depending on the logic
  else if (type === "error") {
    alert(message); // Show alert in case of error
  }
}

function migrateLegacyData() {
  quotes = quotes.map((quote) => ({
    ...quote,
    id: quote.id || Date.now().toString(),
    createdAt: quote.createdAt || new Date().toISOString(),
    updatedAt: quote.updatedAt || new Date().toISOString(),
  }));
  saveQuotes();
}

function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();
  if (text && category) {
    const newQuote = {
      id: Date.now().toString(),
      text: text,
      category: category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();

    // Post the new quote to the server as well
    postQuoteToServer(newQuote)
      .then((serverResponse) => {
        console.log("Quote posted successfully to server", serverResponse);
      })
      .catch((error) => {
        console.error("Error posting quote to server:", error);
      });
  }
}

function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map((quote) => quote.category))];
  categorySelect.innerHTML = "<option value='all'>All Categories</option>";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    category === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === category);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  filteredQuotes.forEach((quote) => {
    const div = document.createElement("div");
    div.textContent = `"${quote.text}"`;
    quoteDisplay.appendChild(div);
  });
}
