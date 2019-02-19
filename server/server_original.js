
let {mongoose} = require('./db/mongoose');

let Schema = mongoose.Schema;

let TodoSchema = new Schema({
    text: String,
    completed: {
        type: Boolean,
        required: true
    },
    completedAt: Number
});

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

// creating class model and instantiating them thus getting the documents
let Todo = mongoose.model('Todo', TodoSchema);
let users = mongoose.model('users', UserSchema);

let newTodo = new Todo({
    text: 'breakfast',
    completed: false,
    completedAt: 8
});

let newUser = new users({
    userName: 'prasad',
    email: 'prasads367@gmail.com'
});

newTodo.save().then( (doc)=>{
    console.log('document saved successfully');
    console.log(doc);
}, (e)=>{
    console.log('note down the following error ');
    console.log(e);
});

newUser.save().then( (doc)=>{
    console.log('document saved successfully');
    console.log(doc);
}, (e)=>{
    console.log('note down the following error ');
    console.log(e);
});
