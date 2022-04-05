var mongoose        = require('mongoose');

var SalespersonSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    phone: {
        type: String
    },
    get_mail: {
        type: Boolean,
    },
    quotes: [{type: mongoose.Schema.ObjectId, ref: 'Quote'}],
}, {
    timestamps: true
});


SalespersonSchema.methods.getFullName = function() {

    fullName = `${this.fname} ${this.lname}`
    return fullName

}

module.exports = mongoose.model('Salesperson', SalespersonSchema);
