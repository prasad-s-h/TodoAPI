
const mongoose = require('mongoose');
const db = {
    localhost: 'mongodb://localhost:27017/ToDos',
    mongoAtlas: process.env.MONGODB_URI
  };

mongoose.Promise = global.Promise;
mongoose.connect( db.mongoAtlas , {useNewUrlParser: true} )
.then( () => {
    console.log('connected to db');
})
.catch( (e) => {
    console.log('failed to connect due to following error');
    console.log(e);
});

module.exports = {
    mongoose
};
