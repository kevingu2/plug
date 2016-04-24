/**
 * Config var for app
**/
module.exports = {
  mongoDBUrl: process.env.MONGODB_URL || process.env.MONGOLAB_URI  || 'mongodb://localhost:27017/plug',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'mysecret'
};