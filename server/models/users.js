
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
    let token = jwt.sign({ _id: newUser._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    // first way, if it causes problem, follow second way
    newUser.tokens.push({access, token});

    //second way
    // newUser.tokens = newUser.tokens.concat([{access, token}]);

    return newUser.save().then( () => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    let user = this;

    return user.update({
        $pull : {
            tokens: {token}
        }
    });
};

UserSchema.statics.findByToken = function(token){
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
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

UserSchema.statics.findByCredentials = function(email, password){
    let User = this;
    return User.findOne({email})
     .then( (user) => {
        if(!user) {
            return Promise.reject('incorrect email/password');
        }
        
        return new Promise((resolve, reject)=>{
            let hashedDbUserPwd = user.password;
            bcrypt.compare(password, hashedDbUserPwd, (err, success) => {
                if(!success) return reject('incorrect email/password');
                return resolve(user);
            });
         });

     });
};

let User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
