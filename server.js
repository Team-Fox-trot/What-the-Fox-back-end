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
app.put("/foxMemes/:id/like", async (req, res, next) => {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.status(401).send('Invalid token: ' + err.message);
      return;
    }

    try {
      let foxMemeId = req.params.id;
      let userId = user.sub;

      await FoxMeme.findByIdAndUpdate(foxMemeId, { $addToSet: { likes: userId } });

      res.status(200).send("Liked successfully");
    } catch (err) {
      next(err);
    }
  });
});

app.put("/foxMemes/:id/unlike", async (req, res, next) => {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send("invalid token");
    } else {
      try {
        let foxMemeId = req.params.id;
        let userId = user.sub;
        
        // Remove the user's ID from the likes array of the fox meme
        await FoxMeme.findByIdAndUpdate(foxMemeId, { $pull: { likes: userId } });

        res.status(200).send("Unliked successfully");
      } catch (err) {
        next(err);
      }
    }
  });
});

async function getFoxMemes(req, res, next) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send("invalid token");
    } else {
      try {
        // Assume the user's ID is available as user.sub
        const userId = user.sub;
        
        // Modify the MongoDB query to filter by user ID
        let results = await FoxMeme.find({ userId: userId });
        
        res.status(200).send(results);
        console.log("get foxes");
      } catch (err) {
        next(err);
      }
    }
  });
}

async function postFoxMemes(req, res, next) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send("invalid token");
    } else {
      try {
        req.body.memeURL = await memeGeneratorFoxMeme(req.body, res, next);
        req.body.userId = user.sub; // Set the userId field
        
        let createdFoxMeme = await FoxMeme.create(req.body);
        
        res.status(200).send(createdFoxMeme);
      } catch (err) {
        next(err);
      }
    }
  });
}

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

// Catch-all route
app.get("*", (req, res) => {
  res.status(404).send("The resource does not exist");
});

// Error handling middleware
app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
