document.getElementById("quoteDisplay");
newQuoteButton = document.getElementById("newQuote");

// Array to store quote objects
let quotes = [
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

    // Add event listener to the form
    const addQuoteForm = document.getElementById("addQuoteForm");
    if (addQuoteForm) {
      addQuoteForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const quoteText = document.getElementById("quoteText").value;
        const quoteCategory = document.getElementById("quoteCategory").value;

        if (quoteText && quoteCategory) {
          // Add the new quote to the array
          quotes.push({ text: quoteText, category: quoteCategory });

          // Clear the form
          addQuoteForm.reset();

          // Show a success message
          alert("Quote added successfully!");
        } else {
          alert("Please fill out both fields.");
        }
      });
    }
  }
}

// Function to initialize the application
function init() {
  // Create a container for the random quote display
  const quoteDisplay = document.createElement("div");
  quoteDisplay.id = "quoteDisplay";
  document.body.appendChild(quoteDisplay);

  // Create a button to show a random quote
  const randomQuoteBtn = document.createElement("button");
  randomQuoteBtn.textContent = "Show Random Quote";
  randomQuoteBtn.addEventListener("click", showRandomQuote);
  document.body.appendChild(randomQuoteBtn);
  // Create a container for the "Add Quote" form
}
