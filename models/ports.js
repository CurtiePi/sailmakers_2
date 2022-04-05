var mongoose        = require('mongoose');

var PortSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    abbrev: {
        type: String,
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Port', PortSchema);
