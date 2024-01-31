const router = require('express').Router()
const boardController = require('../controllers/board')
const validation = require('../handlers/validation')
const { body, param } = require('express-validator')

router.post(
    '/',
    boardController.create
)

router.get(
    '/',
    boardController.getAll
)

router.put(
    '/',
    boardController.updatePosition
)

router.get(
    '/favourites',
    boardController.getFavourites
)

router.get(
    '/:boardId',
    param('boardId').custom(value => {
        if(!validation.isObjectId(value)) {
            return Promise.reject('boardId invalide')
        } else {
            return Promise.resolve()
        }
    }),
    validation.validate,
    boardController.getOne
)

router.put(
    '/:boardId',
    param('boardId').custom(value => {
        if(!validation.isObjectId(value)) {
            return Promise.reject('boardId invalide')
        } else {
            return Promise.resolve()
        }
    }),
    validation.validate,
    boardController.update
)

router.delete(
    '/:boardId',
    param('boardId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('ID invalide')
        } else return Promise.resolve()
    }),
    validation.validate,
    boardController.delete
)

module.exports = router;