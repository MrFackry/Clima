const inputCiudad = document.getElementById('ciudad');
const btnBuscar   = document.getElementById('buscar');
const resultado   = document.getElementById('resultado');
const CACHE_KEY = 'weatherCache';
const TTL = 30 * 60 * 1000; // 30 minutos

//normalizar ciudad para cache (minúsculas, sin acentos)
function normalizarCiudad(ciudad) {
  return ciudad
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita acentos
}

async function buscarClima(ciudad) {
  if (!ciudad.trim()) return;

  const ciudadKey = normalizarCiudad(ciudad);;

  // 🔹 1. Intentar obtener desde cache
  const cacheData = obtenerClimaCache(ciudadKey);

 if (cacheData) {
  const clima = parsearClima(cacheData, ciudad);
  renderClima(clima, true);
  return;
}
  btnBuscar.disabled = true;
  resultado.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Buscando clima...</p>
    </div>`;

  try {
    const url = `https://wttr.in/${encodeURIComponent(ciudad)}?format=j1`;
    const res = await fetch(url);

    if (!res.ok) throw new Error('Ciudad no encontrada');

    const data = await res.json();

    // 🔹 2. Guardar en cache
    guardarClimaCache(ciudadKey, data);

    mostrarClima(data, ciudad);
  } catch (err) {
    resultado.innerHTML = `
      <div class="error-msg">
        ⚠️ ${err.message || 'No se pudo obtener el clima'}
      </div>`;
  } finally {
    btnBuscar.disabled = false;
  }
}
//funcion para escapar caracteres especiales en HTML y evitar inyección de código
function escaparHTML(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

function mostrarError(msg) {
  resultado.innerHTML = `<div class="error-msg">⚠️ ${escaparHTML(msg)}</div>`;
}
// función para parsear la respuesta de wttr.in y extraer los datos relevantes, manejando casos donde algunos datos pueden no estar disponibles
function parsearClima(data, ciudadBuscada) {
  const current = data.current_condition?.[0];
  if (!current) return null;

  const nearest = data.nearest_area?.[0];

  const {
    temp_C,
    FeelsLikeC,
    humidity,
    windspeedKmph,
    visibility,
    weatherCode
  } = current;

  const nombre = nearest?.areaName?.[0]?.value || ciudadBuscada;
  const pais   = nearest?.country?.[0]?.value || '';

  const descripcion =
    current.lang_es?.[0]?.value ||
    current.weatherDesc?.[0]?.value ||
    'Sin descripción';

  const codigo = Number(weatherCode);

  return {
    nombre,
    pais,
    temp: temp_C ?? '--',
    sensacion: FeelsLikeC ?? '--',
    humedad: humidity ?? '--',
    viento: windspeedKmph ?? '--',
    visibilidad: visibility ?? '--',
    descripcion,
    codigo
  };
}

// función para mostrar el clima formateado en el DOM, usando los datos parseados y mapeando el código WMO a un emoji representativo del clima
function renderClima(clima, desdeCache = false) {
  const iconoEmoji = Number.isFinite(clima.codigo)
    ? codigoAEmoji(clima.codigo)
    : '❓';

  const mensajeCache = desdeCache
    ? `<div class="cache-msg">⚡ Datos recientes</div>`
    : '';

  resultado.innerHTML = `
    ${mensajeCache}
    <div class="weather-card">
      <div class="weather-city">${escaparHTML(clima.nombre)}</div>
      <div class="weather-country">${escaparHTML(clima.pais)}</div>

      <div class="weather-main">
        <div class="weather-icon-emoji">${iconoEmoji}</div>
        <div>
          <div class="weather-temp">${clima.temp}<span>°C</span></div>
          <div class="weather-desc">${escaparHTML(clima.descripcion)}</div>
        </div>
      </div>

      <div class="weather-details">
        <div class="detail-item">
          <span class="detail-label">Sensación</span>
          <span class="detail-value">${clima.sensacion}°C</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Humedad</span>
          <span class="detail-value">${clima.humedad}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Viento</span>
          <span class="detail-value">${clima.viento} km/h</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Visibilidad</span>
          <span class="detail-value">${clima.visibilidad} km</span>
        </div>
      </div>
    </div>`;
}
// función para mostrar el clima formateado en el DOM, usando los datos parseados y mapeando el código WMO a un emoji representativo del clima
function mostrarClima(data, ciudadBuscada) {
  const clima = parsearClima(data, ciudadBuscada);

  if (!clima) {
    return mostrarError('No se encontraron datos para esa ciudad');
  }

  renderClima(clima);
}
// wttr.in usa códigos WMO — los mapeamos a emojis
function codigoAEmoji(code) {
  if (code === 113)                          return '☀️';
  if (code === 116)                          return '⛅';
  if ([119, 122].includes(code))             return '☁️';
  if ([143, 248, 260].includes(code))        return '🌫️';
  if ([176, 263, 266, 293, 296].includes(code)) return '🌦️';
  if ([299, 302, 305, 308].includes(code))   return '🌧️';
  if ([179, 182, 185, 281, 284, 311, 314, 317, 320, 323, 326].includes(code)) return '🌨️';
  if ([329, 332, 335, 338, 350, 395, 392].includes(code)) return '❄️';
  if ([353, 356, 359, 362, 365, 374, 377].includes(code)) return '🌧️';
  if ([200, 386, 389].includes(code))        return '⛈️';
  return '🌡️';
}

// función para buscar el clima de múltiples ciudades ingresadas por el usuario, separadas por comas, y mostrar un comparativo en el DOM, manejando errores individuales sin afectar el resultado global
async function buscarMultiplesCiudades(input) {
  const ciudades = input
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  if (!ciudades.length) return;

  resultado.innerHTML = `<p>🔍 Buscando múltiples ciudades...</p>`;

  const resultados = [];

  for (const ciudad of ciudades) {
    const key = normalizarCiudad(ciudad);

    let data = obtenerClimaCache(key);
    let clima;
    let desdeCache = false;

    if (data) {
      clima = parsearClima(data, ciudad);
      desdeCache = true;
    } else {
      try {
        const url = `https://wttr.in/${encodeURIComponent(ciudad)}?format=j1`;
        const res = await fetch(url);

        if (!res.ok) throw new Error();

        const dataApi = await res.json();

        guardarClimaCache(key, dataApi); // ✅ guardamos RAW

        clima = parsearClima(dataApi, ciudad);
      } catch {
        continue; // ignora errores individuales
      }
    }

    if (clima) {
      resultados.push({
        ...clima,
        desdeCache
      });
    }
  }

  renderClimaComparativo(resultados);
}

// función para mostrar un comparativo de climas de múltiples ciudades en el DOM, formateando cada clima como una tarjeta y usando un diseño de grid para mejor visualización
function renderClimaComparativo(climas) {
  if (!climas.length) {
    return mostrarError('No se pudieron obtener datos');
  }

  const html = climas.map(clima => {
    const icono = Number.isFinite(clima.codigo)
      ? codigoAEmoji(clima.codigo)
      : '❓';

    const cacheMsg = clima.desdeCache
      ? `<div class="cache-msg">⚡ Cache</div>`
      : '';

    return `
      <div class="weather-card">
        ${cacheMsg}
        <div class="weather-city">${escaparHTML(clima.nombre)}</div>
        <div class="weather-country">${escaparHTML(clima.pais)}</div>

        <div class="weather-main">
          <div>${icono}</div>
          <div>
            <strong>${clima.temp}°C</strong>
            <div>${escaparHTML(clima.descripcion)}</div>
          </div>
        </div>

        <div class="weather-details">
          🌡️ ${clima.sensacion}°C | 💧 ${clima.humedad}% | 💨 ${clima.viento} km/h
        </div>
      </div>
    `;
  }).join('');

  resultado.innerHTML = `
    <div class="weather-grid">
      ${html}
    </div>
  `;
}

//cacheamos el último clima mostrado para evitar llamadas repetidas al mismo lugar
const MAX_CACHE = 10;

function limpiarCacheSiEsNecesario(cache) {
  const keys = Object.keys(cache);

  if (keys.length <= MAX_CACHE) return;

  // eliminar el más antiguo
  const oldestKey = keys.reduce((oldest, key) => {
    return cache[key].timestamp < cache[oldest].timestamp ? key : oldest;
  }, keys[0]);

  delete cache[oldestKey];
}

function obtenerCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}
// guardamos el clima en cache con su timestamp para validar expiración
function guardarClimaCache(ciudad, data) {
  const cache = obtenerCache();
  const key = normalizarCiudad(ciudad);

  cache[key] = {
    data,
    timestamp: Date.now()
  };

  limpiarCacheSiEsNecesario(cache); // 🔥 importante
  guardarCache(cache);
}
// intenta obtener el clima desde cache, validando expiración
function obtenerClimaCache(ciudad) {
  const cache = obtenerCache();
  const key = normalizarCiudad(ciudad);;

  const entry = cache[key];
  if (!entry) return null;

  const ahora = Date.now();

  // validar expiración
  if (ahora - entry.timestamp > TTL) {
    delete cache[key];
    guardarCache(cache);
    return null;
  }

  return entry.data;
}
// guardamos el cache completo (objeto con varias ciudades) como JSON en localStorage
function guardarCache(cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

// Eventos
btnBuscar.addEventListener('click', () => {
  const valor = inputCiudad.value;

  if (valor.includes(',')) {
    buscarMultiplesCiudades(valor);
  } else {
    buscarClima(valor);
  }
});
inputCiudad.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const valor = inputCiudad.value;

    if (valor.includes(',')) {
      buscarMultiplesCiudades(valor);
    } else {
      buscarClima(valor);
    }
  }
});