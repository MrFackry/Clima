// ============================================================
// CASOS DE PRUEBA — App de Clima (wttr.in)
// ============================================================

// --- UTILIDAD: simula buscarClima() y captura el innerHTML ---
async function runTest(descripcion, ciudad, esperado) {
  await buscarClima(ciudad);
  const html = resultado.innerHTML;
  const paso = html.includes(esperado.contiene) &&
               !html.includes(esperado.noContiene ?? '__NUNCA__');
  console.log(`${paso ? '✅' : '❌'} ${descripcion}`);
  if (!paso) {
    console.log(`   Esperaba contener:     "${esperado.contiene}"`);
    console.log(`   HTML recibido (100c):  "${html.slice(0, 100)}"`);
  }
}

// ============================================================
// 1. CASOS VÁLIDOS
// ============================================================
async function testCasosValidos() {
  console.group('📗 Casos válidos');

  await runTest(
    'Ciudad capital reconocida',
    'Bogota',
    { contiene: 'weather-card' }
  );

  await runTest(
    'Ciudad con tilde en el nombre',
    'París',
    { contiene: 'weather-card' }
  );

  await runTest(
    'Ciudad con espacio en el nombre',
    'New York',
    { contiene: 'weather-card' }
  );

  await runTest(
    'Ciudad escrita en minúsculas',
    'tokyo',
    { contiene: 'weather-card' }
  );

  await runTest(
    'Ciudad escrita en MAYÚSCULAS',
    'LONDON',
    { contiene: 'weather-card' }
  );

  await runTest(
    'Ciudad con nombre en español',
    'Buenos Aires',
    { contiene: 'weather-card' }
  );

  await runTest(
    'Muestra temperatura en °C',
    'Madrid',
    { contiene: '°C' }
  );

  await runTest(
    'Muestra humedad',
    'Lima',
    { contiene: 'Humedad' }
  );

  await runTest(
    'Muestra viento',
    'Santiago',
    { contiene: 'Viento' }
  );

  await runTest(
    'Muestra visibilidad',
    'Medellín',
    { contiene: 'Visibilidad' }
  );

  console.groupEnd();
}

// ============================================================
// 2. CASOS INVÁLIDOS
// ============================================================
async function testCasosInvalidos() {
  console.group('📕 Casos inválidos');

  await runTest(
    'Ciudad que no existe',
    'Xkqzptlmn',
    { contiene: '⚠️', noContiene: 'weather-card' }
  );

  await runTest(
    'Solo números',
    '12345',
    { contiene: '⚠️', noContiene: 'weather-card' }
  );

  await runTest(
    'Solo caracteres especiales',
    '!!!@@@',
    { contiene: '⚠️', noContiene: 'weather-card' }
  );

  await runTest(
    'SQL injection básico',
    "' OR 1=1 --",
    { contiene: '⚠️', noContiene: 'weather-card' }
  );

  await runTest(
    'Script injection (XSS)',
    '<script>alert("xss")</script>',
    { contiene: '⚠️', noContiene: '<script>' }
  );

  console.groupEnd();
}

// ============================================================
// 3. CASOS LÍMITE
// ============================================================
async function testCasosLimite() {
  console.group('📙 Casos límite');

  // Campo vacío — buscarClima() debe retornar sin hacer fetch
  const htmlAntes = resultado.innerHTML;
  await buscarClima('');
  const htmlDespues = resultado.innerHTML;
  console.log(
    htmlAntes === htmlDespues
      ? '✅ Campo vacío: no hace petición'
      : '❌ Campo vacío: hizo petición cuando no debía'
  );

  // Solo espacios — igual que vacío
  const htmlAntes2 = resultado.innerHTML;
  await buscarClima('   ');
  const htmlDespues2 = resultado.innerHTML;
  console.log(
    htmlAntes2 === htmlDespues2
      ? '✅ Solo espacios: no hace petición'
      : '❌ Solo espacios: hizo petición cuando no debía'
  );

  await runTest(
    'Ciudad con un solo carácter',
    'A',
    { contiene: '⚠️' }
  );

  await runTest(
    'Ciudad con 100 caracteres',
    'A'.repeat(100),
    { contiene: '⚠️', noContiene: 'weather-card' }
  );

  await runTest(
    'Ciudad con número mezclado',
    'Area51',
    { contiene: '⚠️', noContiene: 'weather-card' }
  );

  await runTest(
    'Ciudad con guión',
    'Clermont-Ferrand',
    { contiene: 'weather-card' }
  );

  await runTest(
    'Ciudad con caracteres asiáticos',
    '東京',
    { contiene: 'weather-card' }
  );

  console.groupEnd();
}

// ============================================================
// EJECUTAR TODOS
// ============================================================
async function runAllTests() {
  console.clear();
  console.log('🧪 Iniciando suite de pruebas...\n');
  await testCasosValidos();
  await testCasosInvalidos();
  await testCasosLimite();
  console.log('\n✔ Suite completada');
}

runAllTests();