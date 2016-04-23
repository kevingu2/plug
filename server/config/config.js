/**
 * Config var for app
**/
module.exports = {
  mongoDBUrl: process.env.MONGOLAB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/plug',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'mysecret'
};
