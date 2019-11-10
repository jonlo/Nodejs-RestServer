const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: [true, 'categories must be unique']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});


module.exports = mongoose.model('Category', categorySchema);