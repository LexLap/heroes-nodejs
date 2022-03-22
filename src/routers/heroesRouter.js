const express = require('express');
const auth = require('../middleware/authentication');
const router = new express.Router();
const Hero = require('../models/heroModel')
const bubbleSort = require('../helpers/SearchResultSorter');
const logger = require('../logger/winston');

router.post('/heroes', async (req, res) => {
    try {
        const hero = new Hero({
            name: req.body.name,
            ability: req.body.ability,
            suitColors: req.body.suitColors
        })
        await hero.save()

        res.status(201).send(hero)
    } catch (error) {
        logger.log('error', error.message)
        res.status(500).send({
            message: error.message
        })
    }
})

router.patch('/heroes/train', auth, async (req, res) => {

    try {
        const userId = req.userId
        const hero = await Hero.findOne({ heroID: req.body.heroID })

        if (hero.trainerId === userId) {
            await hero.train()
            res.status(201).send(hero)
        } else {
            logger.log('error', "Cannot train hero that not belongs to you! || user:" + userId)
            res.status(401).send({
                message: "Cannot train hero that not belongs to you!"
            })
        }
    } catch (error) {
        logger.log('error', error.message)
        res.status(500).send({
            message: error.message
        })
    }
})


router.get('/heroes', auth, async (req, res) => {
    try {
        const heroes = await Hero.find({}).sort({ currentPower: -1 })
        console.log(heroes[0])
        const publicArray = []
        const privateArray = []

        heroes.forEach(hero => {
            publicArray.push({
                heroID,
                name,
                ability,
                currentPower
            } = hero)

            if (hero.trainerId === req.userId)
                privateArray.push(hero)
        })

        const data = {}
        data.publicData = bubbleSort('currentPower', publicArray)
        data.privateData = bubbleSort('currentPower', privateArray)

        res.status(201).send(data)

    } catch (error) {
        logger.log('error', error.message)
        res.status(500).send({
            message: error.message
        })
    }
})


module.exports = router