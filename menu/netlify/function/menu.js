const fs = require("fs");
const path = require("path");

// JSON fájl elérési útja
const menuFilePath = path.join(__dirname, "menu.json");

// Heti menü betöltése
function loadMenu() {
    if (!fs.existsSync(menuFilePath)) {
        // Alapértelmezett menü, ha a fájl nem létezik
        return [
            { nap: "Hétfő", etel: "Hétfői menü" },
            { nap: "Kedd", etel: "Keddi menü" },
            { nap: "Szerda", etel: "Szerdai menü" },
            { nap: "Csütörtök", etel: "Csütörtöki menü" },
            { nap: "Péntek", etel: "Pénteki menü" },
        ];
    }
    const data = fs.readFileSync(menuFilePath, "utf8");
    return JSON.parse(data);
}

// Heti menü mentése
function saveMenu(menu) {
    fs.writeFileSync(menuFilePath, JSON.stringify(menu, null, 2), "utf8");
}

// GET kérés kezelése
exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        const menu = loadMenu();
        return {
            statusCode: 200,
            body: JSON.stringify(menu),
        };
    }

    // POST kérés kezelése
    if (event.httpMethod === "POST") {
        const { hetfo, kedd, szerda, csutortok, pentek } = JSON.parse(event.body);
        const menu = [
            { nap: "Hétfő", etel: hetfo },
            { nap: "Kedd", etel: kedd },
            { nap: "Szerda", etel: szerda },
            { nap: "Csütörtök", etel: csutortok },
            { nap: "Péntek", etel: pentek },
        ];
        saveMenu(menu);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Menü frissítve!" }),
        };
    }

    // Nem támogatott HTTP metódus
    return {
        statusCode: 405,
        body: JSON.stringify({ error: "Nem támogatott metódus" }),
    };
};