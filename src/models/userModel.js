const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const Hero = require("./heroModel")

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true
		},

		password: {
			type: String,
			required: true,
			trim: true,
			validate(value) {
				const passRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
				if (!passRegex.test(value)) {
					throw new Error("Password doesn't meet requirements!")
				}
			},
		},

		joinDate: {
			type: String,
			default: (new Date).toLocaleDateString("en-IL")
		},

		assignedHeroes: {
			type: [String],
			default: []
		},

		lastAccess: {
			type: String
		}
	}
)


userSchema.pre('save', async function (next) {

	const user = this
	if (user.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 8)
	}

	next()
})


userSchema.statics.findByCredentials = async (username, password) => {
	const user = await User.findOne({ username })
	if (!user) {
		throw new Error('User not registered!')
	}

	const isMatch = await bcrypt.compare(password, user.password)
	if (!isMatch) {
		throw new Error('Wrong password!')
	}

	return user
}


userSchema.methods.refreshDailyTraining = async function () {
	const user = this

	try {
		const listOfHeroes = await Hero.find({ trainerId: user._id })
		listOfHeroes.forEach(async hero => await hero.updateDailyTraining())

	} catch (error) {
		throw new Error(error.message)
	}
}


userSchema.methods.bindHeroes = async function () {
	const user = this

	try {
		const listOfHeroes = await Hero.find({})

		while (listOfHeroes.length > 0 && user.assignedHeroes.length <= 4) {
			const hero = listOfHeroes.shift()
			if (!hero.trainerId) {
				const heroId = hero._id
				user.assignedHeroes.push(heroId)
				hero.trainerId = user._id
				await hero.save()
			}
		}
		await user.save()

	} catch (error) {
		throw new Error(error.message)
	}
}


const User = mongoose.model("User", userSchema)

module.exports = User