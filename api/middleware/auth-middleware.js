const bcrypt = require('bcryptjs')

const usersDb = require('../users-model')

module.exports = {
    validateReqBody,
    validateUnique,
    hashPassword,
}

function validateReqBody(req, res, next) {
    if (!req.body) return res.status(400).json({message: 'Missing content application/json'})

    for (let prop of ['username', 'password', 'department']) {
        if (!req.body[prop]) return res.status(400).json({message: 'Missing required property: ' + prop})

        if (typeof req.body[prop] != 'string') return res.status(400).json({message: `Property ${prop} must be a string`})
    }

    next()
}

function validateUnique(req, res, next) {
    const username = req.body.username
    
    usersDb.find({username})
        .then(resp => {
            if (resp && resp.length) return res.status(409).json({message: `Username ${username} is already in use. Please use something else.`})
            next()
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
}

function hashPassword(req, res, next) {
    const password = req.body.password

    bcrypt.hash(password,16)
        .then(hash => {
            res.locals.hash = hash
            next()
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
}
