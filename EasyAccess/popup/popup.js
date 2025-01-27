const resultsContainer = document.getElementById("results");
const keysListContainer = document.getElementById("keys-list");

// Add data
document.getElementById("add-btn").addEventListener("click", () => {
  const key = document.getElementById("key-input").value.trim();
  const data = document.getElementById("data-input").value.trim();

  if (!key || !data) return alert("Key and data are required!");

  chrome.storage.local.get([key], (result) => {
    if (result[key]) {
      alert("Key already exists! Use a different key.");
    } else {
      chrome.storage.local.set({ [key]: data }, () => alert("Data added successfully!"));
    }
  });
});

// Search data
document.getElementById("search-btn").addEventListener("click", () => {
  const searchKey = document.getElementById("search-input").value.trim();
  if (!searchKey) return alert("Enter a key to search.");

  chrome.storage.local.get([searchKey], (result) => {
    resultsContainer.innerHTML = "";
    if (result[searchKey]) {
      const li = document.createElement("li");
      li.textContent = result[searchKey];

      // Copy Button
      const copyBtn = document.createElement("button");
      copyBtn.textContent = "Copy";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(result[searchKey]).then(() => {
          alert("Copied to clipboard!");
        });
      };

      // Edit Button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => {
        const newData = prompt("Edit Data:", result[searchKey]);
        if (newData) {
          chrome.storage.local.set({ [searchKey]: newData }, () => {
            alert("Data updated successfully!");
            li.textContent = newData;
          });
        }
      };

      // Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => {
        chrome.storage.local.remove([searchKey], () => {
          alert("Data deleted successfully!");
          li.remove();
        });
      };

      li.appendChild(copyBtn);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      resultsContainer.appendChild(li);
    } else {
      resultsContainer.innerHTML = "<li>No data found for this key.</li>";
    }
  });
});

// List all keys
document.getElementById("list-keys-btn").addEventListener("click", () => {
  keysListContainer.innerHTML = "";
  chrome.storage.local.get(null, (items) => {
    const keys = Object.keys(items);
    if (keys.length > 0) {
      keys.forEach((key) => {
        const li = document.createElement("li");
        li.textContent = key;
        keysListContainer.appendChild(li);
      });
    } else {
      keysListContainer.innerHTML = "<li>No keys found.</li>";
    }
  });
});

// Export Data
document.getElementById("export-btn").addEventListener("click", () => {
  chrome.storage.local.get(null, (items) => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
  });
});

// Import Data
document.getElementById("import-btn").addEventListener("click", () => {
  const fileInput = document.getElementById("import-file");
  const file = fileInput.files[0];
  if (!file) return alert("Select a file to import.");

  const reader = new FileReader();
  reader.onload = (event) => {
    const importedData = JSON.parse(event.target.result);
    chrome.storage.local.set(importedData, () => alert("Data imported successfully!"));
  };
  reader.readAsText(file);
});
