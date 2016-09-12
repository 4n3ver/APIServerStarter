"use strict";

import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

// define schema
const userSchema = new mongoose.Schema({
    email   : {
        type     : String,
        unique   : true,
        lowercase: true
    },
    password: String
});

// on save hook, hash password
// ran before model is saved
userSchema.pre("save", function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        if (!err) {
            bcrypt.hash(this.password, salt, null, (err, hash) => {
                if (!err) {
                    this.password = hash;
                    next();
                } else {
                    next(err);
                }
            });
        } else {
            next(err);
        }
    });
});

userSchema.methods.comparePassword = function (maybePassword, callback) {
    bcrypt.compare(maybePassword, this.password,
                   (err, isMatch) => err
                       ? callback(err)
                       : callback(null, isMatch));
};

// create model class based on schema
const UserModelClass = mongoose.models.user
    // workaround with es6, somehow mongoose try to call this on every import
    ? mongoose.model("user")
    : mongoose.model("user", userSchema);   // not allowed to call this twice

// export model class
export default UserModelClass;
