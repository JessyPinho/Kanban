const router = require('express').Router({ mergeParams: true })
const { param, body } = require('express-validator')
const validation = require('../handlers/validation')
const taskController = require('../controllers/task')

router.post(
  '/',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('ID de tableau invalide')
    } else return Promise.resolve()
  }),
  body('sectionId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('ID de section invalide')
    } else return Promise.resolve()
  }),
  validation.validate,
  taskController.create
)

router.put(
  '/update-position',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('ID de tableau invalide')
    } else return Promise.resolve()
  }),
  validation.validate,
  taskController.updatePosition
)

router.delete(
  '/:taskId',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('ID de tableau invalide')
    } else return Promise.resolve()
  }),
  param('taskId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('ID de tache invalide')
    } else return Promise.resolve()
  }),
  validation.validate,
  taskController.delete
)

router.put(
  '/:taskId',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('ID de tableau invalide')
    } else return Promise.resolve()
  }),
  param('taskId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('ID de tache invalide')
    } else return Promise.resolve()
  }),
  validation.validate,
  taskController.update
)

module.exports = router