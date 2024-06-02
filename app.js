// Rama de DESARROLLO

const config = require('./utils/config')
const initializarCollections = require('./utils/initializarCollections')

// NUCLEO DE APP //////////////////////////////////
const express = require('express')
const app = express()
///////////////////////////////////////////////////

const mongoose = require('mongoose')
const { Sequelize, DataTypes } = require('sequelize')

// Importamos los controladores
const loginRouter = require('./controllers/login')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const farmaciasRouter = require('./controllers/farmacias')

const logger = require('./utils/logger')
const morgan = require('morgan')
const cors = require('cors')

// Importamos los Middlewares personales
const cleanerConsole = require('./middlewares/cleanerConsole')
const unknowEndpoint = require('./middlewares/unknowEndpoint')
const errorHandler = require('./middlewares/errorHandler')
const rutinasRouter = require('./controllers/rutinas')


// Conectamos la base de datos MONGODB
// logger.info(`connecting to ${config.MONGODB_URI}`)
// mongoose.connect(config.MONGODB_URI)
//   .then(result=>{
//     console.log('Conexión establecida')
//   })
//   .catch((error)=>{
//     console.log('No se ha podido conectar con la base de datos', error.message)
//   })

// Conectamos Base de Datos SQL.
const sequelize = require('./database')
sequelize.authenticate()
  .then(msg => console.log('Conexion OK'))
  .catch(err => console.log('Conexion ERROR'))
sequelize.sync()
  .then(msg => console.log('Sync DDBB OK'))
  .catch(err => console.log('Sync DDBB ERROR'))


// Limpiamos Colecciones ???
// initializarCollections.notes()
// initializarCollections.users()



// MIDDLEWARES
// app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(cleanerConsole)
morgan.token('bodyRequest', (request, response)=>{
  return JSON.stringify(request.body)
})
// Y llamamos al middleware Morgan con un mensaje formateado con los tokkens que queremos
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyRequest'))

// Enrutadores
app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/farmacias', farmaciasRouter)
// Paramos este endpoint para Desarrollo, para evitar refrescos de BBDD de momento
app.use('/api/rutinas', rutinasRouter)

// Control de errores
app.use(unknowEndpoint)
app.use(errorHandler)


module.exports = app