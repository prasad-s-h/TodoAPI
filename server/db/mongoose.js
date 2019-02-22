
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect( process.env.MONGODB_URI , {useNewUrlParser: true} )
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
