const dev_client = require('./client/dev_client.js');
const user_client = require('./client/user_client.js');
const openai = require('./client/openai.js');

const {ETwitterStreamEvent} = require('twitter-api-v2');

async function main(){
    
    //user
    const user = await user_client.v2.me();
    //console.log(user);
    let user_id = '1598408860720570384'; //cambia esto a tu propio user id

    const rules = await dev_client.v2.streamRules();
    console.log(rules);

    // await dev_client.v2.updateStreamRules({
    //     delete: { ids: rules.data.map( rule => rule.id) }
    // })

    // await dev_client.v2.updateStreamRules({
    //     add: [{ value: '#CodeGPT' } ],
    // });

    const stream = dev_client.v2.searchStream({
        'tweet.fields' : ['referenced_tweets', 'author_id']
    });

    (await stream).on(ETwitterStreamEvent.Data, async tweet => {
        console.log(tweet.data.author_id);
        console.log(tweet.data.text);

        // Ignore RTs or self-sent tweets
        const isARt = tweet.data.referenced_tweets?.some(tweet => tweet.type === 'retweeted') ?? false;
        console.log(isARt);
        if (isARt || tweet.data.author_id === "1598408860720570384") {
            return;
        }

        //like
        // await user_client.v2.like(user_id, tweet.data.id);

        // //retweet
        // await user_client.v2.retweet(user_id, tweet.data.id);

        //reply
        let respuesta = '';
        const clean_text = tweet.data.text.replace('#CodeGPT', '');
        const one_shot_prompt = 'Twitter Bot: Preguntame algo sobre sobre Javascript. '+
        'Yo: Claro, cuando se creó el lenguaje? '+
        'Twitter Bot: El lenguaje se creó en 1995. '+
        'Yo: '+clean_text;
        console.log(one_shot_prompt);
        try{
            //davinci
            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: one_shot_prompt,
                temperature: 0.5,
                max_tokens: 250,
                top_p: 1.0,
                frequency_penalty: 0.5,
                presence_penalty: 0.0,
                stop: ["Yo:"],
            });
            respuesta = "Davinci: "+completion.data.choices[0].text;

            //dall-e
            const response = await openai.createImage({
                prompt: clean_text,
                n: 1,
                size: '1024x1024'
            });
            respuesta = "Dall-e: "+response.data.data[0].url;
        }
        catch(error)
        {
            console.log(error);
        }
        await user_client.v1.reply(respuesta, tweet.data.id);
    });
};

main();