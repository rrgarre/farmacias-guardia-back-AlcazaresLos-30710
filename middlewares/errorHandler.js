// Manejador de Errores MIDDLEWARE definición
module.exports = (error, request, response, next) => {
  console.log('NombreError: ', error.name)
  console.log('MensajeError: ', error.message)
  if(error.name === 'CastError'){
    return response.status(400).json({error: "malformatted id"})
  }
  if(error.name === 'ValidationError'){
    return response.status(400).json({
      typeError: error.name, 
      errorMessage: error.message
    })
  }
  if(error.name === 'JsonWebTokenError'){
    return response.status(401).json({error: 'TOKEN missing or invalid'})
  }
  if(error.name === 'TokenExpiredError'){
    return response.status(401).json({error: 'Token expired. Log again!'})
  }
  console.log('XXXXX Pasamos el Error a los manejadores de Express XXXX')
  next(error)
}