const dotenv = require('dotenv')

// Load env vars into Serverless environment
module.exports = async () => dotenv.config({path: '../.env'}).parsed
