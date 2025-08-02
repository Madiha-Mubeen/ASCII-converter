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
document.getElementById("octOut").textContent = codetoString(8);
document.getElementById("hexOut").textContetn = code.toString(16),toUpperCase();

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