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
                const removeButton = document.createElement("span");
                removeButton.textContent = " X";
                removeButton.style.color = "white"; 
                removeButton.style.cursor = "pointer";
                removeButton.style.marginLeft = "10px"; 
                removeButton.onclick = () => {
                    removeName(name); 
                    listItem.remove(); 
                };
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
async function removeName(name) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/remove-name`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name }) 
        });
        if (response.ok) {
            console.log("Name removed successfully");
            loadNames(); 
        } else {
            console.error("Failed to remove name");
        }
    } catch (error) {
        console.error("Error removing name:", error);
    }
}
const form = document.getElementById("nameForm");
const nameInput = document.getElementById("name");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameValue = nameInput.value.trim();
    if (nameValue) {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/add-name`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameValue })
            });

            if (response.ok) {
                console.log("Name added successfully");
                loadNames(); 
            } else {
                console.error("Failed to add name");
            }
        } catch (error) {
            console.error("Error adding name:", error);
        }
        nameInput.value = "";
    } else {
        console.log("Please enter a name");
    }
});
