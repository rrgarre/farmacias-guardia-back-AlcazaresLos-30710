const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')



usersRouter.get('/', async (request, response)=>{
    let result = await User.find({}).populate('notes', {content: 1, date: 1})
    return response.json(result)
})
usersRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const user = await User.findById(id).populate('notes', {content: 1, date: 1})
    response.json(user)
})

usersRouter.post('/', async (request, response, next)=>{
    const body = request.body
    const saltRounds = 10
    
    const hash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: hash
    })
    try {
        savedUser = await user.save()
        response.json(savedUser)
    } catch (error) {
        next(error)
        // response.status(404).end()
    }
})

module.exports = usersRouter