import './style.css'

// ==============================
// 🧩 Elementos del DOM
// ==============================
const jsonInput = document.getElementById("json-input");
const toonOutput = document.getElementById("toon-input");
const jsonTokensEl = document.getElementById("json-tokens");
const toonTokensEl = document.getElementById("toon-tokens");
const savingsEl = document.getElementById("savings-value");
const resultEl = document.getElementById("result");

const btnTestJSON = document.getElementById("btn-test-json");
const btnTestTOON = document.getElementById("btn-test-toon");

// Variables globales para almacenar tokens
let jsonTokens = 0;
let toonTokens = 0;

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

function formatValue(val) {
  if (typeof val === "string") {
    if (val.includes(" ") || val.includes("://")) return `"${val}"`;
    return val;
  } else return val;
}

// ==============================
// 🧠 Llamada a Gemini API
// ==============================
// ==============================
// 🧠 Llamada a Gemini API correcta
// ==============================
async function geminiApiCall(payload) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": import.meta.env.VITE_GEMINI_API_KEY  // <- aquí va tu llave
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: payload }  // tu JSON o TOON
            ]
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Gemini raw response:", data);

    // Ajusta según cómo Google devuelve los tokens
    const tokens = data?.metadata?.tokenUsage?.totalTokens ?? 0;

    return { tokens };

  } catch (err) {
    console.error("Error calling Gemini API:", err);
    return { tokens: 0 };
  }
}


// ==============================
// 🚀 Función: Test JSON
// ==============================
async function testJSON() {
  const jsonText = jsonInput.value.trim();
  if (!jsonText) {
    toonOutput.value = "⚠️ No JSON input provided";
    return;
  }

  toonOutput.value = "⏳ Processing JSON...";
  try {
    const response = await geminiApiCall(jsonText);
    jsonTokens = response.tokens;

    jsonTokensEl.textContent = jsonTokens;
    toonOutput.value = "✅ JSON test completed";

    updateSavings();
  } catch (err) {
    toonOutput.value = "❌ Error JSON: " + err.message;
  }
}

// ==============================
// 🚀 Función: Test TOON
// ==============================
async function testTOON() {
  const jsonText = jsonInput.value.trim();
  if (!jsonText) {
    toonOutput.value = "⚠️ No JSON input provided";
    return;
  }

  const toonText = jsonToToon(jsonText);
  toonOutput.value = "⏳ Processing TOON...";

  try {
    const response = await geminiApiCall(toonText);
    toonTokens = response.tokens;

    toonTokensEl.textContent = toonTokens;
    toonOutput.value = toonText;

    updateSavings();
  } catch (err) {
    toonOutput.value = "❌ Error TOON: " + err.message;
  }
}

// ==============================
// 🔹 Actualizar ahorro
// ==============================
function updateSavings() {
  if (jsonTokens > 0 && toonTokens > 0) {
    const tokensSaved = jsonTokens - toonTokens;
    const percentSaved = ((tokensSaved / jsonTokens) * 100).toFixed(1);

    resultEl.textContent = tokensSaved;
    savingsEl.textContent = `${percentSaved}%`;

    resultEl.classList.toggle("text-green-600", tokensSaved > 0);
    resultEl.classList.toggle("text-red-600", tokensSaved <= 0);
  }
}

// ==============================
// 🎯 Eventos botones
// ==============================
btnTestJSON.addEventListener("click", testJSON);
btnTestTOON.addEventListener("click", testTOON);