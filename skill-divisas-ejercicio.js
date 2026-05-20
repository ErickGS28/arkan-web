// ============================================================
// skill-divisas-ejercicio.js
//
// Simulación del handler de una Alexa Skill de conversión de divisas.
// El viajero le pregunta a Alexa: "¿Cuánto son 100 dólares en pesos?"
//
// API gratuita (sin llave, sin registro):
//   https://open.er-api.com/v6/latest/USD
//
// Ejecutar con: node skill-divisas-ejercicio.js
// Requiere: Node.js 18 o superior (fetch nativo)
// ============================================================

// -------------------------------------------------------
// SECCIÓN 1: ARROW FUNCTIONS + TEMPLATE LITERALS
// -------------------------------------------------------

// TODO 1 ─────────────────────────────────────────────────
// Arrow function con retorno implícito que construye la respuesta de Alexa.
//
const construirRespuesta = (monto, monedaOrigen, resultado, monedaDestino) =>
  `${monto} ${monedaOrigen} equivalen a ${resultado.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${monedaDestino} al tipo de cambio actual.`


// TODO 2 ─────────────────────────────────────────────────
// Función de fábrica (closure) que devuelve un clasificador de tipo de cambio.
//
const crearClasificador = (umbralFavorable, umbralDesfavorable) =>
  (tipoCambio) =>
    tipoCambio >= umbralFavorable
      ? 'favorable para cambiar divisas'
      : tipoCambio <= umbralDesfavorable
        ? 'desfavorable, considera esperar'
        : 'en rango normal'

const clasificarTipoCambio = crearClasificador(18, 16)


// -------------------------------------------------------
// SECCIÓN 2: FETCH + ASYNC/AWAIT + DESTRUCTURING + try/catch
// -------------------------------------------------------

// TODO 3 ─────────────────────────────────────────────────
// Consulta la API y devuelve el tipo de cambio entre dos monedas.
//
async function obtenerTipoCambio(monedaBase, monedaDestino) {
  const respuesta = await fetch(`https://open.er-api.com/v6/latest/${monedaBase}`)

  if (!respuesta.ok) {
    throw new Error(`Error al consultar la API: ${respuesta.status} ${respuesta.statusText}`)
  }

  const { rates } = await respuesta.json()

  if (rates[monedaDestino] === undefined) {
    throw new Error(`Moneda no reconocida: ${monedaDestino}`)
  }

  return rates[monedaDestino]
}


// -------------------------------------------------------
// SECCIÓN 3: FUNCIÓN PRINCIPAL — simula el handler de Alexa
// -------------------------------------------------------

// TODO 4 ─────────────────────────────────────────────────
// Valida, convierte e imprime la respuesta. Captura errores estilo Alexa.
//
async function manejarConversion(monto, monedaOrigen = 'USD', monedaDestino = 'MXN') {
  try {
    if (!monto || Number.isNaN(Number(monto)) || Number(monto) <= 0) {
      throw new Error('El monto debe ser un número mayor a 0.')
    }

    const tipoCambio = await obtenerTipoCambio(monedaOrigen, monedaDestino)
    const resultado = Number(monto) * tipoCambio

    let mensaje = construirRespuesta(monto, monedaOrigen, resultado, monedaDestino)

    if (monedaDestino === 'MXN') {
      const clasificacion = clasificarTipoCambio(tipoCambio)
      mensaje += ` El mercado está ${clasificacion}.`
    }

    console.log(mensaje)
  } catch (error) {
    console.log(`Lo siento, no pude realizar la conversión. ${error.message}`)
  }
}


// -------------------------------------------------------
// SECCIÓN 4: PROMISE.ALL — varias conversiones en paralelo
// -------------------------------------------------------

// TODO 5 ─────────────────────────────────────────────────
// Convierte un monto de USD a varias monedas simultáneamente.
//
async function consultarMultiplesDivisas(monto) {
  const monedasDestino = ['MXN', 'EUR', 'JPY', 'CAD']

  console.log(`\n--- Convirtiendo $${monto} USD a varias monedas en paralelo ---`)

  try {
    const resultados = await Promise.all(
      monedasDestino.map(async (moneda) => {
        const tipoCambio = await obtenerTipoCambio('USD', moneda)
        return { moneda, resultado: monto * tipoCambio }
      })
    )

    resultados.forEach(({ moneda, resultado }) =>
      console.log(
        `${moneda}: $${resultado.toLocaleString('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      )
    )
  } catch (error) {
    console.log(`Error al consultar múltiples divisas: ${error.message}`)
  }
}


// -------------------------------------------------------
// PUNTO DE ENTRADA — ejecutamos todo
// -------------------------------------------------------

;(async () => {
  console.log('=== Conversiones individuales ===\n')

  await manejarConversion(100)                    // 100 USD → MXN (con clasificación)
  await manejarConversion(250, 'EUR', 'MXN')      // 250 EUR → MXN (con clasificación)
  await manejarConversion(500, 'USD', 'JPY')      // 500 USD → JPY (sin clasificación)
  await manejarConversion(-50)                     // monto inválido → error Alexa
  await manejarConversion('hola')                  // monto NaN    → error Alexa

  await consultarMultiplesDivisas(1000)            // 1000 USD → MXN, EUR, JPY, CAD en paralelo
})()
