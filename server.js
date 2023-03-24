"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const FoxMeme = require("./models/foxMeme.js");
const verifyUser = require("./auth");
const memeGeneratorFoxMeme = require("./module/memeGeneratorFoxMeme")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongoose is connected");
});

mongoose.connect(process.env.DB_URL);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get("/foxMemes", getFoxMemes);
app.get("/foxMemes/:id", getAFoxMeme);
app.post("/foxMemes", postFoxMemes);
app.delete("/foxMemes/:id", deleteFoxMemes);
app.put("/foxMemes/:id", putFoxs);

async function getFoxMemes(req, res, next) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send("invalid token");
    } else {
      try {
    let results = await FoxMeme.find({});
    res.status(200).send(results);
    console.log("get foxes");
  } catch (err) {
    next(err);
  }
}})}

async function postFoxMemes(req, res, next) {
  req.body.memeURL = await memeGeneratorFoxMeme(req.body, res, next);
      try {
        let createdFoxMeme = await FoxMeme.create(req.body);
        res.status(200).send(createdFoxMeme);
      } catch (err) {
        next(err);
      }
    }
//   });
// }
async function getAFoxMeme(req, res, next) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send("invalid token");
    } else {
      try {
        let id = req.params.id;
        await FoxMeme.findById(id);
        res.status(200).send(id);
      } catch (err) {
        next(err);
      }
    }
  });
}

async function deleteFoxMemes(req, res, next) {
      try {
        let id = req.params.id;
        await FoxMeme.findByIdAndDelete(id);
        res.status(200).send('fox delete');
      } catch (err) {
        next(err);
      }
    }


async function putFoxs(req, res, next) {
      try {
        let id = req.params.id;
        req.body.memeURL = await memeGeneratorFoxMeme(req.body, res, next);
        let updatedFoxMeme = req.body;
        console.log(req.body);
        let updatedFoxMemeFromDB = await FoxMeme.findByIdAndUpdate(
          id,
          updatedFoxMeme,
          {
            new: true,
            overwrite: true,
          }
        );
        res.status(200).send(updatedFoxMemeFromDB);
      } catch (err) {
        next(err);
      }
    }
//   });
// }

app.get("/hello", (request, response) => {
  response.send("It's alive!");
});

app.get("/test", (request, response) => {
  response.send("test request received");
});

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send(error.message);
});

app.get("*", (req, res) => {
  res.send("The resource does not exist");
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
