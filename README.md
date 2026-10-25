# 旅語 TabiGo — Japonés Básico y de Supervivencia Paso a Paso

**TabiGo (旅語)** es una aplicación web interactiva construida con **Astro 5** y **TypeScript**, diseñada para hispanohablantes que desean aprender japonés práctico desde cero para viajar por Japón. Combina una estética minimalista inspirada en **Google Material Design 3** y la papelería tradicional japonesa (**papel Washi, tinta Sumi y sellos Goshuin**), con **modo claro/oscuro adaptable** y diseño **100 % responsive** para móvil y escritorio.

---

## ✨ Características Principales

### 🧭 Navegación Intuitiva en 3 Pasos Desplegables + Menú Hamburguesa
- **Inicio minimalista**: Vista principal limpia con resumen de dominio en tiempo real (*Dominadas*, *En progreso*, *Por fortalecer*) y acceso directo mediante acordeones desplegables.
- **Menú lateral deslizable (`☰`)**: Permite saltar en cualquier momento entre los 3 pasos y sus 7 subactividades, abrir el pasaporte de progreso, exportar/importar tu fichero `.json` o alternar entre **Modo Claro y Modo Oscuro**.

---

### 🗣️ Paso 1 · Hablar y Vocabulario

1. **🧱 1A · Constructor de Frases y Reto de Orden Gramatical (`PhraseBuilder.astro`)**
   - **4 niveles progresivos** (*Nivel 0 · Intro*, *Nivel 1 · Básico*, *Nivel 2 · Intermedio*, *Nivel 3 · Avanzado*).
   - **Modo Construir**: Combina bloques sintácticos japoneses (Tema `は`, Objeto `を`, Destino `へ/に`, Lugar `で`, Petición `ください`, Causa `から`, Permiso `てもいいですか`) con desglose fonético adaptado al español.
   - **Modo Reto (Ordenar bloques)**: 19 desafíos interactivos para reconstruir oraciones japonesas desordenadas.
   - **Modo Cartel Gigante** para mostrar la frase en pantalla durante el viaje y **práctica de pronunciación con micrófono**.

2. **🖼️ 1B · Palabras Comunes Ilustradas (`VisualCommonWords.astro`)**
   - **80 palabras esenciales de viaje** (`20` por cada uno de los 4 niveles) acompañadas de **ilustraciones vectoriales SVG personalizadas**.
   - **Modo Flashcard 1 a 1** con interruptores de estudio activo:
     - 🙈 **Estudiar sin ver** (oculta el significado hasta pulsar *Mostrar respuesta*).
     - 🔡 **Mostrar/Ocultar escrituras** (*Hiragana / Katakana / Kanji y Romaji*).
     - 🧠 **Asociación mnemotécnica** visual y fonética para recordar cada palabra al instante.
   - Navegación inferior con círculos numerados (`1–20`) perfectamente alineados y filtros por categoría o estado de memoria.

3. **🎵 1C · Expresiones y Melodía (`VocabDeck.astro`)**
   - **28 expresiones imprescindibles** (*7 por nivel*) organizadas en *Cortesía*, *Restaurante/Izakaya*, *Transporte/JR*, *Konbini/Compras* y *Emergencia*.
   - **Diagrama visual de Acento Tonal (Pitch Accent)** que muestra qué sílabas suenan graves (`L`) o agudas (`H`).
   - Consejos culturales reales de protocolo en Japón.

---

### 🖌️ Paso 2 · Leer y Escribir

4. **📊 2A · Tabla Dinámica Hiragana · Katakana · Romaji (`DynamicKanaTable.astro`)**
   - Tabla interactiva completa con sonidos puros (*Gojūon*) y sonoros (*Dakuten / Handakuten*) filtrable por niveles (`Intro` a `Nivel 3`).
   - Alterna entre vista combinada **Hiragana + Katakana**, solo Hiragana, solo Katakana y modo **Sin Romaji**.
   - **🎧 Reto del Oído (Sin Pistas)**: Escucha un kana nativo y encuéntralo en el tablero mezclado sin ayudas de Romaji.

5. **🖌️ 2B · Dojo de Caligrafía y Carteles Callejeros (`CalligraphyDojo.astro`)**
   - **16 caracteres esenciales** divididos en *Hiragana*, *Katakana de menús* (`ラーメン`, `トイレ`, `ホテル`, `コーヒー`, `ビール`, `タクシー`, `パン`) y *Kanji de supervivencia en la calle* (`入口` Entrada, `出口` Salida, `駅` Estación, `男/女` Baños, `円` Yenes).
   - Lienzo `<canvas>` interactivo con trazo dinámico de pincel *Shodō* y guía SVG animada del orden de trazos.

---

### ⛩️ Paso 3 · Practicar en Viaje

6. **⛩️ 3A · Simulador de Viaje (`TravelSimulator.astro`)**
   - **4 escenarios conversacionales reales** graduados por nivel:
     1. 🏪 *Compra en el Konbini 7-Eleven* (Nivel 0 · Intro)
     2. 🍜 *Pidiendo en un Izakaya / Barra de Ramen* (Nivel 1 · Básico)
     3. 🚅 *Reservando asiento en el Shinkansen en Tokio* (Nivel 2 · Intermedio)
     4. ♨️ *Check-in tradicional en un Ryokan de Kioto* (Nivel 3 · Avanzado)
   - Incluye **Modo Oído** (difumina las traducciones al español) y práctica con micrófono en cada paso.

7. **⚡ 3B · Reto Expreso Yamanote y Flashcards Zen (`QuickMinigame.astro`)**
   - **Quiz de velocidad adaptativo**: Prioriza inteligentemente las palabras y expresiones que tienes marcadas como *Por fortalecer*.
   - **Flashcards Zen 3D**: Tarjetas giratorias filtrables por nivel para repaso rápido.

---

## 📕 Gamificación: 24 Sellos Goshuin, 12 Rangos XP y Memoria JSON

- **Álbum Goshuincho (`24 sellos`)**: Colecciona los 24 sellos tradicionales rojos (*Hanko / Goshuin*) filtrables por paso (*Paso 1 · Hablar*, *Paso 2 · Escritura*, *Paso 3 · Viaje*) al superar niveles, dominar vocabulario, acertar retos de oído, trazar caligrafía o encadenar combos en el Expreso Yamanote.
- **Escalera de 12 Niveles de Rango (`0` a `5.000+ XP`)**:
  1. 🌱 `Nv. 1 · Turista Curioso` (0 XP)
  2. 🍙 `Nv. 2 · Explorador de Konbini` (100 XP)
  3. ⛩️ `Nv. 3 · Caminante de Kioto` (250 XP)
  4. 🍜 `Nv. 4 · Habitual del Izakaya` (450 XP)
  5. 🏮 `Nv. 5 · Viajero de Asakusa` (700 XP)
  6. 🚅 `Nv. 6 · Viajero del Shinkansen` (1.000 XP)
  7. 🌸 `Nv. 7 · Conocedor del Hanami` (1.400 XP)
  8. ♨️ `Nv. 8 · Huésped del Ryokan` (1.900 XP)
  9. 🖌️ `Nv. 9 · Discípulo del Shodō` (2.500 XP)
  10. 🗾 `Nv. 10 · Guía de Japón` (3.200 XP)
  11. 🗻 `Nv. 11 · Sabio del Fuji` (4.000 XP)
  12. 🏯 `Nv. 12 · Leyenda de Nihon` (5.000+ XP)
- **Persistencia y Portabilidad JSON**:
  - Guarda automáticamente tu progreso en `localStorage` y en `storage/user-progress.json` (`/api/progress`).
  - Permite **descargar tu progreso en un fichero `.json`** y **volver a subirlo** en cualquier otro dispositivo.

---

## 🔊 Motor de Audio Japonés y Práctica con Micrófono

- **Síntesis de voz japonesa multicapa**:
  1. Endpoint propio `/api/tts` (proxy con caché en memoria y cabeceras CDN para voz neuronal japonesa a velocidad normal `1.0x` y lenta `0.6x`).
  2. Respaldo directo con motores de diccionario japonés y `Web Speech API` (`ja-JP`).
- **Evaluación de pronunciación**: Graba tu voz con `MediaRecorder`, detecta fonética con `SpeechRecognition` (si el navegador lo soporta) y reproduce **tu grabación seguida inmediatamente del hablante nativo** para comparar entonación.

---

## 📁 Estructura del Proyecto

```text
AppJapones/
├── api/
│   ├── tts.js                      # Función Serverless Vercel para voz japonesa (/api/tts)
│   └── progress.js                 # Función Serverless Vercel para progreso JSON (/api/progress)
├── public/
│   └── favicon.svg                 # Icono de la aplicación
├── src/
│   ├── components/
│   │   ├── HeaderGamification.astro # Barra superior, menú hamburguesa, modo oscuro y modal de 24 sellos
│   │   ├── PhraseBuilder.astro      # Paso 1A: Constructor gramatical y reto de ordenar bloques
│   │   ├── VisualCommonWords.astro  # Paso 1B: 80 palabras comunes ilustradas con SVG
│   │   ├── VocabDeck.astro          # Paso 1C: 28 expresiones con acento tonal
│   │   ├── DynamicKanaTable.astro   # Paso 2A: Tabla Hiragana/Katakana y reto del oído
│   │   ├── CalligraphyDojo.astro    # Paso 2B: Lienzo Shodō y trazos animados
│   │   ├── TravelSimulator.astro    # Paso 3A: 4 simulaciones interactivas de viaje
│   │   └── QuickMinigame.astro      # Paso 3B: Quiz Expreso Yamanote y Flashcards Zen
│   ├── data/
│   │   └── japaneseData.ts          # Base de datos completa (gramática, 80 palabras SVG, kana, diálogos)
│   ├── layouts/
│   │   └── Layout.astro             # Variables de diseño Material/Washi, fuentes y soporte Dark Mode
│   ├── pages/
│   │   └── index.astro              # Vista principal con los 3 pasos desplegables y espacio de trabajo
│   └── scripts/
│       └── appClient.ts             # Lógica cliente, audio TTS, gamificación, filtros y memoria JSON
├── storage/
│   └── user-progress.json           # Almacenamiento local en disco del progreso del usuario
├── astro.config.mjs                 # Configuración de Astro + middleware local
├── server.mjs                       # Servidor autónomo Node.js con compresión Gzip
├── vercel.json                      # Configuración de despliegue en Vercel
└── package.json                     # Scripts y dependencias
```

---

## 🚀 Instalación, Ejecución y Despliegue

```bash
# 1. Instalar dependencias
npm install

# 2. Modo desarrollo local (http://localhost:4321)
npm run dev

# 3. Compilar para producción y levantar servidor optimizado (http://localhost:4325)
npm run serve

# 4. Desplegar en producción en Vercel
npm run deploy
```
