require('dotenv').config()

// Twitter v2 Dev Client
const {TwitterApi} = require('twitter-api-v2');

const dev_client = new TwitterApi(process.env.APP_TOKEN);

module.exports = dev_client;