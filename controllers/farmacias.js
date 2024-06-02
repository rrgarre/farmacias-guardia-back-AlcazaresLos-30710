const farmaciasRouter = require('express').Router()
const puppeteer = require('puppeteer')
// const farmacias = require('../utils/farmacias-Lucena-14900').farmacias_lucena
// const GuardiaLucena14900 = require('../models/guardiaLucena14900')
// Objeto para operaciones de filtrado en BBDD
const {Op} = require('sequelize')



farmaciasRouter.get('/', async (request, response) => {
  // Esta función realiza el Scrapping y sirve datos todo en uno.
  // Es una versión previa del desarrollo que no se usa.
  // Se eliminará cuando no sirva ni de consulta.
    const DIAI = 1
    const DIAF = 31
    const HOUR_OF_CHANGE = 20
    const MINUTES_OF_CHANGE = 30
    const currentDate = new Date()
    console.log('current date: ', currentDate)
    if(currentDate.getHours() <= HOUR_OF_CHANGE)
      if(currentDate.getMinutes() < MINUTES_OF_CHANGE)
        currentDate.setDate(currentDate.getDate() - 1)
    //Ajuste del día por horario de madrugada
    const currentDay = currentDate.getDate()
    const currentMonth = currentDate.getMonth()+1
    const moreDays = 6
    // const dia = request.params.dia
    // console.log('dia: ', dia)
    
    const browser = await puppeteer.launch({
        // headless: false,
        // slowMo:300
    })
    const page = await browser.newPage()
    // await page.goto('https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=1&mes=02&ano=2024&diaf=4&mesf=02&anof=2024')
    // await page.goto(`https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=${DIAI}&mes=02&ano=2024&diaf=${DIAF}&mesf=02&anof=2024`)
    await page.goto(`https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=${currentDay}&mes=${currentMonth}&ano=2024&diaf=${currentDay+moreDays}&mesf=${currentMonth}&anof=2024`)
    // await page.goto(`https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=${dia}&mes=02&ano=2024&diaf=${dia}&mesf=02&anof=2024`)
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
    await browser.close()

    
    const resultadoMix = data.map(elem => {
      const fondoDiaMixed = elem.fondoDia.map(farmacia => {
        return farmacias.find(elem => {
          return elem.matcher.replaceAll(' ','').replaceAll(',','').toUpperCase() === farmacia
        })
      })

      const fondoNocheMixed = elem.fondoNoche.map(farmacia => {
        return farmacias.find(elem => {
          return elem.matcher.replaceAll(' ','').replaceAll(',','').toUpperCase() === farmacia
        })
      })
      
      return {
        ...elem,
        fondoDia: fondoDiaMixed,
        fondoNoche: fondoNocheMixed
      }
    })

    // console.log('NUEVA EJEC: ', new Date().getDate())
    // console.log(`El día actual es: ${currentDay}`)
    console.log(`La hora actual es: ${currentDate.getHours()}`)
    
    // console.log(resultadoMix)

    return response.send(resultadoMix)
})

//////////////////////// EndPoint para pedir farmacias de guardia de Lucena (Cordoba) ////////////////////////
farmaciasRouter.get('/Lucena-14900/:dias', async (request, response) => {
  
  // fechas para acotar la consulta
  const diasResultado = parseInt(request.params.dias)
  const fechaActual = new Date()
  const fechaInicio = fechaActual.toISOString().split('T')[0]
  fechaActual.setDate(fechaActual.getDate() + diasResultado)
  const fechaFin = fechaActual.toISOString().split('T')[0]

  // Pedimos las guardias de Lucena entre fechas
  // Y ordenamos segun el valor fechaFormateada
  // const guardias = await GuardiaLucena14900.findAll()
  const guardias = await GuardiaLucena14900.findAll({
    where: {
      fechaFormateada: {
        [Op.between]: [fechaInicio, fechaFin]
      }
    },
    order: [
      ['fechaFormateada', 'ASC'] // Ordenar por el campo 'nombre' en orden ascendente
    ]
  })

  // Extendemos la info de farmacias.
  // Transformamos el String de IDs de farmacias
  // En un array con la info completa de las farmacias referidas
  const guardiasExtendidas = guardias.map(dia => {
    const fondoDiaArray = dia.fondoDia.split(',')
    // console.log('FondoDiaArray: ', fondoDiaArray)
    const fondoDiaExtendido = fondoDiaArray.map(farmaciaId => {
      return farmacias.find(f=>f.id === farmaciaId)
    })
    const fondoNocheArray = dia.fondoNoche.split(',')
    // console.log('FondoNocheArray: ', fondoNocheArray)
    const fondoNocheExtendido = fondoNocheArray.map(farmaciaId => {
      return farmacias.find(f=>f.id === farmaciaId)
    })
    

    // :::: Construir el objeto campo a campo
    return {
      id: dia.id,
      ciudad: dia.ciudad,
      fecha: dia.fecha,
      fechaFormateada: dia.fechaFormateada,
      horarioDia: dia.horarioDia,
      horaAperturaDia: dia.horaAperturaDia,
      horaCierreDia: dia.horaCierreDia,
      fondoDia: fondoDiaExtendido,
      horarioNoche: dia.horarioNoche,
      horaAperturaNoche: dia.horaAperturaNoche,
      horaCierreNoche: dia.horaCierreNoche,
      fondoNoche: fondoNocheExtendido
    }
  })

  // console.log('Todas las guardias: ', JSON.stringify(guardias, null, 2))
  // console.log('Todas las guardias: ', guardias)
  return response.send(guardiasExtendidas)
})

module.exports = farmaciasRouter