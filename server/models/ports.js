import mongoose from 'mongoose';

const PortSchema = new mongoose.Schema({
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


const Port = mongoose.model('Port', PortSchema);

export default Port;
