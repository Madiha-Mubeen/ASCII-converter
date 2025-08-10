function convertFromChar() {
    const charInput = document.getElementById("charInput").value;
    if 
        (!charInput || charInput.length !== 1) {
        alert("Enter a single character.");
        return;
    }


const code = charInput.charCodeAt(0);
document.getElementById("decOut").textContent = code;
document.getElementById("binOut").textContent = code.toString(2).padStart(8, '0');
document.getElementById("octOut").textContent = code.toString(8);
document.getElementById("hexOut").textContent = code.toString(16).toUpperCase();

}

function convertToChar () {
    const value = document.getElementById("valueInput").value.trim();
    const format = document.getElementById("format").value;
    let decimalValue;

    try {
        switch (format) {
            case "decimal":
                decimalValue = parseInt(value, 10);
                break;
            case "binary":
                decimalValue = parseInt(value, 2);
                break;
            case "octal":
                decimalValue = parseInt(value, 8);
                break;
            case "hex":
            decimalValue = parseInt(value, 16);
            break;
        }

        if (isNaN(decimalValue) || decimalValue < 0 || decimalValue > 255) {
            throw new Error("Invalid input range.");
        }

        document.getElementById("revChar").textContent = String.fromCharCode(decimalValue);
    } catch {
        document.getElementById("revChar").textContent = "Invalid input";
    }
}

document.querySelectorAll('.output span').forEach(span => {
    span.addEventListener('click', () => {
        navigator.clipboard.writeText(span.textContent).then (() => {
            alert(`copied: ${span.textContent}`);
        });
    });
});

const tableBody = document.getElementById("ascii-body");

function toBinary(n) {
    return n.toString(2).padStart(8, "0");
}

function toOctal(n) {
    return n.toString(8);
}

function toHex(n) {
    return n.toString(16).toUpperCase().padStart(2, "0");
}

function isPrintable(charCode) {
    return charCode >= 32 && charCode <= 126;
}

for (let i = 0; i <= 255; i++) {
    const row = document.createElement("tr");

    const decimal = document.createElement("td");
    const char = document.createElement("td");
    const binary = document.createElement("td");
    const octal = document.createElement("td");
    const hex = document.createElement("td");

    decimal.textContent = i;
    char.textContent = isPrintable(i) ? String.fromCharCode(i) : "␀";
    binary.textContent = toBinary(i);
    octal.textContent = toOctal(i);
    hex.textContent = toHex(i);

    row.appendChild(decimal);
    row.appendChild(char);
    row.appendChild(binary);
    row.appendChild(octal);
    row.appendChild(hex);

    tableBody.appendChild(row);
}

//Searching Logic
document.getElementById("ascii-search").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const row = tableBody.querySelectorAll("tr");

   row.forEach(row => {
    const cells = row.querySelectorAll("td");
    const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join ("");
    row.style.display = rowText.includes(query) ? "" : "none";
    });
});

const toggleCheckbox = document.getElementById("theme-toggle");
const themeWrapper = document.querySelector(".theme-toggle-wrapper");
const sound = document.getElementById("themeSound");

//Load saved theme on page load 
const savedTheme = localStorage.getItem("theme");
const isDarkSaved = savedTheme === "dark";

//Apply saved theme on page loading 
document.body.classList.toggle("dark", isDarkSaved);
toggleCheckbox.checked = isDarkSaved;

//Theme toggle event
toggleCheckbox.addEventListener("change", () => {
    const isDark = toggleCheckbox.checked;

    //Toggle dark mode class
    document.body.classList.toggle("dark", isDark);

    //Saved theme preference
    localStorage.setItem("theme", isDark ? "dark" : "light");

    //Add rotation effect to switch
    if (themeWrapper) {
        themeWrapper.classList.add("rotate");
        setTimeout(() => themeWrapper.classList.remove("rotate"), 500);
    }

    //Play sound if set
    if (sound && sound.src) {
        sound.currentTime = 0;
        sound.play().catch(err => console.warn("OOPS! Sound play error:", err));
    }
});
/*
//matrix rain
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

//Full Screen
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

//  Characters
const chars = "0.1".split("");
const fontSize = 15;
const columns = canvas.Width / fontSize;

//Array for rain drops
let drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

//Draw function
function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f0";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

//Adjust on resize
window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
}); */