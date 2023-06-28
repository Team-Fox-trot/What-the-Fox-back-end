'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// In the foxMemeSchema

const foxMemeSchema = new Schema({
  imgUrl: {type: String, require: true},
  userInput: {type: String, require: true},
  memeURL: {type: String, require: false},
  userId: {type: String, require: true},
  likes: {type: [String], default: []},
});


const FoxMemeModel = mongoose.model('FoxMeme', foxMemeSchema);

module.exports = FoxMemeModel;
