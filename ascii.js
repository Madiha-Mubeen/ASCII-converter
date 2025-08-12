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

    if (sound && sound.src) {
        sound.currentTime = 0;
        sound.play().catch(err => console.warn("OOPS! Sound play error:", err));
    }
});

//Matrix rain
const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "1011101ABC110SDE119QWF4581186AWD1234567";
const fontSize = 17;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);
let cursorChars = [], ripples = [], keyChars =[];
let activeMessages = [], explosions = [];
let scanlineY = 0;

const systemMessages = [
    "ASCII",
    "CONVERT",
    "BINARY",
    "HEXADECIMAL",
    "OCTAL",
    "0-7",
    "0/1",
    "A-F",
    "ASCII TABLE"
];

function spawnSystemMessages() {
    activeMessages.push({
        text: systemMessages[Math.floor(Math.random() * systemMessages.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        alpha: 1
    });
}

canvas.addEventListener("click", e => {
    for (let i = 0; i < 40; i++) {
        explosions.push({
            x: e.clientX,
            y: e.clientY,
            text: letters.charAt(Math.floor(Math.random() * letters.length)),
            alpha: 1,
            dx: (Math.random() - 0.5) * 6,
            dy: (Math.random() - 0.5) * 6
        });
    }
});

function drawScanlines() {
    ctx.strokeStyle = "rgba(62, 54, 136, 0.5)";
    for (let y = scanlineY; y < canvas.height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    scanlineY = (scanlineY + 0.5) % 4;
}

function drawSystemMessages() {
    ctx.font = "bold 21px Bitcount Display";
    ctx.fillStyle = "#7793dfff";
    ctx.strokeStyle = "#333333ff";
    ctx.textAlign ="center";
    for (let i = activeMessages.length - 1; i >= 0; i--) {
        let msg = activeMessages[i];
        ctx.fillStyle = `rgba(119,147,223,${msg.alpha})`;
        ctx.fillText(msg.text, msg.x, msg.y);
        msg.alpha -= 0.01;
        if (msg.alpha <= 0) activeMessages.splice(i, 1);
    }
}

function drawExplosions() {
    ctx.font = "17px cursive";
    for (let i = explosions.length - 1; i >= 0; i--) {
        let p = explosions[i];
        ctx.fillStyle = `rgba(0,255,0,${p.alpha})`;
        ctx.fillText(p.text, p.x, p.y);
        p.x += p.dx;
        p.y += p.dy;
        if (p.alpha <= 0) explosions.splice(i, 1);
    }
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(61, 48, 136, 1)';
    ctx.fillStyle = 'rgba(90, 63, 153, 1)';
    ctx.font = fontSize + 'px cursive';

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}

function drawRipples() {
    ripples.forEach((r, index) => {
        ctx.globalAlpha = r.alpha;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(148, 111, 212, 1)';
        ctx.lineWidth = 2;
        ctx.stroke();
        r.radius += 2;
        r.alpha -= 0.02;
        if (r.radius <= 0) ripples.splice(index, 1);
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

function draw() {
    drawMatrix();
    drawScanlines();
    drawSystemMessages();
    drawExplosions();
    drawRipples();
    drawKeyChars();
    requestAnimationFrame(draw);
}

setInterval(spawnSystemMessages, 5000);
draw();

window.addEventListener('mousemove', e => {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    cursorChars.push({ x: e.clientX, y: e.clientY, text, alpha: 1});
});

window.addEventListener('click', e => {
    ripples.push({x: e.clientX, y: e.clientY, radius: 0, alpha: 1});
});

window.addEventListener('keydown', () => {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    keyChars.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height, text, alpha: 1});
});

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

