
let {mongoose} = require('../db/mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    userName:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
