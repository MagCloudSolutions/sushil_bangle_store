const { Schema, model } = require('mongoose');

const authSchema = Schema({
    fullName: {
        type: String,
        minLength: 3,
        maxLength: 20,
        trim: true,
        required: [true, "Provide Full Name"]
    },
    email: {
        type: String,
        required: [true, "Provide Email Address"],
        unique: [true, "Email already exists"],
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        minLength: 8,
        required: [true, "Provide Password"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},
    { toJSON: { transform(doc, ret) { delete ret.password } } });  // Exclude password from JSON

const UserAuth = model('UserAuth', authSchema);

module.exports = UserAuth;