// const { isObjectIdOrHexString } = require('mongoose')
const puppeteer = require('puppeteer')
// listado de farmacias para cruzar con Scrapping
const farmacias = require('../utils/farmacias-Lucena-14900').farmacias_lucena

///////////////// Posible función para obtener un año concreto //////////////////////////////
// NO ESCRITA...
const getYear = async () => {
  return 'getYear(): farmacias de guardia del año XXXX'
}

///////////////// Función para obtener 1 + 'extraDays' días de guardia desde hoy ///////////////
const getSinceToday = async (extraDays) => {
  
  // Hora que determina el cambio de día (por estar la info de madrugada en el día de antes)
  const HOUR_OF_CHANGE = 20
  const MINUTES_OF_CHANGE = 30
  const currentDate = new Date()
  
  //Ajuste del día por horario de madrugada
  // Nos ubicamos en el día anterior si son menos de las 'HOUR CHANGE'
  // Ya que la info de las guardias de madrugada corresponden a los datos del dia anterior
  if(currentDate.getHours() <= HOUR_OF_CHANGE)
    if(currentDate.getMinutes() < MINUTES_OF_CHANGE)
      currentDate.setDate(currentDate.getDate() - 1)

  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth()+1

  // Días de más que vamos a pedir al Scrapeo (desde el día de hoy)
  // const moreDays = 6
  const moreDays = extraDays
  
  // Configuración del modo de abrir el navegador virtual que realizará el Scrapeo
  const browser = await puppeteer.launch({
      // headless: false,
      // slowMo:300
  })

  // Abrimos nueva página y vamos a la URL
  const page = await browser.newPage()
  await page.goto(`https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=${currentDay}&mes=${currentMonth}&ano=2024&diaf=${currentDay+moreDays}&mesf=${currentMonth}&anof=2024`)

  // Comenzamos el Scrapping y lo volcamos en 'data'
  const data = await page.evaluate(() => {
    try {
      const contenido = [...document.querySelectorAll('div.supercontenedor')]
        .map(fila => {
          const ciudad = fila.querySelectorAll('td')[2].innerText
          const fecha = fila.querySelector('div.fecha').innerText
          const horarioDia = fila.querySelector('div.dia').innerText
          const fondoDia = [...fila
            .querySelector('div.fondodia, div.fondodiadomingo')
            .querySelectorAll('td.farmacia')]
            .map(elem=>elem.innerText.replaceAll(' ', '').replaceAll(',','').toUpperCase())
          
          const horarioNoche = fila.querySelector('div.noche').innerText
          const fondoNoche = [...fila
            .querySelector('div.fondonoche, div.fondonochedomingo')
            .querySelectorAll('td.farmacia')]
            .map(elem=>elem.innerText.replaceAll(' ', '').replaceAll(',','').toUpperCase())
          
          return {
            ciudad,
            fecha,
            horarioDia,
            fondoDia,
            horarioNoche,
            fondoNoche
          }
        })
      return contenido
    } catch (error) {
      return {
        'message':'no se pudo calcular resultados'
      }
    }
  })

  // cerramos navegación
  await browser.close()

  ////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////// Ahora cruzamos datos con nuestra info de las farmacias /////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  
  // Añadiremos la info de cada farmacia (sólo las IDs) a los listados de fondoDia y fondoNoche
  // De cada día (cada elem de data, de ahí el .map)
  const resultadoMix = data.map(elem => { 
    // Cambiamos el array de nombres de farmacia conforme llegan del scrapeo
    // Por las IDS de las farmacias en nuestra BBDD
    // ** Si quitamos el '.id' del finally. Tendriamos toda la información de la farmacia en un objeto
    //    pero como este Array resultado debemos pasarlo a String por no poder almacenar arrays en la BBDD,
    //    Mejor nos quedamos sólo con las IDS y ya en los controllers reconstruimos con la info completa de 
    //    cada farmacia antes de SERVIR los datos
    const fondoDiaMixed = elem.fondoDia.map(farmacia => {
      return farmacias.find(elem => {
        return elem.matcher.replaceAll(' ','').replaceAll(',','').toUpperCase() === farmacia
      }).id
    })
    const fondoNocheMixed = elem.fondoNoche.map(farmacia => {
      return farmacias.find(elem => {
        return elem.matcher.replaceAll(' ','').replaceAll(',','').toUpperCase() === farmacia
      }).id
    })

    // creamos la fecha en formato para ordenar consultas posteriores
    // aaaa-mm-dd
    // nos quedamos con la fecha y descartamos 'CORDOBA '
    let fechaTemp = elem.fecha.split(' ')[1]
    // tenemos un array con el dia, mes y año
    fechaTemp = fechaTemp.split('-')
    // Aseguramos longitudes correctas en la fecha aaaa-mm-dd
    fechaTemp[1] = fechaTemp[1].padStart(2, '0')
    const fechaFormateada = fechaTemp.reverse().join('-')
    // const fechaFormateada = elem.fecha.split(' ')[1].split('-').reverse().join('-')

    // Scrappin las horas de apertura y cierre
    const horaAperturaDia = elem.horarioDia.split(' ')[1]
    const horaCierreDia = elem.horarioDia.split(' ')[6]
    const horaAperturaNoche = elem.horarioNoche.split(' ')[1]
    const horaCierreNoche = elem.horarioNoche.split(' ')[6]

    // Aqui retornamos el elemento (guardia de 1 día) pero pasamos a String los Arrays de fondoDia y fondoNoche
    return {
      ...elem,
      fondoDia: fondoDiaMixed.join(','),
      fondoNoche: fondoNocheMixed.join(','),
      fechaFormateada: fechaFormateada,
      horaAperturaDia: horaAperturaDia,
      horaCierreDia: horaCierreDia,
      horaAperturaNoche: horaAperturaNoche,
      horaCierreNoche: horaCierreNoche
    }
  })
  
  // Devolvemos el data del scrapping con los datos cruzados de las farmacias 
  // (un String con las Ids de las mismas separadas por ',')
  return resultadoMix
}

module.exports = {
  getYear,
  getSinceToday
}