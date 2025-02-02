document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastFilter(); // Restore last filter
  filterQuotes(); // Apply the filter when the page is loaded
  initializeSyncUI();

  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
  document
    .getElementById("exportButton")
    .addEventListener("click", exportToJsonFile);
  document.getElementById("syncButton").addEventListener("click", manualSync);
  createAddQuoteForm();

  setInterval(autoSync, 30000); // Periodic auto sync every 30 seconds
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
    if (conflicts.length > 0) handleConflicts(conflicts, serverQuotes);
    else quotes = mergeQuotes(quotes, serverQuotes);

    saveQuotes();
    populateCategories();
    filterQuotes();

    pendingChanges = false;
    showNotification("Sync completed successfully", "success");
  } catch (error) {
    showNotification(`Sync failed: ${error.message}`, "error");
  }
  isSyncing = false;
}

// Fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch quotes from the server");
    }
    return await response.json();
  } catch (error) {
    showNotification(`Error fetching quotes: ${error.message}`, "error");
    return [];
  }
}

// Post quotes to the server (Mock POST request)
async function postQuotesToServer(quotesToPost) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quotesToPost),
    });
    if (!response.ok) {
      throw new Error("Failed to post quotes to the server");
    }
    const postedQuotes = await response.json();
    return postedQuotes;
  } catch (error) {
    showNotification(`Error posting quotes: ${error.message}`, "error");
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
  setTimeout(() => (statusDiv.textContent = ""), 3000);
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
    quotes.push({
      id: Date.now().toString(),
      text: text,
      category: category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    saveQuotes();
    populateCategories();
    filterQuotes();
  }
}

function restoreLastFilter() {
  const lastFilter = localStorage.getItem("categoryFilter");
  if (lastFilter) {
    document.getElementById("categoryFilter").value = lastFilter;
    filterQuotes(); // Reapply the filter when the page is loaded
  }
}

function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    categoryFilter === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === categoryFilter);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filteredQuotes
    .map((quote) => `<p>${quote.text} <em>(${quote.category})</em></p>`)
    .join("");

  // Save the selected category filter to localStorage
  localStorage.setItem("categoryFilter", categoryFilter);
}

function populateCategories() {
  const categories = new Set(quotes.map((quote) => quote.category));
  const categoryFilter = document.getElementById("categoryFilter");

  // Clear the existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}
