const express = require('express');
const router = new express.Router();
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const logger = require('../logger/winston');
const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async (req, res) => {

    let username = { username: req.body.username }
    if (await User.findOne(username)) {
        logger.log('error', 'Username has already been taken!')
        res.status(403).send({
            message: 'Username has already been taken!'
        })

    } else
        try {
            const user = new User({
                username: req.body.username,
                password: req.body.password
            })

            await user.bindHeroes()

            const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: '1h' })

            res.status(201).send({
                token,
                user
            })

        } catch (error) {
            logger.log('error', error.message)
            res.status(500).send({
                message: error.message
            })
        }
})

router.post('/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)

        await user.refreshDailyTraining()

        const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: '1h' })

        res.status(200).send({
            token,
            user
        })

    } catch (error) {
        logger.log('error', error.message)
        res.status(401).send({
            message: error.message
        })
    }
})


module.exports = router