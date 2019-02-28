
const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        },
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function(){
    let newUser = this;
    let newUserObject = newUser.toObject();

    return _.pick(newUserObject, ['_id','email']);
};

UserSchema.methods.generateAuthToken = function(){
    let newUser = this;
    let access = 'auth';
    let token = jwt.sign({ _id: newUser._id.toHexString(), access}, 'secretKey').toString();

    // first way, if it causes problem, follow second way
    newUser.tokens.push({access, token});

    //second way
    // newUser.tokens = newUser.tokens.concat([{access, token}]);

    return newUser.save().then( () => {
        return token;
    });
};

let User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
