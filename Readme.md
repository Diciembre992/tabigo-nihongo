# 旅語 TabiGo — Japonés Básico y de Supervivencia para Viajeros (Astro)

Aplicación web interactiva construida con **Astro** y estética minimalista tradicional japonesa (**papel Washi, tinta Sumi y sellos rojos Hanko/Goshuin**) enfocada en hispanohablantes que quieren aprender japonés práctico para viajar.

## ✨ Módulos y Ganchos Interactivos

1. **🏮 Constructor Rápido de Frases de Viaje (`PhraseBuilder.astro`)**
   - Combina intenciones cotidianas (*¿Dónde está...?*, *Me da..., por favor*, *¿Cuánto cuesta...?*, *Quiero ir a...*) con vocabulario clave (*Baño, Estación, Ramen, Agua, Menú en inglés, Kioto, Aeropuerto*).
   - Incluye guía fonética adaptada al español, modo cartel grande para mostrar en pantalla y práctica de audio a velocidad normal (`1.0x`), lenta (`0.6x`) y evaluación con micrófono.

2. **🗣️ Vocabulario con Melodía de Acento Tonal (`VocabDeck.astro`)**
   - 15 expresiones esenciales divididas por categorías (*Cortesía*, *Restaurante/Izakaya*, *Transporte/JR*, *Konbini/Compras*, *Emergencia*).
   - **Diagrama visual de Acento Tonal (Pitch Accent)** para entender qué moras suenan agudas o graves.
   - Síntesis de voz nativa japonesa (`Web Speech API`) y reconocimiento de voz (`SpeechRecognition` en `ja-JP`) con autoevaluación guiada.

3. **⛩️ Simulador de Situaciones Reales (`TravelSimulator.astro`)**
   - Conversaciones interactivas paso a paso: *Compra Nocturna en el Konbini*, *Cena en Barra de Ramen / Izakaya* y *Rumbo a Kioto en la Estación JR*.
   - Incluye **Modo Oído** (oculta la traducción en español para entrenar la comprensión auditiva) y recompensa con sellos tradicionales.

4. **🖌️ Dojo de Escritura y Carteles Callejeros (`CalligraphyDojo.astro`)**
   - Cubre **Hiragana básico**, **Katakana de menús** (`ラーメン`, `トイレ`, `ホテル`, `コーヒー`) y **Kanji de carteles reales** (`入口` Entrada, `出口` Salida, `男/女` Baños Hombres/Mujeres, `円` Yenes).
   - Lienzo `<canvas>` interactivo estilo pincel *Shodō* sobre cuadrícula japonesa con guía animada de orden de trazos en SVG.

5. **⚡ Reto Expreso Yamanote, Flashcards Zen y Goshuincho (`QuickMinigame.astro` & `HeaderGamification.astro`)**
   - Sistema de rachas diarias (🔥), niveles de viajero, misiones diarias y pasaporte **Goshuincho (御朱印帳)** de 6 sellos coleccionables guardados en `localStorage`.

## 🚀 Cómo ejecutar el proyecto

```bash
npm install
npm run dev
```

