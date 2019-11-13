const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const {validateReqBody, validateUnique, hashPassword} = require('./middleware/auth-middleware')
const usersDb = require('./users-model')

const server = express()

const secret = process.env.SECRET || 'secret key'

// middleware
server.use(helmet())
server.use(cors())
server.use(express.json())

// routes
server.post('/api/register', validateReqBody, validateUnique, hashPassword, (req, res) => {
    const {username, department} = req.body
    const password = res.locals.hash

    usersDb.add({username, password, department})
        .then(resp => {
            if (resp && resp[0]) {
                const {id, username, department} = resp[0]
                const user = {id, username, department}
                const token = jwt.sign(user, secret, {expiresIn: '18h'})
                res.status(201).json({user, token})
            }
            else {
                throw Error('No user')
            }
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})

server.post('/api/login', (req, res) => {
    
})

server.post('/api/users', (req, res) => {
    
})

module.exports = server