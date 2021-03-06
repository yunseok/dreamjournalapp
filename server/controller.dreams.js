const Dream = require("./model.dream")

const randomColor = require("./utils/randomColor")

exports.create = (req, res) => {
	if (!req.body.content) {
		return res.status(400).send({
			message: "Content cannot be empty",
		})
	}

	const dream = new Dream({
		type: "dream",
		title: req.body.title,
		content: req.body.content,
		color: req.body.color ? req.body.color : randomColor(),
		mood: req.body.mood ? req.body.mood : null,
	})

	dream
		.save()
		.then((data) => {
			res.send(data)
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			})
		})
}

exports.findAll = (req, res) => {
	Dream.find()
		.then((dreams) => {
			res.send(dreams)
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			})
		})
}

exports.findOne = (req, res) => {
	Dream.findById(req.params.id)
		.then((dream) => {
			if (!dream) {
				return res.status(404).send({
					message: `DREAM NOT FOUND WITH ID [${req.params.id}]`,
				})
			}

			res.send(dream)
		})
		.catch((err) => {
			if (err.kind === "ObjectId") {
				return res.status(404).send({
					message: `DREAM NOT FOUND WITH ID [${req.params.id}]`,
				})
			}

			return res.status(500).send({
				message: `ERROR RETRIEVING DREAM WITH ID [${req.params.id}]`,
			})
		})
}

// TODOS: Make it so if no content is specified,
// do nothing instead of sending all the data (? Maybe ?)
// e.g. req.body.content ? req.body.content : doNothing
exports.update = (req, res) => {
	if (!req.body.content) {
		return res.status(400).send({
			message: "Content cannot be empty",
		})
	}

	Dream.findByIdAndUpdate(
		req.params.id,
		{
			type: "dream",
			title: req.body.title,
			content: req.body.content,
			color: req.body.color,
			mood: req.body.mood,
		},
		{ new: true }
	)
		.then((dream) => {
			if (!dream) {
				return res.status(404).send({
					message: `DREAM NOT FOUND WITH ID [${req.params.id}]`,
				})
			}

			res.send(dream)
		})
		.catch((err) => {
			if (err.kind === "ObjectId") {
				return res.status(404).send({
					message: `DREAM NOT FOUND WITH ID [${req.params.id}]`,
				})
			}

			return res.status(500).send({
				message: `ERROR UPDATING DREAM WITH ID [${req.params.id}]`,
			})
		})
}

exports.delete = (req, res) => {
	Dream.findByIdAndRemove(req.params.id)
		.then((dream) => {
			if (!dream) {
				return res.status(404).send({
					message: `DREAM NOT FOUND WITH ID [${req.params.id}]`,
				})
			}
			res.send({ message: "SUCCESSFULLY DELETED DREAM" })
		})
		.catch((err) => {
			if (err.kind === "ObjectId" || err.name === "NotFound") {
				return res.status(404).send({
					message: `DREAM NOT FOUND WITH ID [${req.params.id}]`,
				})
			}
			return res.status(500).send({
				message: `ERROR DELETING DREAM WITH ID [${req.params.id}]`,
			})
		})
}

// TODOS: Improve it (case sensitive, regex, etc)
exports.searchByTitle = (req, res) => {
	Dream.find({ title: { $regex: req.body.title } })
		.then((dream) => {
			if (!dream) {
				return res.status(404).send({
					message: `DREAM NOT FOUND WITH TITLE [${req.params.title}]`,
				})
			}

			res.send(dream)
		})
		.catch((err) => {
			if (err.kind === "ObjectId" || err.name === "NotFound") {
				return res.status(404).send({
					message: `DREAM NOT FOUND WITH TITLE [${req.body.title}]`,
				})
			}
			return res.status(500).send({
				message: `something stupid happened: ${err}`,
			})
		})
}
