module.exports.isProduction = process.env.NODE_ENV === 'production'
module.exports.secret = 'secret'
module.exports.mongodbUri = process.env.MONGODB_URI
module.exports.port = process.env.PORT || 3000
