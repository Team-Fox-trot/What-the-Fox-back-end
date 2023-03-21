'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const foxMemeSchema = new Schema({
  imgURL: {type: String, require: true},
  userInput: {type: String, require: true},
});

const FoxMemeModel = mongoose.model('FoxMeme', foxMemeSchema);

module.exports = FoxMemeModel;