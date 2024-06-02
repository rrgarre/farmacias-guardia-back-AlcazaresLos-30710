const rutinasRouter = require('express').Router()
const GuardiaAlcazares30710 = require('../models/guardiaAlcazares30710')
const scrapFunctions = require('../utils/scrapFunctionsAlcazares30710')

// rutinasRouter.get('/Alcazares-30710/:dias', async (request, response) => {
  rutinasRouter.get('/Alcazares-30710/', async (request, response) => {

  //Esta linea necesita endpoint con parametro
  // const extraDays = parseInt(request.params.dias)

  // Llamada a la herramienta de Scrapping.
  // Además realiza el MATCH de farmacias con info de guardia para poner las IDS en los fondoDias y fondoNoche
  // const resultadoMix = await scrapFunctions.getSinceToday(extraDays)
  const resultadoMix = await scrapFunctions.getYear()

  try {
    // Sincroniza el modelo con la base de datos
    // Utiliza { force: true } solo en desarrollo para re-crear la tabla
    // await Farmacia.sync() 
    console.log('11111111111111111')
    await GuardiaAlcazares30710.sync({ force: true }) 
    console.log('222222222222222')

    resultadoMix.map(res => {
    console.log('333333333333')
      
      // en las listas de dia y noche me quedo con las IDs de las farmacias
      // const fondoDiaIds = res.fondoDia.map(elem => elem.id)
      // const fondoNocheIds = res.fondoNoche.map(elem => elem.id)
      GuardiaAlcazares30710.create({
        ciudad: res.ciudad,
        fecha: res.fecha,
        fechaFormateada: res.fechaFormateada,
        horarioDia: res.horarioDia,
        horaAperturaDia: res.horaAperturaDia,
        horaCierreDia: res.horaCierreDia,
        // fondoDia: fondoDiaIds.join(','),
        fondoDia: res.fondoDia,
        horarioNoche: res.horarioNoche,
        horaAperturaNoche: res.horaAperturaNoche,
        horaCierreNoche: res.horaCierreNoche,
        // fondoNoche: fondoNocheIds.join(',')
        fondoNoche: res.fondoNoche
      })
    })
    
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error)
  } finally {
    // Cierra la conexión al finalizar
    // await sequelize.close()
  }

  return response.send(resultadoMix)
})


module.exports = rutinasRouter