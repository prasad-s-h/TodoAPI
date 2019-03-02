
const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.statics.findByToken = function(token){
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'secretKey');
    } catch (error) {
        return Promise.reject('issue with token');
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next) {
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(!err){
                    user.password = hash;
                    next();
                }
            });
        });
    }else {
        next();
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
