const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { schemaOptions } = require('./modelOptions');

const boardSchema = new Schema({
    title: {
        type: String,
        default: 'Non renseigné'
    },
    description: {
        type: String,
        default: 'Ajoutez une description'
    },
    position : {
        type: Number
    },
    favourite: {
        type: Boolean,
        default: false
    },
    favouritePosition: {
        type: Number,
        default: 0
    }
}, schemaOptions)

module.exports = mongoose.model('Board', boardSchema)