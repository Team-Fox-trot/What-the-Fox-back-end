'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const foxMemeSchema = new Schema({
  imgUrl: {type: String, require: true},
  userInput: {type: String, require: true},
  memeURL: {type: String, require: false},
});

const FoxMemeModel = mongoose.model('FoxMeme', foxMemeSchema);

module.exports = FoxMemeModel;