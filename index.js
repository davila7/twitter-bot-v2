const dev_client = require('./client/dev_client.js');
const user_client = require('./client/user_client.js');

const {ETwitterStreamEvent} = require('twitter-api-v2');

async function main(){
    
    //user
    const user = await user_client.v2.me();
    //console.log(user);
    let user_id = '1598408860720570384';

    const rules = await dev_client.v2.streamRules();
    //console.log(rules);

    // await dev_client.v2.updateStreamRules({
    //     delete: { ids: rules.data.map( rule => rule.id) }
    // })

    // await dev_client.v2.updateStreamRules({
    //     add: [{ value: 'Javascript'} , {value: 'Nodejs' }],
    // });

    const stream = dev_client.v2.searchStream({
        'tweet.fields' : ['referenced_tweets', 'author_id']
    });

    (await stream).on(ETwitterStreamEvent.Data, async tweet => {
        console.log(tweet.data.author_id);
        console.log(tweet.data.text);

        //like
        await user_client.v2.like(user_id, tweet.data.id);

        //retweet
        await user_client.v2.retweet(user_id, tweet.data.id);

        //reply
        await user_client.v1.reply('I like this!', tweet.data.id);
        
    });


};

main();