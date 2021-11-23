import mongoose from "mongoose";

import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    hash: String,
}, {timestamps: true});

export default mongoose.model('User', UserSchema);