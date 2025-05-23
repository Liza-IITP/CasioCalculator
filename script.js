let screen = document.getElementById("display");
let buttons = document.querySelectorAll(".btn");

buttons.forEach((button) => {
    button.addEventListener("click", function() {
        let value = this.textContent;

        if (value === "=") {
            try {
                let expr = screen.value
                    .replace(/π/g, "Math.PI")
                    .replace(/e/g, "Math.E")
                    .replace(/sin\(/g, "Math.sin(toRadians(")
                    .replace(/cos\(/g, "Math.cos(toRadians(")
                    .replace(/tan\(/g, "Math.tan(toRadians(")
                    .replace(/log\(/g, "Math.log10(")
                    .replace(/ln\(/g, "Math.log(")
                    .replace(/√\(/g, "Math.sqrt(")
                    .replace(/\^/g, "**");

                // Fix missing closing parenthesis for trig functions
                expr = expr.replace(/(Math\.(sin|cos|tan)\(toRadians\([^\(\)]*\))/g, "$&)");

                // Handle factorial (n!)
                expr = expr.replace(/(\d+(\.\d+)?)!/g, "factorial($1)");

                // Evaluate
                screen.value = eval(expr);
            } catch {
                screen.value = "Error";
            }
        }
        else if (value === "C") {
            screen.value = "";
        }
        else if (value === "DEL") {
            screen.value = screen.value.slice(0, -1);
        }
        else if (value === "S<=>D") {
            if (screen.value.includes("/")) {
                screen.value = fractionToDecimal(screen.value);
            } else if (!isNaN(screen.value) && screen.value.includes(".")) {
                screen.value = decimalToFraction(Number(screen.value));
            }
        }
        else {
            // Add parentheses for functions
            if (["sin", "cos", "tan", "log", "ln"].includes(value)) {
                screen.value += value + "(";
            } else if (value === "√") {
                screen.value += "√(";
            } else {
                screen.value += value;
            }
        }
        adjustDisplayFont();
    });
});

// Helper for degree to radian conversion
function toRadians(deg) {
    return deg * (Math.PI / 180);
}

// Factorial function
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}

function decimalToFraction(decimal) {
    if (decimal % 1 === 0) return decimal; // already integer
    let str = decimal.toString();
    let decimalLength = str.split(".")[1]?.length || 0;
    let denominator = Math.pow(10, decimalLength);
    let numerator = Math.round(decimal * denominator);
    let divisor = gcd(numerator, denominator);
    return `${numerator / divisor}/${denominator / divisor}`;
}

function fractionToDecimal(fraction) {
    let parts = fraction.split("/");
    if (parts.length === 2) {
        let num = parseFloat(parts[0]);
        let den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
            return num / den;
        }
    }
    return fraction;
}

function adjustDisplayFont() {
    const display = screen;
    let fontSize = 32; // start large
    display.style.fontSize = fontSize + "px";
    while (display.scrollWidth > display.clientWidth && fontSize > 14) {
        fontSize -= 2;
        display.style.fontSize = fontSize + "px";
    }
}