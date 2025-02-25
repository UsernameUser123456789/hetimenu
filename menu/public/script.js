// API URL (Netlify Functions)
const API_URL = "/.netlify/functions/menu";

// Mai nap meghatározása
const napok = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
const maiNap = new Date().getDay(); // 0 (vasárnap) - 6 (szombat)

// Mai menü megjelenítése
const maiMenuElem = document.getElementById("mai-menu-etel");

// Táblázat dinamikus feltöltése
const tableBody = document.querySelector("#heti-menu-table tbody");

// Heti menü betöltése
function loadMenu() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // Táblázat feltöltése
            fillTable(data);

            // Mai menü megjelenítése
            const maiMenuAdat = data.find(menu => menu.nap === napok[maiNap]);
            maiMenuElem.textContent = maiMenuAdat ? maiMenuAdat.etel : "Ma nincs menü.";
        })
        .catch(error => console.error("Hiba a menü betöltésekor:", error));
}

// Táblázat feltöltése
function fillTable(data) {
    tableBody.innerHTML = "";
    data.forEach(menu => {
        const row = document.createElement("tr");
        const napCell = document.createElement("td");
        const etelCell = document.createElement("td");

        napCell.textContent = menu.nap;
        etelCell.textContent = menu.etel;

        row.appendChild(napCell);
        row.appendChild(etelCell);
        tableBody.appendChild(row);
    });
}

// Szerkesztési űrlap megnyitása
document.getElementById("edit-button").addEventListener("click", function() {
    const editForm = document.getElementById("edit-form");
    editForm.classList.remove("hidden");

    // Űrlap feltöltése a jelenlegi menüvel
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            document.getElementById("hetfo").value = data.find(menu => menu.nap === "Hétfő").etel;
            document.getElementById("kedd").value = data.find(menu => menu.nap === "Kedd").etel;
            document.getElementById("szerda").value = data.find(menu => menu.nap === "Szerda").etel;
            document.getElementById("csutortok").value = data.find(menu => menu.nap === "Csütörtök").etel;
            document.getElementById("pentek").value = data.find(menu => menu.nap === "Péntek").etel;
        });
});

// Szerkesztési űrlap mentése
document.getElementById("menu-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const hetfo = document.getElementById("hetfo").value;
    const kedd = document.getElementById("kedd").value;
    const szerda = document.getElementById("szerda").value;
    const csutortok = document.getElementById("csutortok").value;
    const pentek = document.getElementById("pentek").value;

    // Adatok küldése a backendre
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ hetfo, kedd, szerda, csutortok, pentek }),
    })
        .then(response => response.json())
        .then(() => {
            // Menü újratöltése
            loadMenu();
            // Űrlap elrejtése
            document.getElementById("edit-form").classList.add("hidden");
        })
        .catch(error => console.error("Hiba a mentéskor:", error));
});

// Szerkesztési űrlap bezárása
document.getElementById("cancel-button").addEventListener("click", function() {
    document.getElementById("edit-form").classList.add("hidden");
});

// Oldal betöltésekor a menü betöltése
loadMenu();