# 🧠 Visual Token Comparator

Visual Token Comparator es una herramienta web desarrollada para comparar el consumo de tokens entre los formatos JSON y TOON al interactuar con modelos de lenguaje (LLMs).
El propósito principal del proyecto es evaluar de forma práctica y visual la eficiencia del formato TOON frente a JSON, comprobando si realmente logra reducir el uso de tokens y, por tanto, optimizar costos en aplicaciones que hacen uso intensivo de inteligencia artificial.

## ⚙️ Tecnologías utilizadas

+ HTML, CSS, JavaScript: base del proyecto.
+ TailwindCSS: sistema de estilos para una interfaz ligera, modular y responsiva.
+ Vite: bundler rápido para desarrollo y compilación.
+ Gemini (Google AI): modelo LLM utilizado para medir consumo real de tokens.
+ NodeJS: configuración ligera sin frameworks adicionales.


## 🧩 Arquitectura y funcionamiento
El flujo principal del proyecto sigue esta estructura:

El usuario ingresa un JSON de entrada en el panel principal.
Se envía la solicitud al modelo Gemini, y se obtiene el consumo de tokens.
El mismo contenido se convierte automáticamente al formato TOON.
Se repite la solicitud con el nuevo formato.
La aplicación muestra una comparación visual de ambos consumos en tiempo real.

Diagrama simplificado:
```
Usuario → JSON Input → Gemini (API)
             ↓
       Conversión a TOON
             ↓
      Gemini (API) → Resultados Comparativos
```

## 📁 Estructura del proyecto
```
📦 visual-token-comparator
├── index.html
├── /src
│   ├── main.js/
│   ├── style.css/
└── README.md
```

## ⚡ Instalación y ejecución
### 1️⃣ Clonar el repositorio
```
git clone https://github.com/jcomte23/visual-token-comparator.git
cd visual-token-comparator
```
### 2️⃣ Instalar dependencias
```
npm install
```
### 3️⃣ Ejecutar entorno de desarrollo
```
npm run dev
```

### 4️⃣ Abrir en el navegador
```
http://localhost:5173
```
## 🧠 Conceptos clave
### JSON
Formato estándar para la comunicación entre APIs. Fácil de leer, estructurado y ampliamente compatible.
### TOON
Formato optimizado para la interacción con modelos de lenguaje (LLMs). Su estructura permite una mayor compresión semántica, reduciendo el número de tokens consumidos por el modelo.
### Token Consumption
Cada LLM (como Gemini, GPT o Claude) cobra por cantidad de tokens procesados. Reducir tokens implica menor costo de procesamiento y mayor eficiencia.

## 📊 Resultados
Durante las pruebas con Gemini (Google AI Studio), se evidenció una reducción significativa en el consumo de tokens al usar TOON frente a JSON.
Esto confirma que TOON puede representar una mejora real en proyectos que hacen uso intensivo de modelos de lenguaje, especialmente en escenarios de alta concurrencia o gran volumen de datos.