const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({    
    username: {
        type       : String,
        unique     : true,
        trim       : true,
        minlength  : 3,
        required   : true
    },
    password: {
        type       : String,
        minlength  : 3,
        required   : true
    },
    email: {
        type       : String,
        trim       : true
    },
}, {timestamps: true}
);

module.exports = mongoose.model('Users',UserSchema);
// New collection created to the database with the name and the Schema will be used to validate the document