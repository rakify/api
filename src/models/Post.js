const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({    
    username: {
        type       : String
    },
    title: {
        type       : String,
        trim       : true,
        maxlength  : 100,
        required   : true 
    },
    body: {
        type       : String,
        unique     : true,
        trim       : true,
        minlength  : 10,
        maxlength  : 1000,
        required   : true
    },

}, {timestamps: true}
);

module.exports = mongoose.model('Posts',PostSchema);