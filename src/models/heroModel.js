const mongoose = require("mongoose")

const heroSchema = new mongoose.Schema(
	{
		heroID: {
			type: Number,
			required: true
		},

		name: {
			type: String,
			required: true
		},

		ability: {
			type: String,
			enum: ['Defender', 'Attacker']
		},

		startedToTrain: {
			type: String,
		},

		dailyTraining: {
			type: Object,
			default: {
				value: 0,
				date: null
			}
		},

		suitColors: [String],

		startingPower: {
			type: Number
		},

		currentPower: {
			type: Number,
			default: 100
		},

		trainerId: {
			// type: mongoose.Types.ObjectId
			type: String

		}
	}
)


heroSchema.pre('validate', async function (next) {

	if (!this.heroID) {
		const counter = await Hero.countDocuments({})
		this.heroID = counter + 1
	}

	next()
})


heroSchema.methods.train = async function () {
	const hero = this
	if (hero.dailyTraining.value < 5) {
		const newDate = (new Date).toLocaleDateString("en-IL")

		if (!hero.startedToTrain) hero.startedToTrain = newDate

		hero.startingPower = hero.currentPower
		hero.currentPower += Math.round((currentPower / 100) * Math.floor(Math.random() * 11))
		hero.dailyTraining.value += 1
		hero.dailyTraining.date = newDate
		hero.markModified('dailyTraining')

		await hero.save()
	}
}

heroSchema.methods.updateDailyTraining = async function () {
	const hero = this
	const newDate = (new Date).toLocaleDateString("en-IL")

	if (hero.dailyTraining.date !== newDate) {
		hero.dailyTraining.value = 0
		hero.markModified('dailyTraining')
		await hero.save()
	}
}


const Hero = mongoose.model("Hero", heroSchema)

module.exports = Hero