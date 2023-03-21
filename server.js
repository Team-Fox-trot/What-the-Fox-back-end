'use strict'

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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

app.get("/test", (request, response) => {
  response.send("test request received");
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));