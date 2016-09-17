/* @flow */
"use strict";

import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import LocalStrategy from "passport-local";
import User from "../models/User";
import { SECRET } from "../config";

const localOptions = {
    usernameField: "email"
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey   : SECRET
};

const localLogin = new LocalStrategy(localOptions,
    (email, password, done) => {
        User.findOne({email}, (err, foundUser) => {
            if (err) {
                done(err, false);
            } else if (foundUser) {
                foundUser.comparePassword(password, (err, isMatch) => {
                    if (err) {
                        done(err);
                    } else if (isMatch) {
                        done(null, foundUser);
                    } else {
                        done(null, false);
                    }
                });
            } else {
                done(null, false);
            }
        });
    });

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub, (err, foundUser) => {
        if (err) {
            done(err, false);
        } else if (foundUser) {
            done(null, foundUser);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);

export const requireAuth = passport.authenticate("jwt", {session: false});
export const requireCorrectInfo = passport.authenticate("local",
                                                        {session: false});
