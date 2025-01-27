document.getElementById("search-btn").addEventListener("click", async () => {
    const word = document.getElementById("word-input").value.trim();
  
    if (!word) {
      alert("Please enter a word.");
      return;
    }
  
    try {
      // Fetch word data from API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
  
      if (!data || data.title === "No Definitions Found") {
        alert("No results found for the given word.");
        return;
      }
  
      const definitions = data[0].meanings[0].definitions;
      const synonyms = data[0].meanings[0].synonyms || [];
      const antonyms = data[0].meanings[0].antonyms || [];
  
      // Display results
      document.getElementById("meaning").textContent = definitions[0].definition || "Not available.";
      document.getElementById("synonyms").textContent = synonyms.length > 0 ? synonyms.join(", ") : "Not available.";
      document.getElementById("antonyms").textContent = antonyms.length > 0 ? antonyms.join(", ") : "Not available.";
    } catch (error) {
      console.error("Error fetching word data:", error);
      alert("Failed to fetch word data. Please try again.");
    }
  });
  