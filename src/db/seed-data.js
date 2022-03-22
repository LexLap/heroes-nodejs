const Hero = require("../models/heroModel")

const seedInitialData = async () => {
    try {
        const heroesCounter = await Hero.countDocuments()
        if (heroesCounter === 0) {
            for (let i = 0; i < 20; i++) {

                const hero = new Hero({
                    name: getRandomName(),
                    ability: i % 2 == 0 ? "Attacker" : "Defender",
                    suitColors: getSuitColors()
                })
                await hero.save()
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const getRandomName = () => {
    const names = ["Abigael", "Bliss", "Britta", "Cinna", "Daile", "Flossy", "Opal"];
    const newName = names.splice(Math.floor(Math.random() * names.length), 1) +
        names.splice(Math.floor(Math.random() * names.length), 1)

    return newName
}

const getSuitColors = () => {
    const colors = ["yellow", "red", "orange", "blue", "green", "purple", "black", "white", "grey"]
    const baseColor = colors.splice(Math.floor(Math.random() * colors.length), 1)
    const newColors = [
        baseColor[0],
        colors.splice(Math.floor(Math.random() * colors.length), 1)[0],
        colors.splice(Math.floor(Math.random() * colors.length), 1)[0],
        colors.splice(Math.floor(Math.random() * colors.length), 1)[0],
        baseColor[0]
    ]

    return newColors
}


module.exports = seedInitialData