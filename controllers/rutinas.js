const rutinasRouter = require('express').Router()
const puppeteer = require('puppeteer')
const farmacias = require('../utils/farmacias-Lucena-14900').farmacias_lucena
const { Sequelize, DataTypes } = require('sequelize')
const GuardiaLucena14900 = require('../models/guardiaLucena14900')
const scrapFunctionsLucena14900 = require('../utils/scrapFunctionsLucena14900')

rutinasRouter.get('/Lucena-14900/:dias', async (request, response) => {

  // const extraDays = 99
  const extraDays = parseInt(request.params.dias)

  const resultadoMix = await scrapFunctionsLucena14900.getSinceToday(extraDays)


  //////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////// EJEMPLO USO SSBB /////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////

  // try {
  //   // Sincroniza el modelo con la base de datos
  //   // Utiliza { force: true } solo en desarrollo para re-crear la tabla
  //   // await Farmacia.sync() 
  //   await Farmacia.sync({ force: true }) 

  //   // Crea un usuario de ejemplo
  //   await Farmacia.create({ name: 'Rafa Dev2', email: 'rrgarre@gsd.vom' })

  //   // Consulta todos los usuarios
  //   const users = await Farmacia.findAll()
  //   console.log('Usuarios encontrados:', JSON.stringify(users, null, 2))
  // } catch (error) {
  //   console.error('Error al conectar a la base de datos:', error)
  // } finally {
  //   // Cierra la conexión al finalizar
  //   // await sequelize.close()
  // }
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////

  try {
    // Sincroniza el modelo con la base de datos
    // Utiliza { force: true } solo en desarrollo para re-crear la tabla
    // await Farmacia.sync() 
    await GuardiaLucena14900.sync({ force: true }) 

    resultadoMix.map(res => {
      // en las listas de dia y noche me quedo con las IDs de las farmacias
      // const fondoDiaIds = res.fondoDia.map(elem => elem.id)
      // const fondoNocheIds = res.fondoNoche.map(elem => elem.id)
      GuardiaLucena14900.create({
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