const Board = require('../models/board')
const Section = require('../models/section')
const Task = require('../models/task')

exports.create = async (req, res) => {
    try {
        const boardsCount = await Board.find().count()
        const board = await Board.create({
            position: boardsCount > 0 ? boardsCount : 0
        })
        res.status(201).json(board)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getAll = async(req, res) => {
    try {
        const boards = await Board.find({}).sort('-position')
        res.status(200).json(boards) 
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.updatePosition = async (req, res) => {
    const { boards } = req.body
    try {
        for (const key in boards.reverse()) {
            const board = boards[key]
            await Board.findByIdAndUpdate(
                board._id, 
                { $set: { position: key}}
            )
        }
        res.status(200).json({ message: 'Position mise à jour' })
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getOne = async (req, res) => {
    const { boardId } = req.params
    try {
        const board = await Board.findOne({ _id: boardId })
        if (!board) return res.status(404).json({ message: 'Tableau introuvable' })
        const sections = await Section.find({ board: boardId })
        for (const section of sections) {
            const tasks = await Task.find({ section: section._id}).populate('section').sort('-position')
            section._doc.tasks = tasks
        }
        board._doc.sections = sections
        res.status(200).json(board)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.update = async (req, res) => {
    const { boardId } = req.params
    const { title, description, favourite } = req.body

    try {
        if (title === '') req.body.title = 'Sans titre'
        if (description === '') req.body.description = 'Ajoutez une description'
        const currentBoard = await Board.findById(boardId)
        if (!currentBoard) return res.status(404).json({ message: 'Tableau introuvable' })

        if(favourite !== undefined && currentBoard.favourite !== favourite) {
            const favourites = await Board.find({
                favourite: true,
                _id: { $ne: boardId }
            })
            if (favourite) {
                req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0
            } else {
                for (const key in favourites) {
                    const element = favourites[key]
                    await Board.findByIdAndUpdate(
                        element._id,
                        { $set: { favouritePosition: key } }
                    )
                }
            }
        }

        const board = await Board.findByIdAndUpdate(
            boardId,
            { $set: req.body }
        )
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getFavourites = async (req, res) => {
    try {
       const favourites = await Board.find({ 
        favourite: true }).sort('-favouritePosition')
        res.status(200).json(favourites) 
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.delete = async (req, res) => {
    const { boardId } = req.params
    try {
        const sections = await Section.find({ board: boardId })
        for (const section of sections) {
            Task.deleteMany({ section: section._id })
        }
        await Section.deleteMany({ board: boardId})
        
        const currentBoard = await Board.findById(boardId)

        await Board.deleteOne({ _id: boardId })

        const boards = await Board.find().sort('position')
        for (const key in boards) {
            const board = boards[key]
            await Board.findByIdAndUpdate(
                board._id,
                { $set: { position: key }}
            )
        }
    } catch(err) {
        console.log(err)
    }
}