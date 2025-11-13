import { encode } from '@toon-format/toon';
import { showErrorToast, showSuccessToast } from './alerts';
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
// 🧩 Convertir JSON → TOON con librería oficial
// ==============================
jsonInput.addEventListener("input", () => {
  const jsonText = jsonInput.value.trim();
  console.log(jsonText);
  

  if (!jsonText) {
    toonOutput.value = "🪶 Waiting for JSON input...";
    return;
  }

  try {
    const obj = JSON.parse(jsonText);
    console.log(obj);
    
    const toon = encode(obj);
    toonOutput.value = toon;
 
  } catch (err) {
    toonOutput.value = "⚠️ Invalid JSON format";
  }
});

// ==============================
// 🔁 Función auxiliar 
// ==============================
function jsonToToon(jsonStr) {
  if (jsonStr.trim() === "") return "🪶 Waiting for JSON input...";
  try {
    const obj = JSON.parse(jsonStr);
    return encode(obj);
  } catch (err) {
    console.error("Error converting JSON to TOON:", err);
    return "⚠️ Invalid JSON format";
  }
}

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
        "X-Goog-Api-Key": import.meta.env.VITE_GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: payload }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    // ⚠️ 1️⃣ Verificar si la respuesta HTTP fue exitosa
    if (!response.ok) {
      const errorMsg = data?.error?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      showErrorToast(`Gemini API call failed`);
      throw new Error(errorMsg);
    }

    // ⚠️ 2️⃣ Verificar si el JSON trae un campo de error interno
    if (data?.error) {
      showErrorToast(`Gemini API call failed`);
      throw new Error(data.error.message || "Unknown API error");
    }

    // ✅ Extraemos los tokens correctamente
    const tokens = data?.usageMetadata?.promptTokenCount ?? 0;

    showSuccessToast("Gemini API call successful!");
    return { tokens };

  } catch (err) {
    console.error("Error calling Gemini API:", err);
    return { tokens: 0 };
  }
}

// ==============================
// 🔘 Control de estado del botón
// ==============================
function toggleButtonLoading(button, isLoading, originalText) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = originalText;
    button.innerHTML = `<span class="loading-spinner"></span>Processing...`;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || originalText;
  }
}

// ==============================
// 🚀 Función: Test JSON
// ==============================
async function testJSON() {
  const jsonText = jsonInput.value.trim();

  if (!jsonText) {
    showErrorToast("No JSON input provided ❌");
    return;
  }

  // ⏳ Activamos el estado de carga del botón
  toggleButtonLoading(btnTestJSON, true, "Run Test");

  try {
    // 🧠 1. Intentamos convertir el texto en objeto JSON
    const obj = JSON.parse(jsonText);

    // 🧹 2. Lo volvemos a convertir en un JSON comprimido (sin espacios ni saltos)
    const compactJson = JSON.stringify(obj);

    // 🚀 3. Enviamos este JSON limpio a la API
    const response = await geminiApiCall(compactJson);

    // 📊 4. Actualizamos los tokens
    jsonTokens = response.tokens;
    jsonTokensEl.textContent = jsonTokens;

    // ✅ 5. Mostramos toast de éxito y actualizamos ahorros
    showSuccessToast("JSON sent successfully ✅");
    updateSavings();

  } catch (err) {
    // ❌ Error si el JSON no es válido o la API falla
    showErrorToast("❌ Invalid JSON or server error, check the console");
    console.error("Error in testJSON:", err);
  } finally {
    // 🔁 Restauramos el botón a su estado original
    toggleButtonLoading(btnTestJSON, false, "Run Test");
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
  toggleButtonLoading(btnTestTOON, true, "Run Test");

  try {
    const response = await geminiApiCall(toonText);
    toonTokens = response.tokens;

    toonTokensEl.textContent = toonTokens;
    toonOutput.value = toonText;

    updateSavings();
  } catch (err) {
    toonOutput.value = "❌ Error TOON: " + err.message;
  } finally {
    toggleButtonLoading(btnTestTOON, false, "Run Test");
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