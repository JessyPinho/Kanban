const router = require('express').Router({ mergeParams: true });
const validation = require('../handlers/validation')
const { body, param } = require('express-validator')
const sectionController = require('../controllers/section');
const section = require('../models/section');

router.post(
    '/',
    param('boardId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('ID invalide')
        } else return Promise.resolve()
    }),
    validation.validate,
    sectionController.create
)

router.put(
    '/:sectionId',
    param('boardId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('ID de tableau invalide')
        } else return Promise.resolve()
    }),
    param('sectionId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('ID de section invalide')
        } else return Promise.resolve()
    }),
    validation.validate,
    sectionController.update
)

router.delete(
    '/:sectionId',
    param('boardId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('ID de tableau invalide')
        } else return Promise.resolve()
    }),
    param('sectionId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('ID de section invalide')
        } else return Promise.resolve()
    }),
    validation.validate,
    sectionController.delete
)

module.exports = router