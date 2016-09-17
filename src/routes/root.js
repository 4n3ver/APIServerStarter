/* @flow */
"use strict";

import { Router } from "express";
import authentication from "../controllers/authentication";
import {
    requireAuth,
    requireCorrectInfo
} from "../middlewares/authentication";

const router = Router();

router.get("/", requireAuth, (req, resp) =>
    resp.send({message: "hellow mellow"}));
router.post("/signin", requireCorrectInfo, (req, resp, next) => {
    resp.send(authentication.signin(req.user));
});
router.post("/signup", (req, resp, next) => {
    authentication.signup(
        req.body.email,
        req.body.password,
        (err, token) => {
            if (err) {
                if (err.httpStatus) {
                    resp.status(err.httpStatus).send({error: err.message});
                }
                next(err);
            } else {
                resp.json(token);
            }
        }
    );
});

export default router;
