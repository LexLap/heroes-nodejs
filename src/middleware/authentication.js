const jwt = require('jsonwebtoken')
const logger = require('../logger/winston')
const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
    const token = req.headers['token']
    try {
        const result = jwt.verify(token, JWT_SECRET)
        req.userId = result._id

    } catch (error) {
        logger.log('error', error.message)
        res.status(401).send({
            message: error.message
        })
        return
    }


    next()
}

module.exports = auth