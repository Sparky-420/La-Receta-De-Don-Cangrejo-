# 🥩 La Receta de Don Cangrejo - Longaniza Pro MX

Aplicación móvil profesional de **charcutería de precisión, costeo financiero (escandallo), trazabilidad en planta y laboratorio de premix de curado**, inspirada en la experiencia visual de **Android 16 (Material 3 Expressive)**.

Unifica y supera las capacidades de los dos proyectos previos (`ChupaChups` y `Recette`).

---

## ✨ Características Principales

### 1. ⚖️ Control de Lote Activo (Producción)
- **Selector de Peso Táctil para Taller:** Ajuste visual monumental con botones grandes (`−` / `+`) y accesos rápidos (`+1 kg`, `+5 kg`, `+10 kg`, `+20 kg`, `50 kg`) pensados para manos húmedas o con guantes.
- **Selector de Recetas Maestras:**
  - **Receta Actual (Predeterminada):** Guajillo (1.5%), Pimentón (0.4%), FABPSA (0.6%), Ajo fresco (exactamente 0.6% = 120 g por cada 20 kg de carne limpia), Agua helada Fase 2 (5%), Premix Fase 1 (17 g/kg).
  - **Receta del Viejo (Alternativa):** Guajillo (1.5%), Pimentón (0.2%), FABPSA (0.4%), Ajo fresco (0.5%), Agua helada (5%), Premix (17 g/kg).
  - **Receta Personalizada:** Guarda tus propias variantes.
- **Desglose Dinámico en Tiempo Real:** Gramos y kilogramos exactos por ingrediente con cálculo de masa total final estimada.

### 2. 🧂 Laboratorio de Premix de Curado
- **Fórmula Maestra al 100%:** Sal común (85%), Sal de cura (4%) y Azúcar estándar (11%). Candado de seguridad que valida que la suma sea obligatoriamente 100%.
- **Doble Modo:**
  - *Dosificación para lote de carne*: calcula la cantidad exacta según los kilos de carne.
  - *Fabricación a granel*: calcula el pesaje exacto de insumos para preparar botes o baldes (ej. 1 kg, 5 kg, 10 kg).

### 3. 💰 Escandallo y Finanzas de Taller
- Catálogo de precios configurables en **Pesos Mexicanos (MXN)**: carne de cerdo limpia, tripa por pieza, especias, aditivos y sal de cura.
- Métricas financieras automáticas:
  - Costo total del lote.
  - Costo real por kg de producto terminado (considerando el rendimiento del agua y sólidos).
  - Utilidad neta total y margen de ganancia porcentual frente al precio de venta sugerido.

### 4. 📋 Checklist de Planta y Trazabilidad
- Secuencia interactiva de 7 pasos de control de calidad.
- Historial persistente local de cada molienda/lote procesado.
- Botón para **compartir ticket de producción formateado directamente por WhatsApp** o imprimir en miniprinter térmica.

---

## 📱 Cómo obtener e instalar el APK en Android

Este repositorio tiene configurado un flujo de integración continua con **GitHub Actions** en `.github/workflows/android-debug-apk.yml`.

1. Ve a la pestaña **Actions** en este repositorio de GitHub.
2. Selecciona la ejecución más reciente del workflow **Compilar APK Android (Debug)**.
3. En la sección inferior **Artifacts**, descarga el archivo comprimido **`la-receta-de-don-cangrejo-apk`**.
4. Descomprímelo en tu teléfono Android e instala el archivo `.apk` directamente.

---

## 🧪 Pruebas Unitarias

Para verificar la exactitud de todas las fórmulas y cálculos matemáticos:

```bash
npm test
```

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Compilar web assets a dist/
npm run build

# Sincronizar con el proyecto Android nativo (Capacitor)
npm run cap:sync

# Compilar APK localmente (requiere Android SDK y Java 21)
npm run android:debug
```
