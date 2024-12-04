const farmaciasRouter = require('express').Router()
const farmacias = require('../utils/farmacias-Alcazares-30710').farmacias_alcazares_30710
const GuardiaModel = require('../models/guardiaAlcazares30710')

// const farmacias = require('../utils/farmacias-Lucena-14900').farmacias_lucena
// const GuardiaLucena14900 = require('../models/guardiaLucena14900')

// Objeto para operaciones de filtrado en BBDD
const {Op} = require('sequelize')

//////////////////////// EndPoint de STATUS ////////////////////////////////////////////////////////////////////////
farmaciasRouter.get('/LosAlcazares30710/status', async (request, response) => {
  return response.status(200).json({'message':'OK'})
})

//////////////////////// EndPoint para pedir farmacias de guardia de Los Alcázares (Murcia) ////////////////////////
farmaciasRouter.get('/LosAlcazares30710/:dias', async (request, response) => {

  // fechas para acotar la consulta
  // Para evitar extracciones de información
  // En lugar de duplicar este endpoint pero sin parámetro de entrada
  // Vamos a fijar el valor diasResultado por constante
  const diasResultado = parseInt(request.params.dias)
  // const diasResultado = 5
  const fechaActual = new Date()
  console.log('La fecha actual es: ', fechaActual.toISOString())
  fechaActual.setDate(fechaActual.getDate() - 1)
  const fechaInicio = fechaActual.toISOString().split('T')[0]
  fechaActual.setDate(fechaActual.getDate() + diasResultado + 1)
  const fechaFin = fechaActual.toISOString().split('T')[0]

  // Pedimos las guardias de Los Alcázares entre fechas
  // Y ordenamos segun el valor fechaFormateada
  // const guardias = await GuardiaModel.findAll()
  const guardias = await GuardiaModel.findAll({
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