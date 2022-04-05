var mongoose        = require('mongoose');

var SailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }

}


module.exports = mongoose.model('Sail', SailSchema)
