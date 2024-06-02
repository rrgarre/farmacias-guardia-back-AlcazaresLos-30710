const config = require('./utils/config')

const { Sequelize } = require('sequelize');

let sequelize
try {
 
  sequelize = new Sequelize(
    config.DDBB_NAME,
    config.DDBB_USER,
    config.DDBB_PASSWORD,
    {
      host: config.DDBB_HOST,
      dialect: 'mysql'
    }
  )
} catch (error) {
  console.log('ERROR en la conexion de Base de Datos: ', error)
}


module.exports = sequelize;