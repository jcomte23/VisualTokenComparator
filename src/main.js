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
    // Si el array contiene objetos y todas tienen las mismas claves
    if (obj.length > 0 && typeof obj[0] === "object" && !Array.isArray(obj[0])) {
      const keys = Object.keys(obj[0]);
      const header = `[${obj.length}]{${keys.join(",")}}:`;
      const rows = obj
        .map(item => keys.map(k => formatValue(item[k])).join(","))
        .map(line => `${space}  ${line}`)
        .join("\n");
      return `${header}\n${rows}`;
    } else {
      // Array simple de valores
      const values = obj.map(formatValue).join(",");
      return `[${obj.length}]: ${values}`;
    }
  } else if (typeof obj === "object" && obj !== null) {
    // Objetos anidados
    return Object.entries(obj)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${space}${key}: ${convertToToon(value, indent + 1)}`;
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