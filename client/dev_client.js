require('dotenv').config()
const {TwitterApi} = require('twitter-api-v2');

const dev_client = new TwitterApi(process.env.APP_TOKEN);

module.exports = dev_client;