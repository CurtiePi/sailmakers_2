import mongoose from  'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        default: 'CaptainDave'
    },
    password: {
        type: String
    }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

export default User;
