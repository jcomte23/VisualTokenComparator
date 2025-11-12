import './style.css'

// ==============================
// 🧩 Elementos del DOM
// ==============================
const jsonInput = document.getElementById("json-input");
const toonOutput = document.getElementById("toon-input");
const jsonTokensEl = document.getElementById("json-tokens");
const toonTokensEl = document.getElementById("toon-tokens");
const savingsEl = document.getElementById("savings-value");

// ==============================
// ⚙️ Función: JSON → TOON oficial
// ==============================
function jsonToToon(jsonStr) {
  if (jsonStr.trim() === "") return "🪶 Waiting for JSON input...";
  try {
    const obj = JSON.parse(jsonStr);
    return convertToToon(obj, 0);
  } catch {
    return "⚠️ Invalid JSON format";
  }
}

function convertToToon(obj, indent = 0) {
  const space = "  ".repeat(indent);

  if (Array.isArray(obj)) {
    // Para arrays: key[n]: item1, item2, item3
    const arrValues = obj.map(formatValue).join(",");
    return `[${obj.length}]: ${arrValues}`;
  } else if (typeof obj === "object" && obj !== null) {
    // Para objetos: cada key en nueva línea con indentación
    return Object.entries(obj)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${space}${key}[${value.length}]: ${value.map(formatValue).join(",")}`;
        } else if (typeof value === "object" && value !== null) {
          return `${space}${key}:\n${convertToToon(value, indent + 1)}`;
        } else {
          return `${space}${key}: ${formatValue(value)}`;
        }
      })
      .join("\n");
  } else {
    return formatValue(obj);
  }
}

// ==============================
// 🧮 Formatear valores
// ==============================
function formatValue(val) {
  if (typeof val === "string") {
    // Colocar comillas si tiene espacios o es URL
    if (val.includes(" ") || val.includes("://")) {
      return `"${val}"`;
    }
    return val;
  } else {
    return val;
  }
}

// ==============================
// 🧮 Contar tokens
// ==============================
function countTokens(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ==============================
// 📊 Actualización en tiempo real
// ==============================
function updateComparison() {
  const jsonText = jsonInput.value.trim();

  const toonText = jsonToToon(jsonText);
  toonOutput.value = toonText;

  let jsonTokens = 0;
  let toonTokens = 0;

  if (jsonText && !toonText.includes("Invalid") && !toonText.includes("Waiting")) {
    jsonTokens = countTokens(jsonText);
    toonTokens = countTokens(toonText);
  }

  jsonTokensEl.textContent = jsonTokens;
  toonTokensEl.textContent = toonTokens;

  if (jsonTokens > 0 && toonTokens > 0) {
    const savings = ((1 - toonTokens / jsonTokens) * 100).toFixed(1);
    savingsEl.textContent = `${savings}%`;
  } else {
    savingsEl.textContent = "—";
  }
}

// ==============================
// 🚀 Eventos
// ==============================
jsonInput.addEventListener("input", updateComparison);

// Ejecutar al cargar
updateComparison();