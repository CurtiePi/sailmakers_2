var mongoose        = require('mongoose');

var TransactionSchema = new mongoose.Schema({
    salesperson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salesperson',
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    trans_type: {
        type: String
    },
    quote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote'
    },
    follow_up: {
        type: String
    },
    commission: {
        type: String
    },
    commision_paid: {
        type: Boolean
    },
    amount: {
        type: Number
    },
    sail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sail'
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('Transaction', TransactionSchema);
