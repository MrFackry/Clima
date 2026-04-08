# ☁️ Clima App

Consulta el clima de cualquier ciudad del mundo en tiempo real\
**Sin API key • Sin registro • 100% gratuito**

------------------------------------------------------------------------

## 📌 Resumen del proyecto

**Clima App** es una aplicación web ligera que permite consultar las
condiciones meteorológicas actuales de cualquier ciudad del mundo.
Utiliza la API pública **wttr.in**, lo que elimina la necesidad de
autenticación o configuraciones complejas.

Está diseñada para ser rápida, accesible y fácil de usar tanto en
escritorio como en dispositivos móviles.

------------------------------------------------------------------------

## 🚀 Funcionalidades

-   🔍 Búsqueda de clima por nombre de ciudad
-   🌡️ Temperatura actual y sensación térmica en °C
-   💧 Información de humedad
-   🌬️ Velocidad del viento
-   👁️ Visibilidad
-   🌥️ Descripción del clima en español
-   😊 Íconos emoji según condición meteorológica
-   ⚠️ Manejo de errores con mensajes descriptivos
-   📱 Diseño responsivo (mobile + desktop)
-   ⌨️ Soporte para búsqueda con tecla Enter

------------------------------------------------------------------------

## 🛠️ Tecnologías utilizadas

-   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
-   **API:** wttr.in (API pública sin autenticación)
-   **Fuentes:** Google Fonts (Syne y DM Sans)

------------------------------------------------------------------------

## 📁 Estructura del proyecto

weather-app/ 
│ 
├── index.html\
├── src/ 
│ ├── CSS/ 
│ │ └── style.css\
│ └── JS/ 
│   └── main.js\
└── Test/
  └── test.js

------------------------------------------------------------------------

## ⚙️ Instalación

No requiere instalación de dependencias ni backend.

### 1. Clonar el repositorio

git clone https://github.com/MrFackry/Clima.git cd weather-app

### 2. Ejecutar la aplicación

-   Abrir index.html en el navegador\
-   O usar Live Server en VS Code

------------------------------------------------------------------------

## ▶️ Guía de uso

1.  Escribe el nombre de una ciudad\
2.  Presiona Buscar o Enter\
3.  Visualiza el clima en segundos

------------------------------------------------------------------------

## 🌐 API utilizada

GET https://wttr.in/{ciudad}?format=j1

------------------------------------------------------------------------

## 🧪 Ejemplo de resultados

Entrada: Bogotá

Salida: - Temperatura: 18°C\
- Sensación térmica: 17°C\
- Humedad: 70%\
- Viento: 10 km/h\
- Visibilidad: 10 km\
- Estado: Parcialmente nublado 🌤️

------------------------------------------------------------------------

## 🧪 Pruebas

Ubicación: Test/test.js

Ejecutar: 1. Abrir app\
2. F12 → Console\
3. Escribir: allow pasting\
4. Pegar test.js\
5. Enter

------------------------------------------------------------------------

## ⚠️ Limitaciones conocidas

-   Dependencia de wttr.in\
-   Traducción no siempre disponible\
-   Sin pronóstico extendido\
-   Pruebas manuales

------------------------------------------------------------------------

## 🔮 Mejoras futuras

-   Pronóstico extendido\
-   Geolocalización\
-   Mejor UI/UX\
-   Tests automatizados\
-   Modo oscuro

------------------------------------------------------------------------

## 📄 Licencia

MIT License

------------------------------------------------------------------------

## ❤️ Créditos

Construido con ☁️ usando wttr.in
