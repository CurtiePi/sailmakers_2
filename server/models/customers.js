import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
    },
    phone: {
        type: String,
    },
    quotes: [{type: mongoose.Schema.ObjectId, ref: 'Quote'}],
    club: {
        type: String
    },
    boat_model: {
        type: String
    },
    boat_home: {
        type: String,
    },
    boat_name: {
        type: String,
    },
    cnotes: {
        type: String
    }
}, {
    timestamps: true
});

CustomerSchema.index({fname: 1, lname: 1, email: 1}, {unique: true});
CustomerSchema.methods.getFullname = function () {

    fullName = `${this.fname} ${this.lname}`
    return fullName
}

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;
