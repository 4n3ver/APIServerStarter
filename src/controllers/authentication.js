"use strict";

import { encode } from "jwt-simple";
import User from "../models/User";
import { SECRET } from "../config";

const genUserToken = user => encode(
    {
        sub: user.id,               // subject
        iat: new Date().getTime()   // issued at time
    }, SECRET);

export default {
    signup: (email, password, callback) => {
        if (email && password) {
            User.findOne({email}, (err, foundUser) => {
                if (err) {
                    callback(err);
                } else if (foundUser) {
                    callback(
                        Object.assign(
                            new Error("User with that email already exists"), {
                                httpStatus: 422
                            })
                    );
                } else {    // success
                    const newUser = new User({
                        email,
                        password
                    });
                    newUser.save(err => err
                        ? callback(err)
                        : callback(null, {token: genUserToken(newUser)}));
                }
            });
        } else {
            callback(
                Object.assign(
                    new Error("You must provide email and password!"), {
                        httpStatus: 422
                    })
            );
        }
    },

    // user is authenticated, need to gen token
    signin: user => ({token: genUserToken(user)})
};
