const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { SECRET_FOR_JWT } = require('../utils/config')

loginRouter.get('/', (request, response) => {
  response.send('Desde controlador de Login')
})

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)
  
  if(!(passwordCorrect && user)){
    return response.status(401).json({error: 'Contraseña o usuario incorrectos'})
  }
  
  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(
    userForToken, 
    SECRET_FOR_JWT,
    {expiresIn: 60})
  
  response
    .status(200)
    .send({
      token: token, 
      username: user.username, 
      name: user.name
    })
})

module.exports = loginRouter