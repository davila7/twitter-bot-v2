require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


//davinci
async function main() {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: 'Hola cómo estás?', // cambia este prompt para generar diferente texto
        temperature: 0.5,
        max_tokens: 250,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["."],
    });
    respuesta = completion.data.choices[0].text;

    console.log(respuesta);
}

main();