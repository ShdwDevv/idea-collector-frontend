document.addEventListener("DOMContentLoaded", loadNames); // Load names when the page is ready

// Function to load names from the backend and display them
async function loadNames() {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-names`); // Fetch names from backend
        if (response.ok) {
            const names = await response.json();
            const nameList = document.getElementById("nameList");
            nameList.innerHTML = ""; // Clear the current list

            names.forEach((name, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${index + 1}. ${name} `; // Add serial number before the name

                // Create the "X" mark to remove the name
                const removeButton = document.createElement("span");
                removeButton.textContent = " X";
                removeButton.style.color = "white"; // Style the button to be visible
                removeButton.style.cursor = "pointer"; // Make it clickable
                removeButton.style.marginLeft = "10px"; // Add some space between name and "X"
                
                // Event listener to handle removal
                removeButton.onclick = () => {
                    removeName(name); // Call function to remove from backend
                    listItem.remove(); // Remove the name from the DOM
                };

                // Append the remove button to the list item
                listItem.appendChild(removeButton);
                nameList.appendChild(listItem);
            });
        } else {
            console.error("Failed to load names");
        }
    } catch (error) {
        console.error("Error loading names:", error);
    }
}

// Function to send a request to remove a name from the backend
async function removeName(name) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/remove-name`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name }) // Send name as part of the request body
        });
        if (response.ok) {
            console.log("Name removed successfully");
            loadNames(); // Refresh the name list after adding
        } else {
            console.error("Failed to remove name");
        }
    } catch (error) {
        console.error("Error removing name:", error);
    }
}

// Handle form submission to add a new name
const form = document.getElementById("nameForm");
const nameInput = document.getElementById("name");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    const nameValue = nameInput.value.trim(); // Get the trimmed input value

    if (nameValue) {
        try {
            // Send the name to the backend
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/add-name`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameValue })
            });

            if (response.ok) {
                console.log("Name added successfully");
                loadNames(); // Refresh the name list after adding
            } else {
                console.error("Failed to add name");
            }
        } catch (error) {
            console.error("Error adding name:", error);
        }

        // Clear the input field after submission
        nameInput.value = "";
    } else {
        console.log("Please enter a name");
    }
});
