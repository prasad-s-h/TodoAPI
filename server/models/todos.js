
let {mongoose} = require('../db/mongoose');

let Schema = mongoose.Schema;

let TodoSchema = new Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    completedAt: {
        type: String,
        default: "0"
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }   
});

let Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
    Todo
};
