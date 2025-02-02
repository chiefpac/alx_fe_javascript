document.addEventListener("DOMContentLoaded", function () {
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

  // Call function to create the "Add Quote" form
  createAddQuoteForm();

  // Show an initial random quote
  showRandomQuote();
});

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

    // Add event listener to handle quote submission
    const addQuoteForm = document.getElementById("addQuoteForm");
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
