import './style.css'

// ==============================
// 🧩 Elementos del DOM
// ==============================
const jsonInput = document.getElementById("json-input");
const toonOutput = document.getElementById("toon-input");
const jsonTokensEl = document.getElementById("json-tokens");
const toonTokensEl = document.getElementById("toon-tokens");
const savingsEl = document.getElementById("savings-value");
const startButton = document.getElementById("btn-start-comparison");
const resultEl = document.getElementById("result");

// 🧩 Verificación inicial
const elements = { jsonInput, toonOutput, jsonTokensEl, toonTokensEl, savingsEl, startButton, resultEl };
for (const [key, el] of Object.entries(elements)) {
  if (!el) console.warn(`⚠️ Elemento faltante en el DOM: ${key}`);
}

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
    if (obj.length > 0 && typeof obj[0] === "object" && !Array.isArray(obj[0])) {
      const keys = Object.keys(obj[0]);
      const header = `[${obj.length}]{${keys.join(",")}}:`;
      const rows = obj
        .map(item => keys.map(k => formatValue(item[k])).join(","))
        .map(line => `${space}  ${line}`)
        .join("\n");
      return `${header}\n${rows}`;
    } else {
      const values = obj.map(formatValue).join(",");
      return `[${obj.length}]: ${values}`;
    }
  } else if (typeof obj === "object" && obj !== null) {
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
    if (val.includes(" ") || val.includes("://")) {
      return `"${val}"`;
    }
    return val;
  } else {
    return val;
  }
}

// ==============================
// 🧠 Simulación de API real (mock)
// ==============================
async function mockApiCall(payload) {
  await new Promise(res => setTimeout(res, 500));
  const tokens = Math.floor(payload.split(/\s+/).filter(Boolean).length * 1.3);
  return { tokens };
}

// ==============================
// 🚀 Función principal del botón
// ==============================
async function startComparison() {
  const jsonText = jsonInput.value.trim();
  if (!jsonText) {
    toonOutput.value = "⚠️ No JSON input provided";
    return;
  }

  toonOutput.value = "⏳ Processing...";
  resultEl.textContent = "…";

  try {
    const toonText = jsonToToon(jsonText);
    toonOutput.value = toonText;

    if (toonText.includes("Invalid") || toonText.includes("Waiting")) {
      toonOutput.value = toonText;
      return;
    }

    const jsonResponse = await mockApiCall(jsonText);
    const toonResponse = await mockApiCall(toonText);

    const jsonTokens = jsonResponse.tokens;
    const toonTokens = toonResponse.tokens;

    const tokensSaved = jsonTokens - toonTokens;
    const percentSaved = ((tokensSaved / jsonTokens) * 100).toFixed(1);

    jsonTokensEl.textContent = jsonTokens;
    toonTokensEl.textContent = toonTokens;
    savingsEl.textContent = `${percentSaved}%`;
    resultEl.textContent = tokensSaved;

    resultEl.classList.toggle("text-green-600", tokensSaved > 0);
    resultEl.classList.toggle("text-red-600", tokensSaved <= 0);
  } catch (err) {
    toonOutput.value = "❌ Error during comparison: " + err.message;
    resultEl.textContent = "—";
  }
}

// ==============================
// 🎯 Evento: clic en el botón
// ==============================
if (startButton) {
  startButton.addEventListener("click", startComparison);
}