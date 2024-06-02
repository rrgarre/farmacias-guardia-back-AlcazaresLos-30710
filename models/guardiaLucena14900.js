const { DataTypes } = require('sequelize')
const sequelize = require('../database')

// Define un modelo para una tabla de ejemplo
const GuardiaLucena14900 = sequelize.define(
  'Farmacia', 
  {
    ciudad: {
      type: DataTypes.STRING
    },
    fecha: {
      type: DataTypes.STRING
    },
    fechaFormateada: {
      type: DataTypes.DATE
    },
    horarioDia: {
      type: DataTypes.STRING
    },
    horaAperturaDia: {
      type: DataTypes.STRING
    },
    horaCierreDia: {
      type: DataTypes.STRING
    },
    fondoDia: {
      type: DataTypes.STRING
    },
    horarioNoche: {
      type: DataTypes.STRING
    },
    horaAperturaNoche: {
      type: DataTypes.STRING
    },
    horaCierreNoche: {
      type: DataTypes.STRING
    },
    fondoNoche: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'guardias-Lucena-14900',
  },
)

module.exports = GuardiaLucena14900