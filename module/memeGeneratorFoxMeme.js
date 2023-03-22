const axios = require('axios');

const memeGeneratorFoxMeme = async (req, res, next) => {
  let imgUrl = req.imgUrl;
  let userInput = req.userInput;
  let requestURL = `https://memebuild.com/api/1.0/generateMeme?api-key=${process.env.HEADERS_API_KEY}`
  try {
    let FoxMemeResults = await axios.post(requestURL,
      
      {
      bottomText: userInput,
      imgUrl: imgUrl
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    return FoxMemeResults.data.url;
  } catch (error) {
    next(error);
  }
};

module.exports = memeGeneratorFoxMeme;