module.exports.isProduction = process.env.NODE_ENV === 'production'
module.exports.secret = process.env.SECRET || 'secret'
module.exports.mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/oba-server'
module.exports.port = process.env.PORT || 3000