require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//Dall-e
async function main() {
    const prompt = ""; // fill this prompt
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    });
    
    console.log(response.data.data[0].url);
};

main()
  