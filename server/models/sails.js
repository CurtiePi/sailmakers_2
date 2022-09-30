import mongoose from 'mongoose';

const SailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }

}

const Sail = mongoose.model('Sail', SailSchema)

export default Sail;
