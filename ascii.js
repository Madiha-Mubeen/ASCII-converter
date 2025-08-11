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

//Matrix rain
const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

//Match window size
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = 'アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤャユュヨョラリルレロワヰヱヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

//Interactive effect storage
let cursorChars = [];
let ripples = [];
let keyChars = [];

//Matrix rain draw
function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#a1abe2ff';
    ctx.fillStyle = '#5683ffff';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

//Draw interactive effects
function drawCursorTrail() {
    cursorChars.forEach((char, index) => {
        ctx.globalAlpha = char.alpha;
        ctx.fillText(char.text, char.x, char.y);
        char.alpha -= 0.02;
        if (char.alpha <= 0) cursorChars.splice(index, 1);
    });
    ctx.globalAlpha = 1;
}

function drawRipples() {
    ripples.forEach((r, index) => {
        ctx.globalAlpha = r.alpha;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#29456eff';
        ctx.lineWidth = 2;
        ctx.stroke();
        r.radius += 2;
        r.alpha -= 0.02;
        if (r.alpha <= 0) ripples.splice(index, 1);
    });
    ctx.globalAlpha = 1;
}

function drawKeyChars() {
    keyChars.forEach((char, index) => {
        ctx.globalAlpha = char.alpha;
        ctx.fillText(char.text, char.x, char.y);
        char.alpha -= 0.02;
        if (char.alpha <= 0) keyChars.splice(index, 1);
    });
    ctx.globalAlpha = 1;
}

//Main draw loop
function draw() {
    drawMatrix();
    drawCursorTrail();
    drawRipples();
    drawKeyChars();

    //Scroll down text
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#4652beff';
    ctx.fillStyle = '#b9b3daff';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.8;
    ctx.fillText('Scroll down to use ASCII Converter', canvas.width / 2, canvas.height / 2);
    ctx.globalAlpha = 1;
}

setInterval(draw, 35);

//Event Listeners
window.addEventListener('mousemove', e => {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    cursorChars.push({x: e.clientX, y: e.clientY, text, alpha: 1});
});

window.addEventListener('click', e => {
    ripples.push({ x: e.clientX, y: e.clientY, radius: 0, alpha: 1});
});

window.addEventListener('keydown', () => {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    keyChars.push({x, y, text, alpha: 1});
});

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});