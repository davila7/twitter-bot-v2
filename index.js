const dev_client = require('./client/dev_client.js');
const user_client = require('./client/user_client.js');
const openai = require('./client/openai.js');


const {ETwitterStreamEvent} = require('twitter-api-v2');

async function main(){
    
    //Get the user
    const user = await user_client.v2.me();
    //console.log(user);
    let user_id = ''; // change this to your own user_id

    const rules = await dev_client.v2.streamRules();
    console.log(rules);

    // uncomment to remove old rules
    // await dev_client.v2.updateStreamRules({
    //     delete: { ids: rules.data.map( rule => rule.id) }
    // })

    // create a rule
    let rule = '#CodeGPT'; // change this to your own rule

    // uncomment to add a new rules
    // await dev_client.v2.updateStreamRules({
    //     add: [{ value: rule } ],
    // });


    // start the stream to get twitter data
    const stream = dev_client.v2.searchStream({
        'tweet.fields' : ['referenced_tweets', 'author_id']
    });

    (await stream).on(ETwitterStreamEvent.Data, async tweet => {
        console.log(tweet.data.author_id);
        console.log(tweet.data.text);

        // Ignore retweets and also tweets from the same bot
        const isARt = tweet.data.referenced_tweets?.some(tweet => tweet.type === 'retweeted') ?? false;
        console.log(isARt);
        if (isARt || tweet.data.author_id === user_id) {
            return;
        }

        // like
        // await user_client.v2.like(user_id, tweet.data.id);

        // retweet
        // await user_client.v2.retweet(user_id, tweet.data.id);

        // reply tweet with a text
        // await user_client.v1.reply('I like this!', tweet.data.id);

        // reply to the tweet with openai
        let respuesta = '';
        // le sacamos la regla al tweet y obtenemos el texto limpio
        const clear_text = tweet.data.text.replace(regla, '');

        // creamos el prompt inicial "one show prompt" con un chat de ejemplo para dar contexto a openai
        const one_shot_prompt = 'Twitter Bot: Preguntame algo sobre Javascript. '+
        'Yo: Claro, Cuando se creó el lenguaje javascript? '+
        'Twitter Bot: El lenguaje se creó en 1995. '+
        'Yo: '+clear_text;

        try{  

            // davinci
            // descomenta esto para obtener texto generado por openai a partir del tweet
            // const completion = await openai.createCompletion({
            //     model: 'text-davinci-003',
            //     prompt: one_shot_prompt,
            //     temperature: 0.5,
            //     max_tokens: 250,
            //     top_p: 1.0,
            //     stop: ["Yo:"]
            // });
            // respuesta = completion.data.choices[0].text

            //dall-e
            // descomenta esto para obtener una imagen generada por openai del tweet
            // const response = await openai.createImage({
            //     prompt: clear_text,
            //     n: 1,
            //     size: '1024x1024'
            // });
            // respuesta = response.data.data[0].url;
            
        }catch(error){
            console.log(error);
        }

        await user_client.v1.reply(respuesta, tweet.data.id);
        
    });

};

main();